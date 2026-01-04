import { IsString, IsOptional, IsDate } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';

export class UpdateProfileDto {
    @ApiPropertyOptional({ example: 'Mario' })
    @IsString()
    @IsOptional()
    name?: string;

    @ApiPropertyOptional({ example: 'Rossi' })
    @IsString()
    @IsOptional()
    surname?: string;

    @ApiPropertyOptional({ example: '1990-01-15' })
    @IsDate()
    @IsOptional()
    @Type(() => Date)
    birthDate?: Date;

    @ApiPropertyOptional({ example: 'M' })
    @IsString()
    @IsOptional()
    sex?: string;

    @ApiPropertyOptional({ example: 'https://example.com/avatar.jpg' })
    @IsString()
    @IsOptional()
    imageUrl?: string;
}
