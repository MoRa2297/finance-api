import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsInt, IsOptional, IsIn } from 'class-validator';

export class CreateCategoryDto {
    @ApiProperty({ example: 'Spesa' })
    @IsString()
    @IsNotEmpty()
    name: string;

    @ApiProperty({ example: 'expense', enum: ['expense', 'income'] })
    @IsString()
    @IsIn(['expense', 'income'])
    type: string;

    @ApiProperty({ example: 1 })
    @IsInt()
    colorId: number;

    @ApiPropertyOptional({ example: 1 })
    @IsInt()
    @IsOptional()
    iconId?: number;
}
