import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsInt, IsOptional, IsEnum } from 'class-validator';
import { CategoryType } from '@prisma/client';

export class UpdateCategoryDto {
  @ApiPropertyOptional({ example: 'Spesa' })
  @IsString()
  @IsOptional()
  name?: string;

  @ApiPropertyOptional({ enum: CategoryType })
  @IsEnum(CategoryType)
  @IsOptional()
  type?: CategoryType;

  @ApiPropertyOptional({ example: 1 })
  @IsInt()
  @IsOptional()
  colorId?: number;

  @ApiPropertyOptional({ example: 1 })
  @IsInt()
  @IsOptional()
  iconId?: number;
}
