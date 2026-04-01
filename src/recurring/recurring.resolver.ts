import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { RecurringService } from './recurring.service';
import {
  RecurringRuleType,
  PaginatedRecurringRulesType,
  GenerateResultType,
} from './types/recurring-rule.types';
import {
  CreateRecurringRuleInput,
  UpdateRecurringRuleInput,
  FilterRecurringRuleInput,
} from './inputs/recurring-rule.inputs';
import { GqlAuthGuard } from '@common/guards/gql-auth.guard';
import {
  CurrentUser,
  CurrentUserPayload,
} from '@common/decorators/current-user.decorator';
import { MessageType } from '@auth/types/auth-gql.types';

@Resolver()
@UseGuards(GqlAuthGuard)
export class RecurringResolver {
  constructor(private readonly recurringService: RecurringService) {}

  @Query(() => PaginatedRecurringRulesType)
  async recurringRules(
    @CurrentUser() user: CurrentUserPayload,
    @Args('filters', { nullable: true }) filters?: FilterRecurringRuleInput,
  ) {
    return this.recurringService.getRecurringRules(user.id, filters ?? {});
  }

  @Query(() => RecurringRuleType)
  async recurringRule(
    @Args('id', { type: () => Int }) id: number,
    @CurrentUser() user: CurrentUserPayload,
  ) {
    return this.recurringService.getRecurringRule(id, user.id);
  }

  @Mutation(() => RecurringRuleType)
  async createRecurringRule(
    @CurrentUser() user: CurrentUserPayload,
    @Args('input') input: CreateRecurringRuleInput,
  ) {
    return this.recurringService.createRecurringRule(user.id, input);
  }

  @Mutation(() => GenerateResultType)
  async generateDueTransactions(@CurrentUser() user: CurrentUserPayload) {
    return this.recurringService.generateDueTransactions(user.id);
  }

  @Mutation(() => RecurringRuleType)
  async updateRecurringRule(
    @Args('id', { type: () => Int }) id: number,
    @CurrentUser() user: CurrentUserPayload,
    @Args('input') input: UpdateRecurringRuleInput,
  ) {
    return this.recurringService.updateRecurringRule(id, user.id, input);
  }

  @Mutation(() => MessageType)
  async deleteRecurringRule(
    @Args('id', { type: () => Int }) id: number,
    @CurrentUser() user: CurrentUserPayload,
  ) {
    return this.recurringService.deleteRecurringRule(id, user.id);
  }
}
