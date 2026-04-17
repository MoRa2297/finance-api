import { Test, TestingModule } from '@nestjs/testing';
import { ForbiddenException, NotFoundException } from '@nestjs/common';
import { CategoryService } from '@category/category.service';
import { PrismaService } from '@prisma-client/prisma.service';
import { mockPrismaService } from '@test/mocks';
import {
  mockCategory,
  createCategoryDto,
  updateCategoryDto,
} from '@test/fixtures';

describe('CategoryService', () => {
  let categoryService: CategoryService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CategoryService,
        { provide: PrismaService, useValue: mockPrismaService },
      ],
    }).compile();

    categoryService = module.get<CategoryService>(CategoryService);
    jest.clearAllMocks();
  });

  // ─── getCategories ─────────────────────────────────────────────────────────

  describe('getCategories', () => {
    it('should return all categories for the user', async () => {
      // Arrange
      mockPrismaService.category.findMany.mockResolvedValue([mockCategory]);

      // Act
      const result = await categoryService.getCategories(1);

      // Assert
      expect(result).toEqual([mockCategory]);
      expect(mockPrismaService.category.findMany).toHaveBeenCalledWith({
        where: { userId: 1 },
        orderBy: { createdDate: 'desc' },
        include: {
          categoryColor: true,
          categoryIcon: true,
        },
      });
    });

    it('should return empty array if user has no categories', async () => {
      // Arrange
      mockPrismaService.category.findMany.mockResolvedValue([]);

      // Act
      const result = await categoryService.getCategories(1);

      // Assert
      expect(result).toEqual([]);
    });
  });

  // ─── getCategory ───────────────────────────────────────────────────────────

  describe('getCategory', () => {
    it('should return category if owned by user', async () => {
      // Arrange
      mockPrismaService.category.findUnique.mockResolvedValue(mockCategory);

      // Act
      const result = await categoryService.getCategory(1, 1);

      // Assert
      expect(result).toEqual(mockCategory);
    });

    it('should throw NotFoundException if category does not exist', async () => {
      // Arrange
      mockPrismaService.category.findUnique.mockResolvedValue(null);

      // Act & Assert
      await expect(categoryService.getCategory(999, 1)).rejects.toThrow(
        NotFoundException,
      );
    });

    it('should throw ForbiddenException if category belongs to another user', async () => {
      // Arrange — category belongs to userId 2, request from userId 1
      mockPrismaService.category.findUnique.mockResolvedValue({
        ...mockCategory,
        userId: 2,
      });

      // Act & Assert
      await expect(categoryService.getCategory(1, 1)).rejects.toThrow(
        ForbiddenException,
      );
    });
  });

  // ─── createCategory ────────────────────────────────────────────────────────

  describe('createCategory', () => {
    it('should create and return a new category', async () => {
      // Arrange
      mockPrismaService.category.create.mockResolvedValue(mockCategory);

      // Act
      const result = await categoryService.createCategory(1, createCategoryDto);

      // Assert
      expect(result).toEqual(mockCategory);
      expect(mockPrismaService.category.create).toHaveBeenCalledWith({
        data: {
          name: createCategoryDto.name,
          type: createCategoryDto.type,
          userId: 1,
          colorId: createCategoryDto.colorId,
          iconId: createCategoryDto.iconId,
        },
        include: {
          categoryColor: true,
          categoryIcon: true,
        },
      });
    });
  });

  // ─── updateCategory ────────────────────────────────────────────────────────

  describe('updateCategory', () => {
    it('should update and return the category', async () => {
      // Arrange
      mockPrismaService.category.findUnique.mockResolvedValue(mockCategory);
      mockPrismaService.category.update.mockResolvedValue({
        ...mockCategory,
        name: 'Spesa Aggiornata',
      });

      // Act
      const result = await categoryService.updateCategory(
        1,
        1,
        updateCategoryDto,
      );

      // Assert
      expect(result.name).toBe('Spesa Aggiornata');
    });

    it('should throw ForbiddenException if category belongs to another user', async () => {
      // Arrange
      mockPrismaService.category.findUnique.mockResolvedValue({
        ...mockCategory,
        userId: 2,
      });

      // Act & Assert
      await expect(
        categoryService.updateCategory(1, 1, updateCategoryDto),
      ).rejects.toThrow(ForbiddenException);
    });
  });

  // ─── deleteCategory ────────────────────────────────────────────────────────

  describe('deleteCategory', () => {
    it('should delete category and return message', async () => {
      // Arrange
      mockPrismaService.category.findUnique.mockResolvedValue(mockCategory);
      mockPrismaService.category.delete.mockResolvedValue(mockCategory);

      // Act
      const result = await categoryService.deleteCategory(1, 1);

      // Assert
      expect(result.message).toBeDefined();
      expect(mockPrismaService.category.delete).toHaveBeenCalledWith({
        where: { id: 1 },
      });
    });

    it('should throw NotFoundException if category does not exist', async () => {
      // Arrange
      mockPrismaService.category.findUnique.mockResolvedValue(null);

      // Act & Assert
      await expect(categoryService.deleteCategory(999, 1)).rejects.toThrow(
        NotFoundException,
      );
    });
  });
});
