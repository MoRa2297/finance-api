import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsString,
  IsNotEmpty,
  IsNumber,
  IsInt,
  IsOptional,
  IsBoolean,
  IsDateString,
  IsEnum,
} from 'class-validator';
import { Frequency, TransactionType } from '@prisma/client';

export class CreateTransactionDto {
  @ApiProperty({ example: 50.0 })
  @IsNumber()
  money: number;

  @ApiProperty({ example: '2026-02-19' })
  @IsDateString()
  date: string;

  @ApiProperty({ example: 'Spesa al supermercato' })
  @IsString()
  @IsNotEmpty()
  description: string;

  @ApiProperty({ example: '' })
  @IsString()
  note: string;

  @ApiProperty({ enum: TransactionType, example: TransactionType.EXPENSE })
  @IsEnum(TransactionType)
  type: TransactionType;

  // Ricorrenza
  @ApiProperty({ example: false })
  @IsBoolean()
  recurrent: boolean;

  @ApiPropertyOptional({ enum: Frequency })
  @IsEnum(Frequency)
  @IsOptional()
  frequency?: Frequency;

  @ApiPropertyOptional({ example: '2027-01-01' })
  @IsDateString()
  @IsOptional()
  recurrenceEndDate?: string;

  // Relazioni
  @ApiPropertyOptional({ example: 1 })
  @IsInt()
  @IsOptional()
  categoryId?: number;

  @ApiPropertyOptional({ example: 1 })
  @IsInt()
  @IsOptional()
  bankAccountId?: number;

  @ApiPropertyOptional({ example: 1 })
  @IsInt()
  @IsOptional()
  cardAccountId?: number;
}
