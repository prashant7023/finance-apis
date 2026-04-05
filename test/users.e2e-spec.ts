import { INestApplication } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Role } from '@prisma/client/index';
import * as bcrypt from 'bcrypt';
import request = require('supertest');
import { PrismaService } from '../src/prisma/prisma.service';
import { createTestApp } from './test-app.helper';

jest.setTimeout(30_000);

const PASSWORD = 'SecurePass123!';

describe('Users (e2e)', () => {
  let app: INestApplication;
  let prisma: PrismaService;

  let adminToken = '';
  let viewerToken = '';

  let targetUserId = '';

  beforeAll(async () => {
    const testContext = await createTestApp();
    app = testContext.app;
    prisma = testContext.prisma;

    await prisma.transaction.deleteMany();
    await prisma.user.deleteMany({
      where: {
        email: {
          in: ['users-admin@example.com', 'users-viewer@example.com', 'users-target@example.com'],
        },
      },
    });

    const passwordHash = await bcrypt.hash(PASSWORD, 10);

    const admin = await prisma.user.create({
      data: {
        email: 'users-admin@example.com',
        name: 'Users Admin',
        role: Role.ADMIN,
        passwordHash,
      },
    });

    const viewer = await prisma.user.create({
      data: {
        email: 'users-viewer@example.com',
        name: 'Users Viewer',
        role: Role.VIEWER,
        passwordHash,
      },
    });

    const target = await prisma.user.create({
      data: {
        email: 'users-target@example.com',
        name: 'Target User',
        role: Role.VIEWER,
        passwordHash,
      },
    });

    targetUserId = target.id;

    const jwtService = new JwtService();
    const accessSecret = process.env.JWT_ACCESS_SECRET ?? 'test_access_secret_minimum_length_12345';

    adminToken = jwtService.sign(
      { sub: admin.id, email: admin.email, role: admin.role },
      { secret: accessSecret, expiresIn: '15m' },
    );

    viewerToken = jwtService.sign(
      { sub: viewer.id, email: viewer.email, role: viewer.role },
      { secret: accessSecret, expiresIn: '15m' },
    );
  });

  afterAll(async () => {
    if (prisma) {
      await prisma.transaction.deleteMany();
      await prisma.user.deleteMany({
        where: {
          email: {
            in: ['users-admin@example.com', 'users-viewer@example.com', 'users-target@example.com'],
          },
        },
      });
    }

    if (app) {
      await app.close();
    }
  });

  it('allows admin to list users with pagination', async () => {
    const response = await request(app.getHttpServer())
      .get('/api/v1/users?page=1&limit=10')
      .set('Authorization', `Bearer ${adminToken}`)
      .expect(200);

    expect(Array.isArray(response.body.data.data)).toBe(true);
    expect(response.body.data.total).toBeGreaterThanOrEqual(1);
  });

  it('blocks viewer from listing users', async () => {
    await request(app.getHttpServer())
      .get('/api/v1/users?page=1&limit=10')
      .set('Authorization', `Bearer ${viewerToken}`)
      .expect(403);
  });

  it('allows admin to assign role and toggle status', async () => {
    const roleResponse = await request(app.getHttpServer())
      .patch(`/api/v1/users/${targetUserId}/role`)
      .set('Authorization', `Bearer ${adminToken}`)
      .send({ role: 'ANALYST' })
      .expect(200);

    expect(roleResponse.body.data.role).toBe('ANALYST');

    const statusResponse = await request(app.getHttpServer())
      .patch(`/api/v1/users/${targetUserId}/status`)
      .set('Authorization', `Bearer ${adminToken}`)
      .expect(200);

    expect(['ACTIVE', 'INACTIVE']).toContain(statusResponse.body.data.status);
  });
});

