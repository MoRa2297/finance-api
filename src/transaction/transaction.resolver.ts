import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { TransactionService } from './transaction.service';
import {
  TransactionType,
  PaginatedTransactionsType,
  TransferDetailType,
} from './types/transaction.types';
import {
  CreateTransactionInput,
  CreateTransferInput,
  UpdateTransactionInput,
  FilterTransactionInput,
} from './inputs/transaction.inputs';
import { GqlAuthGuard } from '@common/guards/gql-auth.guard';
import {
  CurrentUser,
  CurrentUserPayload,
} from '@common/decorators/current-user.decorator';
import { MessageType } from '@auth/types/auth-gql.types';

@Resolver()
@UseGuards(GqlAuthGuard)
export class TransactionResolver {
  constructor(private readonly transactionService: TransactionService) {}

  @Query(() => PaginatedTransactionsType)
  async transactions(
    @CurrentUser() user: CurrentUserPayload,
    @Args('filters', { nullable: true }) filters?: FilterTransactionInput,
  ) {
    return this.transactionService.getTransactions(user.id, filters ?? {});
  }

  @Query(() => TransactionType)
  async transaction(
    @Args('id', { type: () => Int }) id: number,
    @CurrentUser() user: CurrentUserPayload,
  ) {
    return this.transactionService.getTransaction(id, user.id);
  }

  @Mutation(() => TransactionType)
  async createTransaction(
    @CurrentUser() user: CurrentUserPayload,
    @Args('input') input: CreateTransactionInput,
  ) {
    return this.transactionService.createTransaction(user.id, input);
  }

  @Mutation(() => TransferDetailType)
  async createTransfer(
    @CurrentUser() user: CurrentUserPayload,
    @Args('input') input: CreateTransferInput,
  ) {
    return this.transactionService.createTransfer(user.id, input);
  }

  @Mutation(() => TransactionType)
  async updateTransaction(
    @Args('id', { type: () => Int }) id: number,
    @CurrentUser() user: CurrentUserPayload,
    @Args('input') input: UpdateTransactionInput,
  ) {
    return this.transactionService.updateTransaction(id, user.id, input);
  }

  @Mutation(() => MessageType)
  async deleteTransaction(
    @Args('id', { type: () => Int }) id: number,
    @CurrentUser() user: CurrentUserPayload,
  ) {
    return this.transactionService.deleteTransaction(id, user.id);
  }
}
