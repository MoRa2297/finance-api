import { IsEmail, IsString, MinLength, IsOptional, IsBoolean } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class RegisterDto {
    @ApiProperty({ example: 'mario.rossi@email.com' })
    @IsEmail()
    email: string;

    @ApiProperty({ example: 'password123', minLength: 6 })
    @IsString()
    @MinLength(6)
    password: string;

    @ApiPropertyOptional({ example: 'Mario' })
    @IsString()
    @IsOptional()
    name?: string;

    @ApiPropertyOptional({ example: 'Rossi' })
    @IsString()
    @IsOptional()
    surname?: string;

    @ApiPropertyOptional({ example: 'M' })
    @IsString()
    @IsOptional()
    sex?: string;

    @ApiProperty({ example: true })
    @IsBoolean()
    acceptedTerms: boolean;
}
