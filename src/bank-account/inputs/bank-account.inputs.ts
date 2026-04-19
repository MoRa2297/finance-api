import { InputType, Field, Int, Float } from '@nestjs/graphql';
import {
  IsString,
  IsNotEmpty,
  IsNumber,
  IsInt,
  IsOptional,
} from 'class-validator';

@InputType()
export class CreateBankAccountInput {
  @Field()
  @IsString()
  @IsNotEmpty()
  name: string;

  @Field(() => Float)
  @IsNumber()
  startingBalance: number;

  @Field(() => Int, { nullable: true })
  @IsInt()
  @IsOptional()
  colorId?: number;

  @Field(() => Int, { nullable: true })
  @IsInt()
  @IsOptional()
  bankTypeId?: number;

  @Field(() => Int, { nullable: true })
  @IsInt()
  @IsOptional()
  bankAccountTypeId?: number;
}

@InputType()
export class UpdateBankAccountInput {
  @Field({ nullable: true })
  @IsString()
  @IsOptional()
  name?: string;

  @Field(() => Float, { nullable: true })
  @IsNumber()
  @IsOptional()
  startingBalance?: number;

  @Field(() => Int, { nullable: true })
  @IsInt()
  @IsOptional()
  colorId?: number;

  @Field(() => Int, { nullable: true })
  @IsInt()
  @IsOptional()
  bankTypeId?: number;

  @Field(() => Int, { nullable: true })
  @IsInt()
  @IsOptional()
  bankAccountTypeId?: number;
}
