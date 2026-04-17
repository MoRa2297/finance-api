import { Field, Float, Int, ObjectType } from '@nestjs/graphql';
import { PaginationMeta } from '@common/types/pagination.types';

export { PaginationMeta };

@ObjectType()
export class RecurringRuleType {
  @Field(() => Int)
  id: number;

  @Field()
  description: string;

  @Field(() => Float)
  amount: number;

  @Field()
  type: string;

  @Field()
  frequency: string;

  @Field(() => Int)
  interval: number;

  @Field()
  startDate: Date;

  @Field({ nullable: true })
  endDate?: Date;

  @Field(() => Int, { nullable: true })
  dayOfMonth?: number;

  @Field({ nullable: true })
  dayOfWeek?: string;

  @Field()
  note: string;

  @Field()
  isActive: boolean;

  @Field({ nullable: true })
  lastGeneratedDate?: Date;

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
export class PaginatedRecurringRulesType {
  @Field(() => [RecurringRuleType])
  data: RecurringRuleType[];

  @Field(() => PaginationMeta)
  meta: PaginationMeta;
}

@ObjectType()
export class GenerateResultType {
  @Field(() => Int)
  generated: number;

  @Field()
  message: string;
}
