import { Field, Float, Int, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class CardAccountType {
  @Field(() => Int)
  id: number;

  @Field()
  name: string;

  @Field(() => Float)
  cardLimit: number;

  @Field(() => Int)
  monthExpiry: number;

  @Field(() => Int)
  yearExpiry: number;

  @Field(() => Int)
  userId: number;

  @Field(() => Int, { nullable: true })
  bankAccountId?: number;

  @Field(() => Int, { nullable: true })
  cardTypeId?: number;

  @Field()
  createdDate: Date;

  @Field()
  updateDate: Date;
}
