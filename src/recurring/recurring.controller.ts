import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Query,
  ParseIntPipe,
  UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { RecurringService } from './recurring.service';
import {
  CreateRecurringRuleDto,
  UpdateRecurringRuleDto,
  FilterRecurringRuleDto,
} from './dto';
import { JwtAuthGuard } from '@common/guards/jwt-auth.guard';
import {
  CurrentUser,
  CurrentUserPayload,
} from '@common/decorators/current-user.decorator';

@ApiTags('Recurring')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('recurring')
export class RecurringController {
  constructor(private readonly recurringService: RecurringService) {}

  @Get()
  @ApiOperation({ summary: 'Get recurring rules with filters and pagination' })
  getRecurringRules(
    @CurrentUser() user: CurrentUserPayload,
    @Query() filters: FilterRecurringRuleDto,
  ) {
    return this.recurringService.getRecurringRules(user.id, filters);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a single recurring rule' })
  getRecurringRule(
    @Param('id', ParseIntPipe) id: number,
    @CurrentUser() user: CurrentUserPayload,
  ) {
    return this.recurringService.getRecurringRule(id, user.id);
  }

  @Post()
  @ApiOperation({ summary: 'Create a new recurring rule' })
  createRecurringRule(
    @CurrentUser() user: CurrentUserPayload,
    @Body() dto: CreateRecurringRuleDto,
  ) {
    return this.recurringService.createRecurringRule(user.id, dto);
  }

  @Post('generate')
  @ApiOperation({ summary: 'Generate due transactions for all active rules' })
  generateDueTransactions(@CurrentUser() user: CurrentUserPayload) {
    return this.recurringService.generateDueTransactions(user.id);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update a recurring rule' })
  updateRecurringRule(
    @Param('id', ParseIntPipe) id: number,
    @CurrentUser() user: CurrentUserPayload,
    @Body() dto: UpdateRecurringRuleDto,
  ) {
    return this.recurringService.updateRecurringRule(id, user.id, dto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a recurring rule' })
  deleteRecurringRule(
    @Param('id', ParseIntPipe) id: number,
    @CurrentUser() user: CurrentUserPayload,
  ) {
    return this.recurringService.deleteRecurringRule(id, user.id);
  }
}
