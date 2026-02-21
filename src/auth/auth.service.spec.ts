import { Test, TestingModule } from '@nestjs/testing';
import { ConflictException, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { AuthService } from './auth.service';
import { PrismaService } from '../prisma';
import * as helpers from './helpers';

import { mockUser, registerDto, loginDto } from '@test/fixtures';
import {mockJwtService, mockPrismaService} from "@test/mocks";

describe('AuthService', () => {
    let authService: AuthService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                AuthService,
                { provide: PrismaService, useValue: mockPrismaService },
                { provide: JwtService, useValue: mockJwtService },
            ],
        }).compile();

        authService = module.get<AuthService>(AuthService);
        jest.clearAllMocks();
    });

    // ─── register ──────────────────────────────────────────────────────────────

    describe('register', () => {
        it('should register a new user and return token', async () => {
            // Arrange
            mockPrismaService.user.findFirst.mockResolvedValue(null);
            mockPrismaService.user.create.mockResolvedValue(mockUser);
            jest.spyOn(helpers, 'hashPassword').mockResolvedValue('hashedPassword');

            // Act
            const result = await authService.register(registerDto);

            // Assert
            expect(result.accessToken).toBe('mock-jwt-token');
            expect(result.user.email).toBe(mockUser.email);
            expect(result.user).not.toHaveProperty('password');
        });

        it('should throw ConflictException if email already exists', async () => {
            // Arrange
            mockPrismaService.user.findFirst.mockResolvedValue(mockUser);

            // Act & Assert
            await expect(authService.register(registerDto)).rejects.toThrow(
                ConflictException,
            );
        });
    });

    // ─── login ─────────────────────────────────────────────────────────────────

    describe('login', () => {
        it('should return token on valid credentials', async () => {
            // Arrange
            mockPrismaService.user.findFirst.mockResolvedValue(mockUser);
            jest.spyOn(helpers, 'comparePassword').mockResolvedValue(true);

            // Act
            const result = await authService.login(loginDto);

            // Assert
            expect(result.accessToken).toBe('mock-jwt-token');
            expect(result.user.email).toBe(mockUser.email);
        });

        it('should throw UnauthorizedException if user not found', async () => {
            // Arrange
            mockPrismaService.user.findFirst.mockResolvedValue(null);

            // Act & Assert
            await expect(authService.login(loginDto)).rejects.toThrow(
                UnauthorizedException,
            );
        });

        it('should throw UnauthorizedException if password is invalid', async () => {
            // Arrange
            mockPrismaService.user.findFirst.mockResolvedValue(mockUser);
            jest.spyOn(helpers, 'comparePassword').mockResolvedValue(false);

            // Act & Assert
            await expect(authService.login(loginDto)).rejects.toThrow(
                UnauthorizedException,
            );
        });
    });

    // ─── getMe ─────────────────────────────────────────────────────────────────

    describe('getMe', () => {
        it('should return user without password', async () => {
            // Arrange
            mockPrismaService.user.findUnique.mockResolvedValue(mockUser);

            // Act
            const result = await authService.getMe(1);

            // Assert
            expect(result.email).toBe(mockUser.email);
            expect(result).not.toHaveProperty('password');
        });

        it('should throw UnauthorizedException if user not found', async () => {
            // Arrange
            mockPrismaService.user.findUnique.mockResolvedValue(null);

            // Act & Assert
            await expect(authService.getMe(999)).rejects.toThrow(
                UnauthorizedException,
            );
        });
    });

    // ─── updateProfile ─────────────────────────────────────────────────────────

    describe('updateProfile', () => {
        it('should update and return user without password', async () => {
            // Arrange
            mockPrismaService.user.findUnique.mockResolvedValue(mockUser);
            mockPrismaService.user.update.mockResolvedValue({
                ...mockUser,
                name: 'Luigi',
            });

            // Act
            const result = await authService.updateProfile(1, { name: 'Luigi' });

            // Assert
            expect(result.name).toBe('Luigi');
            expect(result).not.toHaveProperty('password');
        });
    });

    // ─── changePassword ────────────────────────────────────────────────────────

    describe('changePassword', () => {
        const changePasswordDto = {
            currentPassword: 'oldPassword',
            newPassword: 'newPassword123',
        };

        it('should change password successfully', async () => {
            // Arrange
            mockPrismaService.user.findUnique.mockResolvedValue(mockUser);
            jest.spyOn(helpers, 'comparePassword').mockResolvedValue(true);
            jest.spyOn(helpers, 'hashPassword').mockResolvedValue('newHashedPassword');
            mockPrismaService.user.update.mockResolvedValue(mockUser);

            // Act
            const result = await authService.changePassword(1, changePasswordDto);

            // Assert
            expect(result.message).toBeDefined();
        });

        it('should throw UnauthorizedException if current password is wrong', async () => {
            // Arrange
            mockPrismaService.user.findUnique.mockResolvedValue(mockUser);
            jest.spyOn(helpers, 'comparePassword').mockResolvedValue(false);

            // Act & Assert
            await expect(
                authService.changePassword(1, changePasswordDto),
            ).rejects.toThrow(UnauthorizedException);
        });
    });

    // ─── deleteAccount ─────────────────────────────────────────────────────────

    describe('deleteAccount', () => {
        it('should delete user and return message', async () => {
            // Arrange
            mockPrismaService.user.findUnique.mockResolvedValue(mockUser);
            mockPrismaService.user.delete.mockResolvedValue(mockUser);

            // Act
            const result = await authService.deleteAccount(1);

            // Assert
            expect(result.message).toBeDefined();
            expect(mockPrismaService.user.delete).toHaveBeenCalledWith({
                where: { id: 1 },
            });
        });

        it('should throw UnauthorizedException if user not found', async () => {
            // Arrange
            mockPrismaService.user.findUnique.mockResolvedValue(null);

            // Act & Assert
            await expect(authService.deleteAccount(999)).rejects.toThrow(
                UnauthorizedException,
            );
        });
    });
});
