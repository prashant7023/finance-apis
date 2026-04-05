import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { Prisma, PrismaClient } from '@prisma/client/index';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
  constructor() {
    super();

    // Retry transient connection closures from pooled Postgres providers.
    this.$use(async (params, next) => {
      for (let attempt = 0; attempt < 3; attempt += 1) {
        try {
          return await next(params);
        } catch (error: unknown) {
          const isClosedConnectionError =
            error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P1017';

          if (!isClosedConnectionError || attempt === 2) {
            throw error;
          }

          await this.$disconnect();
          await this.$connect();
        }
      }

      throw new Error('Prisma retry loop exhausted');
    });
  }

  async onModuleInit(): Promise<void> {
    await this.$connect();
  }

  async onModuleDestroy(): Promise<void> {
    await this.$disconnect();
  }
}

