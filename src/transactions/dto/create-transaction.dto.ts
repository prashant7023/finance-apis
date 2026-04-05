import { ApiProperty } from '@nestjs/swagger';
import { TransactionType } from '@prisma/client/index';
import { Transform, Type } from 'class-transformer';
import {
  IsDateString,
  IsEnum,
  IsNumber,
  IsOptional,
  IsString,
  Max,
  MaxLength,
  Min,
} from 'class-validator';

export class CreateTransactionDto {
  @ApiProperty({ example: 50000.0, description: 'Amount in base currency unit' })
  @Type(() => Number)
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0.01)
  @Max(999_999_999.99)
  amount!: number;

  @ApiProperty({ enum: TransactionType })
  @IsEnum(TransactionType)
  type!: TransactionType;

  @ApiProperty({ example: 'salary' })
  @IsString()
  @MaxLength(100)
  @Transform(({ value }: { value: string }) => value.trim().toLowerCase())
  category!: string;

  @ApiProperty({ example: '2026-04-01' })
  @IsDateString()
  date!: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  @MaxLength(500)
  @Transform(({ value }: { value: string }) => value?.trim())
  notes?: string;
}

