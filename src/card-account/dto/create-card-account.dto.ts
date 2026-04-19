import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsString,
  IsNotEmpty,
  IsNumber,
  IsInt,
  IsOptional,
  Min,
  Max,
} from 'class-validator';

export class CreateCardAccountDto {
  @ApiProperty({ example: 'Visa N26' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ example: 5000.0 })
  @IsNumber()
  cardLimit: number;

  @ApiProperty({ example: 12 })
  @IsInt()
  @Min(1)
  @Max(12)
  monthExpiry: number;

  @ApiProperty({ example: 2028 })
  @IsInt()
  @Min(2024)
  yearExpiry: number;

  @ApiPropertyOptional({ example: 1 })
  @IsInt()
  @IsOptional()
  bankAccountId?: number;

  @ApiPropertyOptional({ example: 1 })
  @IsInt()
  @IsOptional()
  cardTypeId?: number;
}
