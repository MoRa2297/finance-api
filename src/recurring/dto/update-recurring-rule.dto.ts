import { ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsString,
  IsNumber,
  IsInt,
  IsOptional,
  IsBoolean,
  IsDateString,
  IsEnum,
} from 'class-validator';
import { Frequency, RecurringType } from '@prisma/client';

export class UpdateRecurringRuleDto {
  @ApiPropertyOptional({ example: 'Netflix' })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiPropertyOptional({ example: 15.99 })
  @IsNumber()
  @IsOptional()
  amount?: number;

  @ApiPropertyOptional({ enum: RecurringType })
  @IsEnum(RecurringType)
  @IsOptional()
  type?: RecurringType;

  @ApiPropertyOptional({ enum: Frequency })
  @IsEnum(Frequency)
  @IsOptional()
  frequency?: Frequency;

  @ApiPropertyOptional({ example: '2026-01-01' })
  @IsDateString()
  @IsOptional()
  startDate?: string;

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
