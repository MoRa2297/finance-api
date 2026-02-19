import { Field, Float, Int, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class BankAccountType {
    @Field(() => Int)
    id: number;

    @Field()
    name: string;

    @Field(() => Float)
    startingBalance: number;

    @Field(() => Int)
    userId: number;

    @Field(() => Int, { nullable: true })
    colorId?: number;

    @Field(() => Int, { nullable: true })
    bankTypeId?: number;

    @Field(() => Int, { nullable: true })
    bankAccountTypeId?: number;

    @Field()
    createdDate: Date;

    @Field()
    updateDate: Date;
}
