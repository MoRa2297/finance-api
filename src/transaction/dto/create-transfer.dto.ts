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
import { Frequency } from '@prisma/client';

export class CreateTransferDto {
  @ApiProperty({ example: 500.0 })
  @IsNumber()
  amount: number;

  @ApiProperty({ example: '2026-02-19' })
  @IsDateString()
  date: string;

  @ApiProperty({ example: 'Trasferimento risparmio' })
  @IsString()
  @IsNotEmpty()
  description: string;

  @ApiPropertyOptional({ example: '' })
  @IsString()
  @IsOptional()
  note?: string;

  @ApiProperty({ example: 1 })
  @IsInt()
  fromAccountId: number;

  @ApiProperty({ example: 2 })
  @IsInt()
  toAccountId: number;

  @ApiPropertyOptional({ example: false })
  @IsBoolean()
  @IsOptional()
  recurrent?: boolean;

  @ApiPropertyOptional({ enum: Frequency })
  @IsEnum(Frequency)
  @IsOptional()
  frequency?: Frequency;

  @ApiPropertyOptional({ example: '2027-01-01' })
  @IsDateString()
  @IsOptional()
  recurrenceEndDate?: string;
}
