import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { CategoryService } from './category.service';
import { CategoryType } from './types/category.types';
import {
  CreateCategoryInput,
  UpdateCategoryInput,
} from './inputs/category.inputs';
import { GqlAuthGuard } from '@common/guards/gql-auth.guard';
import {
  CurrentUser,
  CurrentUserPayload,
} from '@common/decorators/current-user.decorator';
import { MessageType } from '@auth/types/auth-gql.types';

@Resolver()
@UseGuards(GqlAuthGuard)
export class CategoryResolver {
  constructor(private readonly categoryService: CategoryService) {}

  @Query(() => [CategoryType])
  async categories(@CurrentUser() user: CurrentUserPayload) {
    return this.categoryService.getCategories(user.id);
  }

  @Query(() => CategoryType)
  async category(
    @Args('id', { type: () => Int }) id: number,
    @CurrentUser() user: CurrentUserPayload,
  ) {
    return this.categoryService.getCategory(id, user.id);
  }

  @Mutation(() => CategoryType)
  async createCategory(
    @CurrentUser() user: CurrentUserPayload,
    @Args('input') input: CreateCategoryInput,
  ) {
    return this.categoryService.createCategory(user.id, input);
  }

  @Mutation(() => CategoryType)
  async updateCategory(
    @Args('id', { type: () => Int }) id: number,
    @CurrentUser() user: CurrentUserPayload,
    @Args('input') input: UpdateCategoryInput,
  ) {
    return this.categoryService.updateCategory(id, user.id, input);
  }

  @Mutation(() => MessageType)
  async deleteCategory(
    @Args('id', { type: () => Int }) id: number,
    @CurrentUser() user: CurrentUserPayload,
  ) {
    return this.categoryService.deleteCategory(id, user.id);
  }
}
