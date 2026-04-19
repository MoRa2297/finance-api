import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { CardAccountService } from './card-account.service';
import { CardAccountType } from './types/card-account.types';
import {
  CreateCardAccountInput,
  UpdateCardAccountInput,
} from './inputs/card-account.inputs';
import { GqlAuthGuard } from '@common/guards/gql-auth.guard';
import {
  CurrentUser,
  CurrentUserPayload,
} from '@common/decorators/current-user.decorator';
import { MessageType } from '@auth/types/auth-gql.types';

@Resolver()
@UseGuards(GqlAuthGuard)
export class CardAccountResolver {
  constructor(private readonly cardAccountService: CardAccountService) {}

  @Query(() => [CardAccountType])
  async cards(@CurrentUser() user: CurrentUserPayload) {
    return this.cardAccountService.getCardAccounts(user.id);
  }

  @Query(() => CardAccountType)
  async card(
    @Args('id', { type: () => Int }) id: number,
    @CurrentUser() user: CurrentUserPayload,
  ) {
    return this.cardAccountService.getCardAccount(id, user.id);
  }

  @Mutation(() => CardAccountType)
  async createCard(
    @CurrentUser() user: CurrentUserPayload,
    @Args('input') input: CreateCardAccountInput,
  ) {
    return this.cardAccountService.createCardAccount(user.id, input);
  }

  @Mutation(() => CardAccountType)
  async updateCard(
    @Args('id', { type: () => Int }) id: number,
    @CurrentUser() user: CurrentUserPayload,
    @Args('input') input: UpdateCardAccountInput,
  ) {
    return this.cardAccountService.updateCardAccount(id, user.id, input);
  }

  @Mutation(() => MessageType)
  async deleteCard(
    @Args('id', { type: () => Int }) id: number,
    @CurrentUser() user: CurrentUserPayload,
  ) {
    return this.cardAccountService.deleteCardAccount(id, user.id);
  }
}
