import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsInt, IsOptional, IsString, IsIn, Min, Max } from 'class-validator';
import { Type } from 'class-transformer';

export class FilterTransactionDto {
    @ApiPropertyOptional({ example: 2 })
    @IsInt()
    @Min(1)
    @Max(12)
    @IsOptional()
    @Type(() => Number)
    month?: number;

    @ApiPropertyOptional({ example: 2026 })
    @IsInt()
    @IsOptional()
    @Type(() => Number)
    year?: number;

    @ApiPropertyOptional({ example: 1 })
    @IsInt()
    @IsOptional()
    @Type(() => Number)
    categoryId?: number;

    @ApiPropertyOptional({ example: 'expense', enum: ['income', 'expense', 'card_expense'] })
    @IsString()
    @IsIn(['income', 'expense', 'card_expense'])
    @IsOptional()
    type?: string;

    @ApiPropertyOptional({ example: 1 })
    @IsInt()
    @IsOptional()
    @Type(() => Number)
    bankAccountId?: number;

    @ApiPropertyOptional({ example: 1 })
    @IsInt()
    @IsOptional()
    @Type(() => Number)
    cardAccountId?: number;

    @ApiPropertyOptional({ example: 1, default: 1 })
    @IsInt()
    @Min(1)
    @IsOptional()
    @Type(() => Number)
    page?: number = 1;

    @ApiPropertyOptional({ example: 20, default: 20 })
    @IsInt()
    @Min(1)
    @Max(100)
    @IsOptional()
    @Type(() => Number)
    limit?: number = 20;
}
