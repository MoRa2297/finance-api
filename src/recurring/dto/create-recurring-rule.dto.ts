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
import { Frequency, RecurringType } from '@prisma/client';

export class CreateRecurringRuleDto {
  @ApiProperty({ example: 'Netflix' })
  @IsString()
  @IsNotEmpty()
  description: string;

  @ApiProperty({ example: 15.99 })
  @IsNumber()
  amount: number;

  @ApiProperty({ enum: RecurringType, example: RecurringType.EXPENSE })
  @IsEnum(RecurringType)
  type: RecurringType;

  @ApiProperty({ enum: Frequency, example: Frequency.MONTHLY })
  @IsEnum(Frequency)
  frequency: Frequency;

  @ApiProperty({ example: '2026-01-01' })
  @IsDateString()
  startDate: string;

  @ApiPropertyOptional({ example: '2027-01-01' })
  @IsDateString()
  @IsOptional()
  endDate?: string;

  @ApiPropertyOptional({ example: 5 })
  @IsInt()
  @IsOptional()
  dayOfMonth?: number;

  @ApiPropertyOptional({ example: 'monday' })
  @IsString()
  @IsOptional()
  dayOfWeek?: string;

  @ApiPropertyOptional({ example: '' })
  @IsString()
  @IsOptional()
  note?: string;

  @ApiPropertyOptional({ example: true })
  @IsBoolean()
  @IsOptional()
  isActive?: boolean;

  @ApiProperty({ example: 1 })
  @IsInt()
  categoryId: number;

  @ApiPropertyOptional({ example: 1 })
  @IsInt()
  @IsOptional()
  bankAccountId?: number;

  @ApiPropertyOptional({ example: 1 })
  @IsInt()
  @IsOptional()
  cardAccountId?: number;

  @ApiPropertyOptional({
    example: 1,
    description: 'Required for TRANSFER type',
  })
  @IsInt()
  @IsOptional()
  fromAccountId?: number;

  @ApiPropertyOptional({
    example: 2,
    description: 'Required for TRANSFER type',
  })
  @IsInt()
  @IsOptional()
  toAccountId?: number;
}
