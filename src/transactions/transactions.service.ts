import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Prisma, Role, Transaction, TransactionType } from '@prisma/client/index';
import { RequestUser } from '../common/types/jwt-payload.type';
import { PrismaService } from '../prisma/prisma.service';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { FilterTransactionDto } from './dto/filter-transaction.dto';
import { UpdateTransactionDto } from './dto/update-transaction.dto';

const ALLOWED_SORT_FIELDS = new Set(['date', 'amount', 'createdAt']);

type TransactionWithUser = Prisma.TransactionGetPayload<{
  include: {
    user: {
      select: {
        id: true;
        name: true;
        email: true;
      };
    };
  };
}>;

@Injectable()
export class TransactionsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(dto: CreateTransactionDto, user: RequestUser) {
    const transaction = await this.prisma.transaction.create({
      data: {
        amount: dto.amount,
        type: dto.type,
        category: dto.category,
        date: new Date(dto.date),
        notes: dto.notes,
        userId: user.id,
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });

    return this.serializeTransaction(transaction);
  }

  async findAll(filter: FilterTransactionDto, user: RequestUser) {
    const {
      type,
      category,
      from,
      to,
      page = '1',
      limit = '20',
      sortBy = 'date',
      order = 'desc',
    } = filter;

    const safeSortBy = ALLOWED_SORT_FIELDS.has(sortBy) ? sortBy : 'date';
    const safeOrder: 'asc' | 'desc' = order === 'asc' ? 'asc' : 'desc';

    const parsedPage = Number.parseInt(page, 10);
    const parsedLimit = Number.parseInt(limit, 10);
    const pageNum = Number.isNaN(parsedPage) ? 1 : Math.max(1, parsedPage);
    const limitNum = Number.isNaN(parsedLimit) ? 20 : Math.max(1, Math.min(100, parsedLimit));

    const where: Prisma.TransactionWhereInput = {
      isDeleted: false,
      ...(user.role === Role.VIEWER && { userId: user.id }),
      ...(type && { type }),
      ...(category && { category: { contains: category, mode: 'insensitive' } }),
      ...((from || to) && {
        date: {
          ...(from && { gte: new Date(from) }),
          ...(to && { lte: new Date(to) }),
        },
      }),
    };

    const [data, total] = await this.prisma.$transaction([
      this.prisma.transaction.findMany({
        where,
        orderBy: { [safeSortBy]: safeOrder },
        skip: (pageNum - 1) * limitNum,
        take: limitNum,
        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
        },
      }),
      this.prisma.transaction.count({ where }),
    ]);

    return {
      data: data.map((item) => this.serializeTransaction(item)),
      total,
      page: pageNum,
      limit: limitNum,
      totalPages: Math.ceil(total / limitNum),
    };
  }

  async findOne(id: string, user: RequestUser) {
    const tx = await this.prisma.transaction.findFirst({
      where: { id, isDeleted: false },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });

    if (!tx) {
      throw new NotFoundException(`Transaction ${id} not found`);
    }

    if (user.role === Role.VIEWER && tx.userId !== user.id) {
      throw new ForbiddenException('Access denied');
    }

    return this.serializeTransaction(tx);
  }

  async update(id: string, dto: UpdateTransactionDto, user: RequestUser) {
    const tx = await this.prisma.transaction.findFirst({
      where: { id, isDeleted: false },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });

    if (!tx) {
      throw new NotFoundException(`Transaction ${id} not found`);
    }

    if (user.role === Role.ANALYST && tx.userId !== user.id) {
      throw new ForbiddenException('Analysts can only modify their own transactions');
    }

    if (user.role === Role.VIEWER) {
      throw new ForbiddenException('Viewers cannot modify transactions');
    }

    const updated = await this.prisma.transaction.update({
      where: { id },
      data: {
        ...(dto.amount !== undefined && { amount: dto.amount }),
        ...(dto.type !== undefined && { type: dto.type }),
        ...(dto.category !== undefined && { category: dto.category }),
        ...(dto.date !== undefined && { date: new Date(dto.date) }),
        ...(dto.notes !== undefined && { notes: dto.notes }),
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });

    return this.serializeTransaction(updated);
  }

  async softDelete(id: string): Promise<void> {
    const tx = await this.prisma.transaction.findFirst({ where: { id, isDeleted: false } });
    if (!tx) {
      throw new NotFoundException(`Transaction ${id} not found`);
    }

    if (tx.isDeleted) {
      throw new BadRequestException('Transaction is already deleted');
    }

    await this.prisma.transaction.update({
      where: { id },
      data: { isDeleted: true },
    });
  }

  private serializeTransaction(transaction: TransactionWithUser) {
    return {
      ...transaction,
      amount: Number(transaction.amount),
    };
  }
}

