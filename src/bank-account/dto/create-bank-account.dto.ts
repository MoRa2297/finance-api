import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsString,
  IsNotEmpty,
  IsNumber,
  IsInt,
  IsOptional,
} from 'class-validator';

export class CreateBankAccountDto {
  @ApiProperty({ example: 'Conto Principale' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ example: 1000.0 })
  @IsNumber()
  startingBalance: number;

  @ApiPropertyOptional({ example: 1 })
  @IsInt()
  @IsOptional()
  colorId?: number;

  @ApiPropertyOptional({ example: 1 })
  @IsInt()
  @IsOptional()
  bankTypeId?: number;

  @ApiPropertyOptional({ example: 1 })
  @IsInt()
  @IsOptional()
  bankAccountTypeId?: number;
}
