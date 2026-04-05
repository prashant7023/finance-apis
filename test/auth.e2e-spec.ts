import { INestApplication } from '@nestjs/common';
import request = require('supertest');
import { PrismaService } from '../src/prisma/prisma.service';
import { createTestApp } from './test-app.helper';

jest.setTimeout(30_000);

describe('Auth (e2e)', () => {
  let app: INestApplication;
  let prisma: PrismaService;

  beforeAll(async () => {
    const testContext = await createTestApp();
    app = testContext.app;
    prisma = testContext.prisma;
  });

  afterAll(async () => {
    if (app) {
      await app.close();
    }
  });

  it('registers a new user with sanitized response', async () => {
    const email = `register_${Date.now()}@example.com`;

    const response = await request(app.getHttpServer())
      .post('/api/v1/auth/register')
      .send({
        email,
        password: 'SecurePass123!',
        name: 'E2E Register User',
      })
      .expect(201);

    expect(response.body.data.email).toBe(email);
    expect(response.body.data.passwordHash).toBeUndefined();
    expect(response.body.data.refreshTokenHash).toBeUndefined();

    await prisma.user.deleteMany({ where: { email } });
  });

  it('rejects invalid credentials with generic error', async () => {
    const email = `wrongpass_${Date.now()}@example.com`;

    await request(app.getHttpServer()).post('/api/v1/auth/register').send({
      email,
      password: 'SecurePass123!',
      name: 'Wrong Pass User',
    });

    const response = await request(app.getHttpServer())
      .post('/api/v1/auth/login')
      .send({ email, password: 'WrongPass123!' })
      .expect(401);

    expect(response.body.message).toBe('Invalid credentials');

    await prisma.user.deleteMany({ where: { email } });
  });

  it('rotates refresh token and invalidates old token after logout', async () => {
    const email = `rotation_${Date.now()}@example.com`;

    await request(app.getHttpServer()).post('/api/v1/auth/register').send({
      email,
      password: 'SecurePass123!',
      name: 'Rotation User',
    });

    const loginResponse = await request(app.getHttpServer())
      .post('/api/v1/auth/login')
      .send({ email, password: 'SecurePass123!' })
      .expect(200);

    const accessToken = loginResponse.body.data.accessToken as string;
    const refreshToken = loginResponse.body.data.refreshToken as string;

    const refreshResponse = await request(app.getHttpServer())
      .post('/api/v1/auth/refresh')
      .set('Authorization', `Bearer ${refreshToken}`)
      .expect(200);

    const rotatedRefreshToken = refreshResponse.body.data.refreshToken as string;

    await request(app.getHttpServer())
      .post('/api/v1/auth/logout')
      .set('Authorization', `Bearer ${accessToken}`)
      .expect(204);

    await request(app.getHttpServer())
      .post('/api/v1/auth/refresh')
      .set('Authorization', `Bearer ${rotatedRefreshToken}`)
      .expect(403);

    await prisma.user.deleteMany({ where: { email } });
  });
});
