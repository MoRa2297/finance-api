import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { BankAccountService } from './bank-account.service';
import { BankAccountType } from './types/bank-account.types';
import {
  CreateBankAccountInput,
  UpdateBankAccountInput,
} from './inputs/bank-account.inputs';
import { GqlAuthGuard } from '@common/guards/gql-auth.guard';
import {
  CurrentUser,
  CurrentUserPayload,
} from '@common/decorators/current-user.decorator';
import { MessageType } from '@auth/types/auth-gql.types';

@Resolver()
@UseGuards(GqlAuthGuard)
export class BankAccountResolver {
  constructor(private readonly bankAccountService: BankAccountService) {}

  @Query(() => [BankAccountType])
  async bankAccounts(@CurrentUser() user: CurrentUserPayload) {
    return this.bankAccountService.getBankAccounts(user.id);
  }

  @Query(() => BankAccountType)
  async bankAccount(
    @Args('id', { type: () => Int }) id: number,
    @CurrentUser() user: CurrentUserPayload,
  ) {
    return this.bankAccountService.getBankAccount(id, user.id);
  }

  @Mutation(() => BankAccountType)
  async createBankAccount(
    @CurrentUser() user: CurrentUserPayload,
    @Args('input') input: CreateBankAccountInput,
  ) {
    return this.bankAccountService.createBankAccount(user.id, input);
  }

  @Mutation(() => BankAccountType)
  async updateBankAccount(
    @Args('id', { type: () => Int }) id: number,
    @CurrentUser() user: CurrentUserPayload,
    @Args('input') input: UpdateBankAccountInput,
  ) {
    return this.bankAccountService.updateBankAccount(id, user.id, input);
  }

  @Mutation(() => MessageType)
  async deleteBankAccount(
    @Args('id', { type: () => Int }) id: number,
    @CurrentUser() user: CurrentUserPayload,
  ) {
    return this.bankAccountService.deleteBankAccount(id, user.id);
  }
}
