import { InputType, Field, Int, registerEnumType } from '@nestjs/graphql';
import {
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsEnum,
  IsString,
} from 'class-validator';
import { CategoryType } from '@prisma/client';

registerEnumType(CategoryType, {
  name: 'CategoryTypeEnum',
  description: 'Category type: income or expense',
});

@InputType()
export class CreateCategoryInput {
  @Field()
  @IsString()
  @IsNotEmpty()
  name: string;

  @Field(() => CategoryType)
  @IsEnum(CategoryType)
  type: CategoryType;

  @Field(() => Int)
  @IsInt()
  colorId: number;

  @Field(() => Int, { nullable: true })
  @IsInt()
  @IsOptional()
  iconId?: number;
}

@InputType()
export class UpdateCategoryInput {
  @Field({ nullable: true })
  @IsString()
  @IsOptional()
  name?: string;

  @Field(() => CategoryType, { nullable: true })
  @IsEnum(CategoryType)
  @IsOptional()
  type?: CategoryType;

  @Field(() => Int, { nullable: true })
  @IsInt()
  @IsOptional()
  colorId?: number;

  @Field(() => Int, { nullable: true })
  @IsInt()
  @IsOptional()
  iconId?: number;
}
