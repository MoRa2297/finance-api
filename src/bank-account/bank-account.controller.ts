import { Controller, Get, Post, Put, Delete, Body, Param, ParseIntPipe, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { BankAccountService } from './bank-account.service';
import { CreateBankAccountDto, UpdateBankAccountDto } from './dto';
import { JwtAuthGuard } from '@common/guards/jwt-auth.guard';
import { CurrentUser, CurrentUserPayload } from '@common/decorators/current-user.decorator';

@ApiTags('Bank Accounts')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('bank-accounts')
export class BankAccountController {
    constructor(private readonly bankAccountService: BankAccountService) {}

    @Get()
    @ApiOperation({ summary: 'Get all bank accounts for current user' })
    getBankAccounts(@CurrentUser() user: CurrentUserPayload) {
        return this.bankAccountService.getBankAccounts(user.id);
    }

    @Get(':id')
    @ApiOperation({ summary: 'Get a single bank account' })
    getBankAccount(
        @Param('id', ParseIntPipe) id: number,
        @CurrentUser() user: CurrentUserPayload,
    ) {
        return this.bankAccountService.getBankAccount(id, user.id);
    }

    @Post()
    @ApiOperation({ summary: 'Create a new bank account' })
    createBankAccount(
        @CurrentUser() user: CurrentUserPayload,
        @Body() dto: CreateBankAccountDto,
    ) {
        return this.bankAccountService.createBankAccount(user.id, dto);
    }

    @Put(':id')
    @ApiOperation({ summary: 'Update a bank account' })
    updateBankAccount(
        @Param('id', ParseIntPipe) id: number,
        @CurrentUser() user: CurrentUserPayload,
        @Body() dto: UpdateBankAccountDto,
    ) {
        return this.bankAccountService.updateBankAccount(id, user.id, dto);
    }

    @Delete(':id')
    @ApiOperation({ summary: 'Delete a bank account' })
    deleteBankAccount(
        @Param('id', ParseIntPipe) id: number,
        @CurrentUser() user: CurrentUserPayload,
    ) {
        return this.bankAccountService.deleteBankAccount(id, user.id);
    }
}
