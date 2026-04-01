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
import { Frequency, RecurringType } from '@prisma/client';

registerEnumType(Frequency, {
  name: 'FrequencyEnum',
});

registerEnumType(RecurringType, {
  name: 'RecurringTypeEnum',
});

@InputType()
export class CreateRecurringRuleInput {
  @Field()
  @IsString()
  @IsNotEmpty()
  description: string;

  @Field(() => Float)
  @IsNumber()
  amount: number;

  @Field()
  @IsEnum(RecurringType)
  type: RecurringType;

  @Field()
  @IsEnum(Frequency)
  frequency: Frequency;

  @Field()
  @IsDateString()
  startDate: string;

  @Field({ nullable: true })
  @IsDateString()
  @IsOptional()
  endDate?: string;

  @Field(() => Int, { nullable: true })
  @IsInt()
  @Min(1)
  @Max(31)
  @IsOptional()
  dayOfMonth?: number;

  @Field({ nullable: true })
  @IsString()
  @IsOptional()
  dayOfWeek?: string;

  @Field({ nullable: true })
  @IsString()
  @IsOptional()
  note?: string;

  @Field({ nullable: true })
  @IsBoolean()
  @IsOptional()
  isActive?: boolean;

  @Field(() => Int)
  @IsInt()
  categoryId: number;

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
export class UpdateRecurringRuleInput {
  @Field({ nullable: true })
  @IsString()
  @IsOptional()
  description?: string;

  @Field(() => Float, { nullable: true })
  @IsNumber()
  @IsOptional()
  amount?: number;

  @Field({ nullable: true })
  @IsEnum(RecurringType)
  @IsOptional()
  type?: RecurringType;

  @Field({ nullable: true })
  @IsEnum(Frequency)
  @IsOptional()
  frequency?: Frequency;

  @Field({ nullable: true })
  @IsDateString()
  @IsOptional()
  startDate?: string;

  @Field({ nullable: true })
  @IsDateString()
  @IsOptional()
  endDate?: string;

  @Field(() => Int, { nullable: true })
  @IsInt()
  @Min(1)
  @Max(31)
  @IsOptional()
  dayOfMonth?: number;

  @Field({ nullable: true })
  @IsString()
  @IsOptional()
  dayOfWeek?: string;

  @Field({ nullable: true })
  @IsString()
  @IsOptional()
  note?: string;

  @Field({ nullable: true })
  @IsBoolean()
  @IsOptional()
  isActive?: boolean;

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
export class FilterRecurringRuleInput {
  @Field({ nullable: true })
  @IsEnum(RecurringType)
  @IsOptional()
  type?: RecurringType;

  @Field({ nullable: true })
  @IsEnum(Frequency)
  @IsOptional()
  frequency?: Frequency;

  @Field({ nullable: true })
  @IsBoolean()
  @IsOptional()
  isActive?: boolean;

  @Field(() => Int, { nullable: true })
  @IsInt()
  @IsOptional()
  categoryId?: number;

  @Field(() => Int, { nullable: true })
  @IsInt()
  @IsOptional()
  bankAccountId?: number;

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
