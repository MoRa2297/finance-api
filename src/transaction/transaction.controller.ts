import {
    Controller, Get, Post, Put, Delete,
    Body, Param, Query, ParseIntPipe, UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { TransactionService } from './transaction.service';
import { CreateTransactionDto, UpdateTransactionDto, FilterTransactionDto } from './dto';
import { JwtAuthGuard } from '@common/guards/jwt-auth.guard';
import { CurrentUser, CurrentUserPayload } from '@common/decorators/current-user.decorator';

@ApiTags('Transactions')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('transactions')
export class TransactionController {
    constructor(private readonly transactionService: TransactionService) {}

    @Get()
    @ApiOperation({ summary: 'Get transactions with filters and pagination' })
    getTransactions(
        @CurrentUser() user: CurrentUserPayload,
        @Query() filters: FilterTransactionDto,
    ) {
        return this.transactionService.getTransactions(user.id, filters);
    }

    @Get(':id')
    @ApiOperation({ summary: 'Get a single transaction' })
    getTransaction(
        @Param('id', ParseIntPipe) id: number,
        @CurrentUser() user: CurrentUserPayload,
    ) {
        return this.transactionService.getTransaction(id, user.id);
    }

    @Post()
    @ApiOperation({ summary: 'Create a new transaction' })
    createTransaction(
        @CurrentUser() user: CurrentUserPayload,
        @Body() dto: CreateTransactionDto,
    ) {
        return this.transactionService.createTransaction(user.id, dto);
    }

    @Put(':id')
    @ApiOperation({ summary: 'Update a transaction' })
    updateTransaction(
        @Param('id', ParseIntPipe) id: number,
        @CurrentUser() user: CurrentUserPayload,
        @Body() dto: UpdateTransactionDto,
    ) {
        return this.transactionService.updateTransaction(id, user.id, dto);
    }

    @Delete(':id')
    @ApiOperation({ summary: 'Delete a transaction' })
    deleteTransaction(
        @Param('id', ParseIntPipe) id: number,
        @CurrentUser() user: CurrentUserPayload,
    ) {
        return this.transactionService.deleteTransaction(id, user.id);
    }
}
