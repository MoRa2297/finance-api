import { UseGuards } from '@nestjs/common';
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { AuthService } from './auth.service';
import { RegisterInput, LoginInput, UpdateProfileInput, ChangePasswordInput } from './inputs/auth.inputs';
import { AuthType, MessageType, UserType } from './types/auth-gql.types';
import { GqlAuthGuard } from '@common/guards/gql-auth.guard';
import { CurrentUser, CurrentUserPayload } from '@common/decorators/current-user.decorator';

@Resolver()
export class AuthResolver {
    constructor(private readonly authService: AuthService) {}

    @Mutation(() => AuthType)
    async register(@Args('input') input: RegisterInput): Promise<AuthType> {
        return this.authService.register(input) as any;
    }

    @Mutation(() => AuthType)
    async login(@Args('input') input: LoginInput): Promise<AuthType> {
        return this.authService.login(input) as any;
    }

    @Query(() => UserType)
    @UseGuards(GqlAuthGuard)
    async me(@CurrentUser() user: CurrentUserPayload): Promise<UserType> {
        return this.authService.getMe(user.id) as any;
    }

    @Mutation(() => UserType)
    @UseGuards(GqlAuthGuard)
    async updateProfile(
        @CurrentUser() user: CurrentUserPayload,
        @Args('input') input: UpdateProfileInput,
    ): Promise<UserType> {
        return this.authService.updateProfile(user.id, input) as any;
    }

    @Mutation(() => MessageType)
    @UseGuards(GqlAuthGuard)
    async changePassword(
        @CurrentUser() user: CurrentUserPayload,
        @Args('input') input: ChangePasswordInput,
    ): Promise<MessageType> {
        return this.authService.changePassword(user.id, input) as any;
    }

    @Mutation(() => MessageType)
    @UseGuards(GqlAuthGuard)
    async deleteAccount(@CurrentUser() user: CurrentUserPayload): Promise<MessageType> {
        return this.authService.deleteAccount(user.id) as any;
    }
}
