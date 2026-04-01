import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsString,
  IsNotEmpty,
  IsNumber,
  IsInt,
  IsOptional,
  IsDateString,
} from 'class-validator';

export class CreateTransferDto {
  @ApiProperty({ example: 500.0 })
  @IsNumber()
  money: number;

  @ApiProperty({ example: '2026-02-19' })
  @IsDateString()
  date: string;

  @ApiProperty({ example: 'Trasferimento conto corrente → risparmio' })
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
}
