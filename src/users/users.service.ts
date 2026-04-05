import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Prisma, Role, User, UserStatus } from '@prisma/client/index';
import { AuthService } from '../auth/auth.service';
import { PrismaService } from '../prisma/prisma.service';
import { AssignRoleDto } from './dto/assign-role.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UsersService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly authService: AuthService,
  ) {}

  async findAll(params: {
    page: number;
    limit: number;
    role?: Role;
    status?: UserStatus;
  }): Promise<{
    data: Array<Omit<User, 'passwordHash' | 'refreshTokenHash'>>;
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  }> {
    const { page, limit, role, status } = params;

    const where: Prisma.UserWhereInput = {
      ...(role && { role }),
      ...(status && { status }),
    };

    const [users, total] = await this.prisma.$transaction([
      this.prisma.user.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        skip: (page - 1) * limit,
        take: limit,
      }),
      this.prisma.user.count({ where }),
    ]);

    return {
      data: users.map((user) => this.authService.sanitizeUser(user)),
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  async findOne(id: string): Promise<Omit<User, 'passwordHash' | 'refreshTokenHash'>> {
    const user = await this.prisma.user.findUnique({ where: { id } });
    if (!user) {
      throw new NotFoundException(`User ${id} not found`);
    }

    return this.authService.sanitizeUser(user);
  }

  async update(id: string, dto: UpdateUserDto): Promise<Omit<User, 'passwordHash' | 'refreshTokenHash'>> {
    await this.findOne(id);

    if (dto.email) {
      const conflict = await this.prisma.user.findFirst({
        where: {
          email: dto.email,
          NOT: { id },
        },
      });

      if (conflict) {
        throw new ConflictException('Email already in use');
      }
    }

    const updated = await this.prisma.user.update({
      where: { id },
      data: dto,
    });

    return this.authService.sanitizeUser(updated);
  }

  async assignRole(
    id: string,
    dto: AssignRoleDto,
  ): Promise<Omit<User, 'passwordHash' | 'refreshTokenHash'>> {
    await this.findOne(id);

    const updated = await this.prisma.user.update({
      where: { id },
      data: { role: dto.role },
    });

    return this.authService.sanitizeUser(updated);
  }

  async toggleStatus(id: string): Promise<Omit<User, 'passwordHash' | 'refreshTokenHash'>> {
    const user = await this.prisma.user.findUnique({ where: { id } });

    if (!user) {
      throw new NotFoundException(`User ${id} not found`);
    }

    const newStatus: UserStatus = user.status === UserStatus.ACTIVE ? UserStatus.INACTIVE : UserStatus.ACTIVE;

    const updated = await this.prisma.user.update({
      where: { id },
      data: {
        status: newStatus,
        ...(newStatus === UserStatus.INACTIVE && { refreshTokenHash: null }),
      },
    });

    return this.authService.sanitizeUser(updated);
  }

  async remove(id: string, requestingUserId: string): Promise<void> {
    await this.findOne(id);

    if (id === requestingUserId) {
      throw new BadRequestException('You cannot delete your own account');
    }

    await this.prisma.user.delete({ where: { id } });
  }
}

