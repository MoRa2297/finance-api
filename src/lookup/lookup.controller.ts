import { Controller, Get, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { LookupService } from './lookup.service';
import { JwtAuthGuard } from '@common/guards/jwt-auth.guard';

@ApiTags('Lookup')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('lookup')
export class LookupController {
    constructor(private readonly lookupService: LookupService) {}

    @Get('colors')
    @ApiOperation({ summary: 'Get all available colors' })
    getColors() {
        return this.lookupService.getColors();
    }

    @Get('category-icons')
    @ApiOperation({ summary: 'Get all available category icons' })
    getCategoryIcons() {
        return this.lookupService.getCategoryIcons();
    }

    @Get('bank-types')
    @ApiOperation({ summary: 'Get all bank types' })
    getBankTypes() {
        return this.lookupService.getBankTypes();
    }

    @Get('bank-account-types')
    @ApiOperation({ summary: 'Get all bank account types' })
    getBankAccountTypes() {
        return this.lookupService.getBankAccountTypes();
    }

    @Get('card-types')
    @ApiOperation({ summary: 'Get all card types' })
    getCardTypes() {
        return this.lookupService.getCardTypes();
    }
}
