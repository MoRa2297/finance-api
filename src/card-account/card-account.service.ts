import { Injectable, NotFoundException, ForbiddenException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '@prisma-client/prisma.service';
import { CreateCardAccountDto, UpdateCardAccountDto } from './dto';

@Injectable()
export class CardAccountService {
    constructor(private readonly prisma: PrismaService) {}

    async getCardAccounts(userId: number) {
        return this.prisma.cardAccount.findMany({
            where: { userId },
            orderBy: { createdDate: 'desc' },
        });
    }

    async getCardAccount(id: number, userId: number) {
        const card = await this.findCardOrThrow(id);
        this.checkOwnership(card.userId, userId);
        return card;
    }

    async createCardAccount(userId: number, dto: CreateCardAccountDto) {
        // Se viene specificato un bankAccountId verifica che appartenga all'utente
        if (dto.bankAccountId) {
            await this.verifyBankAccountOwnership(dto.bankAccountId, userId);
        }

        return this.prisma.cardAccount.create({
            data: {
                name: dto.name,
                cardLimit: dto.cardLimit,
                monthExpiry: dto.monthExpiry,
                yearExpiry: dto.yearExpiry,
                userId,
                bankAccountId: dto.bankAccountId,
                cardTypeId: dto.cardTypeId,
            },
        });
    }

    async updateCardAccount(id: number, userId: number, dto: UpdateCardAccountDto) {
        const card = await this.findCardOrThrow(id);
        this.checkOwnership(card.userId, userId);

        // Se viene aggiornato il bankAccountId verifica che appartenga all'utente
        if (dto.bankAccountId) {
            await this.verifyBankAccountOwnership(dto.bankAccountId, userId);
        }

        return this.prisma.cardAccount.update({
            where: { id },
            data: {
                ...dto,
                updateDate: new Date(),
            },
        });
    }

    async deleteCardAccount(id: number, userId: number) {
        const card = await this.findCardOrThrow(id);
        this.checkOwnership(card.userId, userId);

        await this.prisma.cardAccount.delete({ where: { id } });

        return { message: 'Card deleted successfully' };
    }

    private async findCardOrThrow(id: number) {
        const card = await this.prisma.cardAccount.findUnique({
            where: { id },
        });

        if (!card) {
            throw new NotFoundException(`Card with id ${id} not found`);
        }

        return card;
    }

    private async verifyBankAccountOwnership(bankAccountId: number, userId: number) {
        const bankAccount = await this.prisma.bankAccount.findUnique({
            where: { id: bankAccountId },
        });

        if (!bankAccount) {
            throw new NotFoundException(`Bank account with id ${bankAccountId} not found`);
        }

        if (bankAccount.userId !== userId) {
            throw new ForbiddenException('You do not have access to this bank account');
        }
    }

    private checkOwnership(resourceUserId: number, requestUserId: number) {
        if (resourceUserId !== requestUserId) {
            throw new ForbiddenException('You do not have access to this resource');
        }
    }
}
