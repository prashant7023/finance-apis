# Finance Data Processing and Access Control Backend

Backend implementation for the internship assessment.

## Stack

- Node.js 20+
- NestJS 10
- TypeScript strict mode
- PostgreSQL
- Prisma ORM
- JWT access and refresh tokens
- class-validator and class-transformer
- Swagger
- Jest and Supertest

## Core Features

- Authentication with register, login, refresh token rotation, and logout
- Role-based access control with VIEWER, ANALYST, and ADMIN
- User management for role assignment, status toggle, and deletion constraints
- Transaction CRUD with soft delete, pagination, filtering, and safe sorting
- Dashboard analytics for totals, categories, trends, and recent activity
- Global response and error shaping

## Business Rules Implemented

- VIEWER can only read own transactions
- ANALYST can create and update only own transactions
- ADMIN can manage users and all transactions
- Transaction deletion is soft delete only
- User deletion preserves financial history by nulling transaction owner reference
- Refresh tokens are hashed and rotated on every refresh

## Project Structure

```
finance-backend/
├── database/
│   ├── public/
│   │   └── migrations/
│   ├── master_data/
│   │   └── migrations/
│   └── data_tx/
│       └── migrations/
├── swagger-gen/
│   ├── openapitools.json
│   ├── generate-client.sh
│   ├── generate-finance-client.sh
│   ├── generate-client.ps1
│   └── generate-finance-client.ps1
├── prisma/
│   ├── schema.prisma
│   └── seed.ts
├── src/
│   ├── auth/
│   ├── users/
│   ├── transactions/
│   ├── dashboard/
│   ├── prisma/
│   ├── common/
│   ├── app.module.ts
│   └── main.ts
└── test/
    ├── auth.e2e-spec.ts
    ├── users.e2e-spec.ts
    ├── transactions.e2e-spec.ts
    ├── dashboard.e2e-spec.ts
    ├── swagger-docs.e2e-spec.ts
    └── test-app.helper.ts
```

## Database Schema Architecture

The database is split into three PostgreSQL schemas:

- public: shared objects and migration log table
- master_data: users, roles, user statuses
- data_tx: transaction data and transaction type enum

SQL migration files for this architecture are organized under:

- database/public/migrations
- database/master_data/migrations
- database/data_tx/migrations

Run order is documented in database/README.md.

## Setup

1. Install dependencies.

```bash
npm install
```

2. Copy environment values.

```bash
cp .env.example .env
```

3. Generate Prisma client.

```bash
npm run prisma:generate
```

4. Run migration.

```bash
npm run prisma:migrate -- --name init
```

If your hosted database blocks migration transactions, apply schema directly:

```bash
npm run prisma:push
```

Generate SQL migration script from Prisma schema:

```bash
npm run prisma:migrate:sql
```

5. Seed sample users and transactions.

```bash
npm run db:seed
```

6. Start API.

```bash
npm run start:dev
```

## Docker

Build the production image:

```bash
docker build -t finance-backend .
```

Run the container with environment variables:

```bash
docker run --rm -p 3000:3000 --env-file .env finance-backend
```

## API Base Paths

- API: `/api/v1`
- Swagger: `/docs`
- Swagger JSON: `/docs-json`
- Health: `/api/v1/health`

## Health Cron (Every 10 Minutes)

The app now includes a scheduler that can ping its own health endpoint every 10 minutes.

- Cron expression: `*/10 * * * *`
- Target route: `/api/v1/health`

Environment variables:

- `SELF_HEALTH_CRON_ENABLED=false` default
- `APP_URL=http://localhost:3000` required only when self-ping is enabled

For Render keep-awake strategy, configure an external cron job to call:

- `https://<your-service-domain>/api/v1/health`

every 10 minutes.

## Swagger Client Auto-Generation

This project includes reusable scripts to generate a TypeScript Axios client from Swagger.

Location:

- `swagger-gen/openapitools.json`
- `swagger-gen/generate-client.sh`
- `swagger-gen/generate-finance-client.sh`
- `swagger-gen/generate-client.ps1`
- `swagger-gen/generate-finance-client.ps1`

Generator version is pinned to OpenAPI Generator `7.16.0` in `swagger-gen/openapitools.json`.

### Generate client (Bash)

```bash
npm run swagger:client:generate
```

Default source:

- `http://localhost:3000/docs-json`

Default output folder:

- `client`

### Generate client (PowerShell / Windows)

```powershell
npm run swagger:client:generate:ps
```

### Generic usage

```bash
cd swagger-gen
./generate-client.sh http://localhost:3000/docs-json my-service-client
```

The generator flow will:

1. Remove old output folder
2. Generate `typescript-axios` client
3. Run `npm install` in generated client
4. Run `npm run build` in generated client

## Endpoint Overview

Swagger UI access note for protected endpoints:

- Provide Bearer token using the `bearer` auth field.

### Auth

- POST `/api/v1/auth/register`
- POST `/api/v1/auth/login`
- POST `/api/v1/auth/refresh`
- POST `/api/v1/auth/logout`

### Users

- GET `/api/v1/users` ADMIN
- GET `/api/v1/users/:id` ADMIN
- PATCH `/api/v1/users/:id` ADMIN
- PATCH `/api/v1/users/:id/role` ADMIN
- PATCH `/api/v1/users/:id/status` ADMIN
- DELETE `/api/v1/users/:id` ADMIN

### Transactions

- POST `/api/v1/transactions` ANALYST or ADMIN
- GET `/api/v1/transactions` all authenticated users
- GET `/api/v1/transactions/:id` all authenticated users
- PATCH `/api/v1/transactions/:id` ANALYST or ADMIN
- DELETE `/api/v1/transactions/:id` ADMIN soft delete

Record filtering is supported on `GET /api/v1/transactions` using query params:

- `date` exact day filter (YYYY-MM-DD)
- `from` and `to` date range (YYYY-MM-DD)
- `category` category contains match (case-insensitive)
- `type` transaction type (`INCOME` or `EXPENSE`)

### Dashboard

- GET `/api/v1/dashboard/summary` all authenticated users
- GET `/api/v1/dashboard/categories` all authenticated users
- GET `/api/v1/dashboard/trends` ANALYST or ADMIN
- GET `/api/v1/dashboard/recent` all authenticated users

## Test Execution

E2E tests require a reachable PostgreSQL instance from `DATABASE_URL`.

```bash
npm run test:e2e
```

## Seed Accounts

Created by `npm run db:seed`:

- admin@example.com role ADMIN
- analyst@example.com role ANALYST
- viewer@example.com role VIEWER

Password for all seeded users:

- SecurePass123!

## Notes

- This implementation prioritizes assessment requirements: correctness, maintainability, RBAC clarity, validation, and backend data processing logic.
