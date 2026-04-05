import { INestApplication } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Role, TransactionType } from '@prisma/client/index';
import * as bcrypt from 'bcrypt';
import request = require('supertest');
import { PrismaService } from '../src/prisma/prisma.service';
import { createTestApp } from './test-app.helper';

jest.setTimeout(30_000);

const PASSWORD = 'SecurePass123!';

describe('Dashboard (e2e)', () => {
  let app: INestApplication;
  let prisma: PrismaService;

  let adminToken = '';
  let analystToken = '';
  let viewerToken = '';

  beforeAll(async () => {
    const testContext = await createTestApp();
    app = testContext.app;
    prisma = testContext.prisma;

    await prisma.transaction.deleteMany();
    await prisma.user.deleteMany({
      where: {
        email: {
          in: ['dash-admin@example.com', 'dash-analyst@example.com', 'dash-viewer@example.com'],
        },
      },
    });

    const passwordHash = await bcrypt.hash(PASSWORD, 10);

    const admin = await prisma.user.create({
      data: {
        email: 'dash-admin@example.com',
        name: 'Dash Admin',
        role: Role.ADMIN,
        passwordHash,
      },
    });

    const analyst = await prisma.user.create({
      data: {
        email: 'dash-analyst@example.com',
        name: 'Dash Analyst',
        role: Role.ANALYST,
        passwordHash,
      },
    });

    const viewer = await prisma.user.create({
      data: {
        email: 'dash-viewer@example.com',
        name: 'Dash Viewer',
        role: Role.VIEWER,
        passwordHash,
      },
    });

    await prisma.transaction.createMany({
      data: [
        {
          amount: 3000,
          type: TransactionType.INCOME,
          category: 'salary',
          date: new Date('2026-01-01'),
          userId: analyst.id,
        },
        {
          amount: 800,
          type: TransactionType.EXPENSE,
          category: 'rent',
          date: new Date('2026-01-05'),
          userId: viewer.id,
        },
      ],
    });

    const jwtService = new JwtService();
    const accessSecret = process.env.JWT_ACCESS_SECRET ?? 'test_access_secret_minimum_length_12345';

    adminToken = jwtService.sign(
      { sub: admin.id, email: admin.email, role: admin.role },
      { secret: accessSecret, expiresIn: '15m' },
    );

    analystToken = jwtService.sign(
      { sub: analyst.id, email: analyst.email, role: analyst.role },
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
            in: ['dash-admin@example.com', 'dash-analyst@example.com', 'dash-viewer@example.com'],
          },
        },
      });
    }

    if (app) {
      await app.close();
    }
  });

  it('allows viewer to access summary', async () => {
    const response = await request(app.getHttpServer())
      .get('/api/v1/dashboard/summary')
      .set('Authorization', `Bearer ${viewerToken}`)
      .expect(200);

    expect(response.body.data).toMatchObject({
      totalIncome: expect.any(Number),
      totalExpense: expect.any(Number),
      netBalance: expect.any(Number),
      transactionCount: expect.any(Number),
    });
  });

  it('blocks viewer from trends endpoint', async () => {
    await request(app.getHttpServer())
      .get('/api/v1/dashboard/trends?year=2026')
      .set('Authorization', `Bearer ${viewerToken}`)
      .expect(403);
  });

  it('allows analyst to access trends endpoint', async () => {
    const response = await request(app.getHttpServer())
      .get('/api/v1/dashboard/trends?year=2026')
      .set('Authorization', `Bearer ${analystToken}`)
      .expect(200);

    expect(Array.isArray(response.body.data)).toBe(true);
    expect(response.body.data).toHaveLength(12);
  });

  it('allows admin to access recent endpoint', async () => {
    const response = await request(app.getHttpServer())
      .get('/api/v1/dashboard/recent?limit=5')
      .set('Authorization', `Bearer ${adminToken}`)
      .expect(200);

    expect(Array.isArray(response.body.data)).toBe(true);
  });
});

