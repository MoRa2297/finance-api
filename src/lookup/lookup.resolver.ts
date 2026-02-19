import { Query, Resolver } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { LookupService } from './lookup.service';
import {
    BankAccountTypeType,
    BankTypeType,
    CardTypeType,
    CategoryIconType,
    ColorType,
} from './types/lookup.types';
import { GqlAuthGuard } from '@common/guards/gql-auth.guard';

@Resolver()
@UseGuards(GqlAuthGuard)
export class LookupResolver {
    constructor(private readonly lookupService: LookupService) {}

    @Query(() => [ColorType])
    async colors() {
        return this.lookupService.getColors();
    }

    @Query(() => [CategoryIconType])
    async categoryIcons() {
        return this.lookupService.getCategoryIcons();
    }

    @Query(() => [BankTypeType])
    async bankTypes() {
        return this.lookupService.getBankTypes();
    }

    @Query(() => [BankAccountTypeType])
    async bankAccountTypes() {
        return this.lookupService.getBankAccountTypes();
    }

    @Query(() => [CardTypeType])
    async cardTypes() {
        return this.lookupService.getCardTypes();
    }
}
