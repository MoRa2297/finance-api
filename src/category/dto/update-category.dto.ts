import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsInt, IsOptional, IsIn } from 'class-validator';

export class UpdateCategoryDto {
    @ApiPropertyOptional({ example: 'Spesa' })
    @IsString()
    @IsOptional()
    name?: string;

    @ApiPropertyOptional({ example: 'expense', enum: ['expense', 'income'] })
    @IsString()
    @IsIn(['expense', 'income'])
    @IsOptional()
    type?: string;

    @ApiPropertyOptional({ example: 1 })
    @IsInt()
    @IsOptional()
    colorId?: number;

    @ApiPropertyOptional({ example: 1 })
    @IsInt()
    @IsOptional()
    iconId?: number;
}
