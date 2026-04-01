import {
  InputType,
  Field,
  Int,
  Float,
  registerEnumType,
} from '@nestjs/graphql';
import {
  IsString,
  IsNotEmpty,
  IsNumber,
  IsInt,
  IsOptional,
  IsBoolean,
  IsDateString,
  IsEnum,
  Min,
  Max,
} from 'class-validator';
import { Frequency, TransactionType } from '@prisma/client';

registerEnumType(TransactionType, {
  name: 'TransactionTypeEnum',
  description: 'Transaction type: income, expense or transfer',
});

@InputType()
export class CreateTransactionInput {
  @Field(() => Float)
  @IsNumber()
  money: number;

  @Field()
  @IsDateString()
  date: string;

  @Field()
  @IsString()
  @IsNotEmpty()
  description: string;

  @Field()
  @IsString()
  note: string;

  @Field(() => TransactionType)
  @IsEnum(TransactionType)
  type: TransactionType;

  @Field(() => Int, { nullable: true })
  @IsInt()
  @IsOptional()
  categoryId?: number;

  @Field(() => Int, { nullable: true })
  @IsInt()
  @IsOptional()
  bankAccountId?: number;

  @Field(() => Int, { nullable: true })
  @IsInt()
  @IsOptional()
  cardAccountId?: number;
}

@InputType()
export class CreateTransactionInput {
  @Field(() => Float)
  @IsNumber()
  money: number;

  @Field()
  @IsDateString()
  date: string;

  @Field()
  @IsString()
  @IsNotEmpty()
  description: string;

  @Field()
  @IsString()
  note: string;

  @Field(() => TransactionType)
  @IsEnum(TransactionType)
  type: TransactionType;

  @Field()
  @IsBoolean()
  recurrent: boolean;

  @Field({ nullable: true })
  @IsEnum(Frequency)
  @IsOptional()
  frequency?: Frequency;

  @Field({ nullable: true })
  @IsDateString()
  @IsOptional()
  recurrenceEndDate?: string;

  @Field(() => Int, { nullable: true })
  @IsInt()
  @IsOptional()
  categoryId?: number;

  @Field(() => Int, { nullable: true })
  @IsInt()
  @IsOptional()
  bankAccountId?: number;

  @Field(() => Int, { nullable: true })
  @IsInt()
  @IsOptional()
  cardAccountId?: number;
}

@InputType()
export class UpdateTransactionInput {
  @Field(() => Float, { nullable: true })
  @IsNumber()
  @IsOptional()
  money?: number;

  @Field({ nullable: true })
  @IsDateString()
  @IsOptional()
  date?: string;

  @Field({ nullable: true })
  @IsString()
  @IsOptional()
  description?: string;

  @Field({ nullable: true })
  @IsBoolean()
  @IsOptional()
  recurrent?: boolean;

  @Field({ nullable: true })
  @IsString()
  @IsOptional()
  note?: string;

  @Field(() => TransactionType, { nullable: true })
  @IsEnum(TransactionType)
  @IsOptional()
  type?: TransactionType;

  @Field(() => Int, { nullable: true })
  @IsInt()
  @IsOptional()
  categoryId?: number;

  @Field(() => Int, { nullable: true })
  @IsInt()
  @IsOptional()
  bankAccountId?: number;

  @Field(() => Int, { nullable: true })
  @IsInt()
  @IsOptional()
  cardAccountId?: number;
}

@InputType()
export class FilterTransactionInput {
  @Field(() => Int, { nullable: true })
  @IsInt()
  @Min(1)
  @Max(12)
  @IsOptional()
  month?: number;

  @Field(() => Int, { nullable: true })
  @IsInt()
  @IsOptional()
  year?: number;

  @Field(() => Int, { nullable: true })
  @IsInt()
  @IsOptional()
  categoryId?: number;

  @Field(() => TransactionType, { nullable: true })
  @IsEnum(TransactionType)
  @IsOptional()
  type?: TransactionType;

  @Field(() => Int, { nullable: true })
  @IsInt()
  @IsOptional()
  bankAccountId?: number;

  @Field(() => Int, { nullable: true })
  @IsInt()
  @IsOptional()
  cardAccountId?: number;

  @Field(() => Int, { nullable: true, defaultValue: 1 })
  @IsInt()
  @Min(1)
  @IsOptional()
  page?: number = 1;

  @Field(() => Int, { nullable: true, defaultValue: 20 })
  @IsInt()
  @Min(1)
  @Max(100)
  @IsOptional()
  limit?: number = 20;
}
