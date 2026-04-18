import { Field, Float, Int, ObjectType } from '@nestjs/graphql';
import { PaginationMeta } from '@common/types/pagination.types';
import { BankAccountType } from '@bank-account/types/bank-account.types';

@ObjectType()
export class TransferDetailType {
  @Field(() => Int)
  id: number;

  @Field(() => BankAccountType)
  fromAccount: BankAccountType;

  @Field(() => BankAccountType)
  toAccount: BankAccountType;
}

@ObjectType()
export class TransactionType {
  @Field(() => Int)
  id: number;

  @Field(() => Float)
  money: number;

  @Field()
  date: Date;

  @Field()
  description: string;

  @Field()
  recurrent: boolean;

  @Field()
  note: string;

  @Field()
  type: string;

  @Field(() => Int, { nullable: true })
  userId?: number;

  @Field(() => Int, { nullable: true })
  categoryId?: number;

  @Field(() => Int, { nullable: true })
  bankAccountId?: number;

  @Field(() => Int, { nullable: true })
  cardAccountId?: number;

  @Field(() => Int, { nullable: true })
  recurringRuleId?: number;

  @Field(() => TransferDetailType, { nullable: true })
  transferFrom?: TransferDetailType;

  @Field(() => TransferDetailType, { nullable: true })
  transferTo?: TransferDetailType;

  @Field()
  createdDate: Date;

  @Field()
  updateDate: Date;
}

@ObjectType()
export class PaginatedTransactionsType {
  @Field(() => [TransactionType])
  data: TransactionType[];

  @Field(() => PaginationMeta)
  meta: PaginationMeta;
}
