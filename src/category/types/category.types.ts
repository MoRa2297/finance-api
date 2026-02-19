import { Field, Int, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class CategoryType {
    @Field(() => Int)
    id: number;

    @Field()
    name: string;

    @Field()
    type: string;

    @Field(() => Int)
    userId: number;

    @Field(() => Int)
    colorId: number;

    @Field(() => Int, { nullable: true })
    iconId?: number;

    @Field()
    createdDate: Date;

    @Field()
    updateDate: Date;
}
