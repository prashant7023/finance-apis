import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client/index';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class DashboardService {
  constructor(private readonly prisma: PrismaService) {}

  async getSummary(): Promise<{
    totalIncome: number;
    totalExpense: number;
    netBalance: number;
    transactionCount: number;
  }> {
    const [income, expense, transactionCount] = await Promise.all([
      this.prisma.transaction.aggregate({
        where: { type: 'INCOME', isDeleted: false },
        _sum: { amount: true },
      }),
      this.prisma.transaction.aggregate({
        where: { type: 'EXPENSE', isDeleted: false },
        _sum: { amount: true },
      }),
      this.prisma.transaction.count({ where: { isDeleted: false } }),
    ]);

    const totalIncome = Number(income._sum.amount ?? 0);
    const totalExpense = Number(expense._sum.amount ?? 0);

    return {
      totalIncome,
      totalExpense,
      netBalance: totalIncome - totalExpense,
      transactionCount,
    };
  }

  async getCategoryBreakdown(): Promise<
    Array<{ category: string; type: string; total: number; count: number }>
  > {
    const rows = await this.prisma.transaction.groupBy({
      by: ['category', 'type'],
      where: { isDeleted: false },
      _sum: { amount: true },
      _count: { id: true },
      orderBy: { _sum: { amount: 'desc' } },
    });

    return rows.map((row) => ({
      category: row.category,
      type: row.type,
      total: Number(row._sum.amount ?? 0),
      count: row._count.id,
    }));
  }

  async getMonthlyTrends(year: number): Promise<Array<{ month: number; income: number; expense: number }>> {
    const rows = await this.prisma.$queryRaw<Array<{ month: number; type: string; total: number }>>(
      Prisma.sql`
        SELECT
          EXTRACT(MONTH FROM date)::int AS month,
          type,
          SUM(amount)::float AS total
        FROM data_tx.transactions
        WHERE EXTRACT(YEAR FROM date) = ${year}
          AND "isDeleted" = false
        GROUP BY month, type
        ORDER BY month ASC
      `,
    );

    const months = Array.from({ length: 12 }, (_, index) => ({
      month: index + 1,
      income: 0,
      expense: 0,
    }));

    for (const row of rows) {
      const rowIndex = row.month - 1;
      if (rowIndex < 0 || rowIndex > 11) {
        continue;
      }

      if (row.type === 'INCOME') {
        months[rowIndex].income = row.total;
      }

      if (row.type === 'EXPENSE') {
        months[rowIndex].expense = row.total;
      }
    }

    return months;
  }

  async getRecentActivity(limit = 10) {
    const safeLimit = Math.max(1, Math.min(50, limit));

    const rows = await this.prisma.transaction.findMany({
      where: { isDeleted: false },
      orderBy: { createdAt: 'desc' },
      take: safeLimit,
      include: {
        user: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });

    return rows.map((row) => ({
      ...row,
      amount: Number(row.amount),
    }));
  }
}

