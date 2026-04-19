import { InputType, Field, Int, Float } from '@nestjs/graphql';
import {
  IsString,
  IsNotEmpty,
  IsNumber,
  IsInt,
  IsOptional,
  Min,
  Max,
} from 'class-validator';

@InputType()
export class CreateCardAccountInput {
  @Field()
  @IsString()
  @IsNotEmpty()
  name: string;

  @Field(() => Float)
  @IsNumber()
  cardLimit: number;

  @Field(() => Int)
  @IsInt()
  @Min(1)
  @Max(12)
  monthExpiry: number;

  @Field(() => Int)
  @IsInt()
  @Min(2024)
  yearExpiry: number;

  @Field(() => Int, { nullable: true })
  @IsInt()
  @IsOptional()
  bankAccountId?: number;

  @Field(() => Int, { nullable: true })
  @IsInt()
  @IsOptional()
  cardTypeId?: number;
}

@InputType()
export class UpdateCardAccountInput {
  @Field({ nullable: true })
  @IsString()
  @IsOptional()
  name?: string;

  @Field(() => Float, { nullable: true })
  @IsNumber()
  @IsOptional()
  cardLimit?: number;

  @Field(() => Int, { nullable: true })
  @IsInt()
  @Min(1)
  @Max(12)
  @IsOptional()
  monthExpiry?: number;

  @Field(() => Int, { nullable: true })
  @IsInt()
  @Min(2024)
  @IsOptional()
  yearExpiry?: number;

  @Field(() => Int, { nullable: true })
  @IsInt()
  @IsOptional()
  bankAccountId?: number;

  @Field(() => Int, { nullable: true })
  @IsInt()
  @IsOptional()
  cardTypeId?: number;
}
