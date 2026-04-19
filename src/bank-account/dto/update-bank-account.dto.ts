import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsNumber, IsInt, IsOptional } from 'class-validator';

export class UpdateBankAccountDto {
  @ApiPropertyOptional({ example: 'Conto Principale' })
  @IsString()
  @IsOptional()
  name?: string;

  @ApiPropertyOptional({ example: 1000.0 })
  @IsNumber()
  @IsOptional()
  startingBalance?: number;

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
