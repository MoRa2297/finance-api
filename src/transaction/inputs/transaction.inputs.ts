import { InputType, Field, Int, Float } from '@nestjs/graphql';
import {
    IsString, IsNotEmpty, IsNumber, IsInt,
    IsOptional, IsBoolean, IsDateString, IsIn,
    Min, Max,
} from 'class-validator';

@InputType()
export class CreateTransactionInput {
    @Field(() => Float)
    @IsNumber()
    money: number;

    @Field()
    @IsBoolean()
    recived: boolean;

    @Field()
    @IsDateString()
    date: string;

    @Field()
    @IsString()
    @IsNotEmpty()
    description: string;

    @Field()
    @IsBoolean()
    recurrent: boolean;

    @Field()
    @IsBoolean()
    repeat: boolean;

    @Field()
    @IsString()
    note: string;

    @Field()
    @IsString()
    @IsIn(['income', 'expense', 'card_expense'])
    type: string;

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
export class UpdateTransactionInput {
    @Field(() => Float, { nullable: true })
    @IsNumber()
    @IsOptional()
    money?: number;

    @Field({ nullable: true })
    @IsBoolean()
    @IsOptional()
    recived?: boolean;

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
    @IsBoolean()
    @IsOptional()
    repeat?: boolean;

    @Field({ nullable: true })
    @IsString()
    @IsOptional()
    note?: string;

    @Field({ nullable: true })
    @IsString()
    @IsIn(['income', 'expense', 'card_expense'])
    @IsOptional()
    type?: string;

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

    @Field({ nullable: true })
    @IsString()
    @IsIn(['income', 'expense', 'card_expense'])
    @IsOptional()
    type?: string;

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
