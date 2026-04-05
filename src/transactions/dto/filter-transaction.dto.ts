import { TransactionType } from '@prisma/client/index';
import { Transform } from 'class-transformer';
import { ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsDateString,
  IsEnum,
  IsIn,
  IsNumberString,
  IsOptional,
  IsString,
} from 'class-validator';

export class FilterTransactionDto {
  @ApiPropertyOptional({ example: '2026-03-12' })
  @IsOptional()
  @IsDateString()
  date?: string;

  @ApiPropertyOptional({ enum: TransactionType })
  @IsOptional()
  @IsEnum(TransactionType)
  type?: TransactionType;

  @ApiPropertyOptional({ example: 'salary' })
  @IsOptional()
  @IsString()
  @Transform(({ value }: { value: string }) => value?.trim().toLowerCase())
  category?: string;

  @ApiPropertyOptional({ example: '2026-01-01' })
  @IsOptional()
  @IsDateString()
  from?: string;

  @ApiPropertyOptional({ example: '2026-12-31' })
  @IsOptional()
  @IsDateString()
  to?: string;

  @ApiPropertyOptional({ example: '1' })
  @IsOptional()
  @IsNumberString()
  page?: string;

  @ApiPropertyOptional({ example: '20' })
  @IsOptional()
  @IsNumberString()
  limit?: string;

  @ApiPropertyOptional({ enum: ['date', 'amount', 'createdAt'], example: 'date' })
  @IsOptional()
  @IsIn(['date', 'amount', 'createdAt'])
  sortBy?: 'date' | 'amount' | 'createdAt';

  @ApiPropertyOptional({ enum: ['asc', 'desc'], example: 'desc' })
  @IsOptional()
  @IsIn(['asc', 'desc'])
  order?: 'asc' | 'desc';
}

