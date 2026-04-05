import { IsEnum } from 'class-validator';
import { Role } from '@prisma/client/index';
import { ApiProperty } from '@nestjs/swagger';

export class AssignRoleDto {
  @ApiProperty({ enum: Role, example: Role.ANALYST })
  @IsEnum(Role)
  role!: Role;
}

