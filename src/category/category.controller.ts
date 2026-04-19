import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  ParseIntPipe,
  UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { CategoryService } from './category.service';
import { CreateCategoryDto, UpdateCategoryDto } from './dto';
import { JwtAuthGuard } from '@common/guards/jwt-auth.guard';
import {
  CurrentUser,
  CurrentUserPayload,
} from '@common/decorators/current-user.decorator';

@ApiTags('Categories')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('categories')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @Get()
  @ApiOperation({ summary: 'Get all categories for current user' })
  getCategories(@CurrentUser() user: CurrentUserPayload) {
    return this.categoryService.getCategories(user.id);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a single category' })
  getCategory(
    @Param('id', ParseIntPipe) id: number,
    @CurrentUser() user: CurrentUserPayload,
  ) {
    return this.categoryService.getCategory(id, user.id);
  }

  @Post()
  @ApiOperation({ summary: 'Create a new category' })
  createCategory(
    @CurrentUser() user: CurrentUserPayload,
    @Body() dto: CreateCategoryDto,
  ) {
    return this.categoryService.createCategory(user.id, dto);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update a category' })
  updateCategory(
    @Param('id', ParseIntPipe) id: number,
    @CurrentUser() user: CurrentUserPayload,
    @Body() dto: UpdateCategoryDto,
  ) {
    return this.categoryService.updateCategory(id, user.id, dto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a category' })
  deleteCategory(
    @Param('id', ParseIntPipe) id: number,
    @CurrentUser() user: CurrentUserPayload,
  ) {
    return this.categoryService.deleteCategory(id, user.id);
  }
}
