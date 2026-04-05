import { PrismaClient, Role, TransactionType } from '@prisma/client/index';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

const BCRYPT_SALT_ROUNDS = 10;

async function main(): Promise<void> {
  const passwordHash = await bcrypt.hash('SecurePass123!', BCRYPT_SALT_ROUNDS);

  const admin = await prisma.user.upsert({
    where: { email: 'admin@example.com' },
    update: { name: 'System Admin', role: Role.ADMIN },
    create: {
      email: 'admin@example.com',
      name: 'System Admin',
      role: Role.ADMIN,
      passwordHash,
    },
  });

  const analyst = await prisma.user.upsert({
    where: { email: 'analyst@example.com' },
    update: { name: 'Data Analyst', role: Role.ANALYST },
    create: {
      email: 'analyst@example.com',
      name: 'Data Analyst',
      role: Role.ANALYST,
      passwordHash,
    },
  });

  const viewer = await prisma.user.upsert({
    where: { email: 'viewer@example.com' },
    update: { name: 'Finance Viewer', role: Role.VIEWER },
    create: {
      email: 'viewer@example.com',
      name: 'Finance Viewer',
      role: Role.VIEWER,
      passwordHash,
    },
  });

  await prisma.transaction.deleteMany({
    where: {
      userId: {
        in: [admin.id, analyst.id, viewer.id],
      },
    },
  });

  await prisma.transaction.createMany({
    data: [
      {
        amount: 120000,
        type: TransactionType.INCOME,
        category: 'salary',
        date: new Date('2026-01-31'),
        notes: 'Monthly salary',
        userId: analyst.id,
      },
      {
        amount: 8500,
        type: TransactionType.EXPENSE,
        category: 'rent',
        date: new Date('2026-01-02'),
        notes: 'Apartment rent',
        userId: analyst.id,
      },
      {
        amount: 2400,
        type: TransactionType.EXPENSE,
        category: 'utilities',
        date: new Date('2026-01-04'),
        notes: 'Electricity and internet',
        userId: viewer.id,
      },
      {
        amount: 15000,
        type: TransactionType.INCOME,
        category: 'freelance',
        date: new Date('2026-02-10'),
        notes: 'Consulting payout',
        userId: analyst.id,
      },
      {
        amount: 5100,
        type: TransactionType.EXPENSE,
        category: 'groceries',
        date: new Date('2026-02-11'),
        notes: 'Monthly groceries',
        userId: viewer.id,
      },
      {
        amount: 9900,
        type: TransactionType.EXPENSE,
        category: 'equipment',
        date: new Date('2026-02-18'),
        notes: 'Hardware upgrade',
        userId: admin.id,
      },
    ],
  });

  // eslint-disable-next-line no-console
  console.log('Seed complete. Test users use password: SecurePass123!');
}

main()
  .catch(async (error: unknown) => {
    // eslint-disable-next-line no-console
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

