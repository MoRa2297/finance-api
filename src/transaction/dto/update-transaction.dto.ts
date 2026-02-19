import { ApiPropertyOptional } from '@nestjs/swagger';
import {
    IsString, IsNumber, IsInt, IsOptional,
    IsBoolean, IsDateString, IsIn,
} from 'class-validator';

export class UpdateTransactionDto {
    @ApiPropertyOptional({ example: 50.00 })
    @IsNumber()
    @IsOptional()
    money?: number;

    @ApiPropertyOptional({ example: false })
    @IsBoolean()
    @IsOptional()
    recived?: boolean;

    @ApiPropertyOptional({ example: '2026-02-19' })
    @IsDateString()
    @IsOptional()
    date?: string;

    @ApiPropertyOptional({ example: 'Spesa al supermercato' })
    @IsString()
    @IsOptional()
    description?: string;

    @ApiPropertyOptional({ example: false })
    @IsBoolean()
    @IsOptional()
    recurrent?: boolean;

    @ApiPropertyOptional({ example: false })
    @IsBoolean()
    @IsOptional()
    repeat?: boolean;

    @ApiPropertyOptional({ example: '' })
    @IsString()
    @IsOptional()
    note?: string;

    @ApiPropertyOptional({ example: 'expense', enum: ['income', 'expense', 'card_expense'] })
    @IsString()
    @IsIn(['income', 'expense', 'card_expense'])
    @IsOptional()
    type?: string;

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
