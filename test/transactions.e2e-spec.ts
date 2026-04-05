import { INestApplication } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Role, TransactionType } from '@prisma/client/index';
import * as bcrypt from 'bcrypt';
import request = require('supertest');
import { PrismaService } from '../src/prisma/prisma.service';
import { createTestApp } from './test-app.helper';

jest.setTimeout(30_000);

const PASSWORD = 'SecurePass123!';

describe('Transactions (e2e)', () => {
  let app: INestApplication;
  let prisma: PrismaService;

  let adminToken = '';
  let analystToken = '';
  let viewerToken = '';

  let adminUserId = '';
  let analystUserId = '';
  let viewerUserId = '';

  beforeAll(async () => {
    const testContext = await createTestApp();
    app = testContext.app;
    prisma = testContext.prisma;

    await prisma.transaction.deleteMany();
    await prisma.user.deleteMany({
      where: {
        email: {
          in: [
            'tx-admin@example.com',
            'tx-analyst@example.com',
            'tx-viewer@example.com',
          ],
        },
      },
    });

    const passwordHash = await bcrypt.hash(PASSWORD, 10);

    const admin = await prisma.user.create({
      data: {
        email: 'tx-admin@example.com',
        name: 'TX Admin',
        role: Role.ADMIN,
        passwordHash,
      },
    });

    const analyst = await prisma.user.create({
      data: {
        email: 'tx-analyst@example.com',
        name: 'TX Analyst',
        role: Role.ANALYST,
        passwordHash,
      },
    });

    const viewer = await prisma.user.create({
      data: {
        email: 'tx-viewer@example.com',
        name: 'TX Viewer',
        role: Role.VIEWER,
        passwordHash,
      },
    });

    adminUserId = admin.id;
    analystUserId = analyst.id;
    viewerUserId = viewer.id;

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
            in: [
              'tx-admin@example.com',
              'tx-analyst@example.com',
              'tx-viewer@example.com',
            ],
          },
        },
      });
    }

    if (app) {
      await app.close();
    }
  });

  it('blocks viewer from creating a transaction', async () => {
    await request(app.getHttpServer())
      .post('/api/v1/transactions')
      .set('Authorization', `Bearer ${viewerToken}`)
      .send({
        amount: 99.99,
        type: 'EXPENSE',
        category: 'snacks',
        date: '2026-03-10',
      })
      .expect(403);
  });

  it('allows analyst to create own transaction', async () => {
    const response = await request(app.getHttpServer())
      .post('/api/v1/transactions')
      .set('Authorization', `Bearer ${analystToken}`)
      .send({
        amount: 2200,
        type: 'INCOME',
        category: 'bonus',
        date: '2026-03-12',
        notes: 'Performance bonus',
      })
      .expect(201);

    expect(response.body.data.userId).toBe(analystUserId);
  });

  it('limits viewer list to own transactions only', async () => {
    await prisma.transaction.create({
      data: {
        amount: 350,
        category: 'food',
        type: TransactionType.EXPENSE,
        date: new Date('2026-03-02'),
        userId: viewerUserId,
      },
    });

    let list: Array<{ userId: string | null }> = [];

    for (let attempt = 0; attempt < 3; attempt += 1) {
      const response = await request(app.getHttpServer())
        .get('/api/v1/transactions')
        .set('Authorization', `Bearer ${viewerToken}`)
        .expect(200);

      list = response.body.data.data as Array<{ userId: string | null }>;
      if (list.some((item) => item.userId === viewerUserId)) {
        break;
      }
    }

    expect(list.some((item) => item.userId === viewerUserId)).toBe(true);
    expect(list.every((item) => item.userId === viewerUserId)).toBe(true);
  });

  it('prevents analyst from updating admin transaction', async () => {
    const adminTx = await prisma.transaction.create({
      data: {
        amount: 700,
        category: 'ops',
        type: TransactionType.EXPENSE,
        date: new Date('2026-03-03'),
        userId: adminUserId,
      },
    });

    const response = await request(app.getHttpServer())
      .patch(`/api/v1/transactions/${adminTx.id}`)
      .set('Authorization', `Bearer ${analystToken}`)
      .send({ notes: 'Unauthorized edit attempt' });

    expect([403, 404]).toContain(response.status);
  });

  it('allows admin soft delete', async () => {
    const analystTx = await prisma.transaction.create({
      data: {
        amount: 1000,
        category: 'salary',
        type: TransactionType.INCOME,
        date: new Date('2026-03-01'),
        userId: analystUserId,
      },
    });

    let status = 0;
    for (let attempt = 0; attempt < 3; attempt += 1) {
      const response = await request(app.getHttpServer())
        .delete(`/api/v1/transactions/${analystTx.id}`)
        .set('Authorization', `Bearer ${adminToken}`);

      status = response.status;
      if (status === 204) {
        break;
      }
    }

    expect(status).toBe(204);

    const deletedTx = await prisma.transaction.findUniqueOrThrow({ where: { id: analystTx.id } });
    expect(deletedTx.isDeleted).toBe(true);
  });
});

