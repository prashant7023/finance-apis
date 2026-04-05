-- CreateSchema
CREATE SCHEMA IF NOT EXISTS "data_tx";

-- CreateSchema
CREATE SCHEMA IF NOT EXISTS "master_data";

-- CreateSchema
CREATE SCHEMA IF NOT EXISTS "public";

-- CreateEnum
CREATE TYPE "master_data"."Role" AS ENUM ('VIEWER', 'ANALYST', 'ADMIN');

-- CreateEnum
CREATE TYPE "master_data"."UserStatus" AS ENUM ('ACTIVE', 'INACTIVE');

-- CreateEnum
CREATE TYPE "data_tx"."TransactionType" AS ENUM ('INCOME', 'EXPENSE');

-- CreateTable
CREATE TABLE "master_data"."users" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "passwordHash" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "role" "master_data"."Role" NOT NULL DEFAULT 'VIEWER',
    "status" "master_data"."UserStatus" NOT NULL DEFAULT 'ACTIVE',
    "refreshTokenHash" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "data_tx"."transactions" (
    "id" TEXT NOT NULL,
    "amount" DECIMAL(15,2) NOT NULL,
    "type" "data_tx"."TransactionType" NOT NULL,
    "category" TEXT NOT NULL,
    "date" DATE NOT NULL,
    "notes" TEXT,
    "isDeleted" BOOLEAN NOT NULL DEFAULT false,
    "userId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "transactions_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "master_data"."users"("email");

-- CreateIndex
CREATE INDEX "transactions_userId_idx" ON "data_tx"."transactions"("userId");

-- CreateIndex
CREATE INDEX "transactions_type_idx" ON "data_tx"."transactions"("type");

-- CreateIndex
CREATE INDEX "transactions_category_idx" ON "data_tx"."transactions"("category");

-- CreateIndex
CREATE INDEX "transactions_date_idx" ON "data_tx"."transactions"("date");

-- AddForeignKey
ALTER TABLE "data_tx"."transactions" ADD CONSTRAINT "transactions_userId_fkey" FOREIGN KEY ("userId") REFERENCES "master_data"."users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

