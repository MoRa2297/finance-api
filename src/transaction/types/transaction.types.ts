import { Field, Float, Int, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class TransactionType {
    @Field(() => Int)
    id: number;

    @Field(() => Float)
    money: number;

    @Field()
    recived: boolean;

    @Field()
    date: Date;

    @Field()
    description: string;

    @Field()
    recurrent: boolean;

    @Field()
    repeat: boolean;

    @Field()
    note: string;

    @Field()
    type: string;

    @Field(() => Int, { nullable: true })
    userId?: number;

    @Field(() => Int)
    categoryId: number;

    @Field(() => Int, { nullable: true })
    bankAccountId?: number;

    @Field(() => Int, { nullable: true })
    cardAccountId?: number;

    @Field()
    createdDate: Date;

    @Field()
    updateDate: Date;
}

@ObjectType()
export class PaginationMeta {
    @Field(() => Int)
    total: number;

    @Field(() => Int)
    page: number;

    @Field(() => Int)
    limit: number;

    @Field(() => Int)
    totalPages: number;
}

@ObjectType()
export class PaginatedTransactionsType {
    @Field(() => [TransactionType])
    data: TransactionType[];

    @Field(() => PaginationMeta)
    meta: PaginationMeta;
}
