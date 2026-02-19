import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsNumber, IsInt, IsOptional, Min, Max } from 'class-validator';

export class UpdateCardAccountDto {
    @ApiPropertyOptional({ example: 'Visa N26' })
    @IsString()
    @IsOptional()
    name?: string;

    @ApiPropertyOptional({ example: 5000.00 })
    @IsNumber()
    @IsOptional()
    cardLimit?: number;

    @ApiPropertyOptional({ example: 12 })
    @IsInt()
    @Min(1)
    @Max(12)
    @IsOptional()
    monthExpiry?: number;

    @ApiPropertyOptional({ example: 2028 })
    @IsInt()
    @Min(2024)
    @IsOptional()
    yearExpiry?: number;

    @ApiPropertyOptional({ example: 1 })
    @IsInt()
    @IsOptional()
    bankAccountId?: number;

    @ApiPropertyOptional({ example: 1 })
    @IsInt()
    @IsOptional()
    cardTypeId?: number;
}
