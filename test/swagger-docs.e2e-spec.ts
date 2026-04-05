import { INestApplication } from '@nestjs/common';
import request = require('supertest');
import { PrismaService } from '../src/prisma/prisma.service';
import { createTestApp } from './test-app.helper';

jest.setTimeout(30_000);

describe('Swagger Docs (e2e)', () => {
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

    if (prisma) {
      await prisma.$disconnect();
    }
  });

  it('serves OpenAPI JSON for client generation', async () => {
    const response = await request(app.getHttpServer()).get('/docs-json').expect(200);

    expect(response.body.openapi).toBeDefined();
    expect(response.body.info).toMatchObject({
      title: 'Finance Dashboard API',
      version: '1.0',
    });

    const paths = response.body.paths as Record<string, unknown>;
    expect(paths).toBeDefined();

    const securitySchemes = response.body.components?.securitySchemes as
      | Record<string, unknown>
      | undefined;
    expect(securitySchemes).toBeDefined();
    expect(securitySchemes?.bearer).toBeDefined();

    const pathKeys = Object.keys(paths);
    expect(pathKeys.some((key) => key.endsWith('/auth/login'))).toBe(true);
    expect(pathKeys.some((key) => key.endsWith('/transactions'))).toBe(true);
  });
});
