import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
    IsString, IsNotEmpty, IsNumber, IsInt,
    IsOptional, IsBoolean, IsDateString, IsIn,
} from 'class-validator';

export class CreateTransactionDto {
    @ApiProperty({ example: 50.00 })
    @IsNumber()
    money: number;

    @ApiProperty({ example: false })
    @IsBoolean()
    recived: boolean;

    @ApiProperty({ example: '2026-02-19' })
    @IsDateString()
    date: string;

    @ApiProperty({ example: 'Spesa al supermercato' })
    @IsString()
    @IsNotEmpty()
    description: string;

    @ApiProperty({ example: false })
    @IsBoolean()
    recurrent: boolean;

    @ApiProperty({ example: false })
    @IsBoolean()
    repeat: boolean;

    @ApiProperty({ example: '' })
    @IsString()
    note: string;

    @ApiProperty({ example: 'expense', enum: ['income', 'expense', 'card_expense'] })
    @IsString()
    @IsIn(['income', 'expense', 'card_expense'])
    type: string;

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
}
