import { InputType, Field, Int } from '@nestjs/graphql';
import { IsString, IsNotEmpty, IsInt, IsOptional, IsIn } from 'class-validator';

@InputType()
export class CreateCategoryInput {
    @Field()
    @IsString()
    @IsNotEmpty()
    name: string;

    @Field()
    @IsString()
    @IsIn(['expense', 'income'])
    type: string;

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

    @Field({ nullable: true })
    @IsString()
    @IsIn(['expense', 'income'])
    @IsOptional()
    type?: string;

    @Field(() => Int, { nullable: true })
    @IsInt()
    @IsOptional()
    colorId?: number;

    @Field(() => Int, { nullable: true })
    @IsInt()
    @IsOptional()
    iconId?: number;
}
