import { Controller, Get, Post, Put, Delete, Body, Param, ParseIntPipe, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { CardAccountService } from './card-account.service';
import { CreateCardAccountDto, UpdateCardAccountDto } from './dto';
import { JwtAuthGuard } from '@common/guards/jwt-auth.guard';
import { CurrentUser, CurrentUserPayload } from '@common/decorators/current-user.decorator';

@ApiTags('Card Accounts')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('cards')
export class CardAccountController {
    constructor(private readonly cardAccountService: CardAccountService) {}

    @Get()
    @ApiOperation({ summary: 'Get all cards for current user' })
    getCardAccounts(@CurrentUser() user: CurrentUserPayload) {
        return this.cardAccountService.getCardAccounts(user.id);
    }

    @Get(':id')
    @ApiOperation({ summary: 'Get a single card' })
    getCardAccount(
        @Param('id', ParseIntPipe) id: number,
        @CurrentUser() user: CurrentUserPayload,
    ) {
        return this.cardAccountService.getCardAccount(id, user.id);
    }

    @Post()
    @ApiOperation({ summary: 'Create a new card' })
    createCardAccount(
        @CurrentUser() user: CurrentUserPayload,
        @Body() dto: CreateCardAccountDto,
    ) {
        return this.cardAccountService.createCardAccount(user.id, dto);
    }

    @Put(':id')
    @ApiOperation({ summary: 'Update a card' })
    updateCardAccount(
        @Param('id', ParseIntPipe) id: number,
        @CurrentUser() user: CurrentUserPayload,
        @Body() dto: UpdateCardAccountDto,
    ) {
        return this.cardAccountService.updateCardAccount(id, user.id, dto);
    }

    @Delete(':id')
    @ApiOperation({ summary: 'Delete a card' })
    deleteCardAccount(
        @Param('id', ParseIntPipe) id: number,
        @CurrentUser() user: CurrentUserPayload,
    ) {
        return this.cardAccountService.deleteCardAccount(id, user.id);
    }
}
