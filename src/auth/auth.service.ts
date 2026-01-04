import { Injectable, UnauthorizedException, ConflictException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../prisma';
import { RegisterDto, LoginDto, UpdateProfileDto, ChangePasswordDto } from './dto';
import { AUTH_CONSTANTS } from './constants/auth.constants';
import { AuthResponse, UserWithoutPassword, MessageResponse, JwtPayload } from './types';
import { hashPassword, comparePassword, excludePassword } from './helpers';

@Injectable()
export class AuthService {
    constructor(
        private readonly prisma: PrismaService,
        private readonly jwtService: JwtService,
    ) {}

    /**
     * Register a new user.
     */
    async register(dto: RegisterDto): Promise<AuthResponse> {
        await this.checkEmailAvailability(dto.email);

        const hashedPassword = await hashPassword(dto.password);

        const user = await this.prisma.user.create({
            data: {
                email: dto.email,
                password: hashedPassword,
                name: dto.name,
                surname: dto.surname,
                sex: dto.sex,
                acceptedTerms: dto.acceptedTerms,
            },
        });

        const accessToken = this.generateToken(user.id);

        return {
            user: excludePassword(user),
            accessToken,
        };
    }

    /**
     * Login user.
     */
    async login(dto: LoginDto): Promise<AuthResponse> {
        const user = await this.prisma.user.findFirst({
            where: { email: dto.email },
        });

        if (!user || !user.password) {
            throw new UnauthorizedException(AUTH_CONSTANTS.MESSAGES.INVALID_CREDENTIALS);
        }

        const isPasswordValid = await comparePassword(dto.password, user.password);

        if (!isPasswordValid) {
            throw new UnauthorizedException(AUTH_CONSTANTS.MESSAGES.INVALID_CREDENTIALS);
        }

        const accessToken = this.generateToken(user.id);

        return {
            user: excludePassword(user),
            accessToken,
        };
    }

    /**
     * Get user by ID.
     */
    async getUserById(userId: number): Promise<UserWithoutPassword> {
        const user = await this.findUserOrThrow(userId);
        return excludePassword(user);
    }

    /**
     * Update user profile.
     */
    async updateProfile(userId: number, dto: UpdateProfileDto): Promise<UserWithoutPassword> {
        await this.findUserOrThrow(userId);

        const user = await this.prisma.user.update({
            where: { id: userId },
            data: {
                ...dto,
                updateDate: new Date(),
            },
        });

        return excludePassword(user);
    }

    /**
     * Change user password.
     */
    async changePassword(userId: number, dto: ChangePasswordDto): Promise<MessageResponse> {
        const user = await this.findUserOrThrow(userId);

        if (!user.password) {
            throw new UnauthorizedException(AUTH_CONSTANTS.MESSAGES.INVALID_CREDENTIALS);
        }

        const isCurrentPasswordValid = await comparePassword(dto.currentPassword, user.password);

        if (!isCurrentPasswordValid) {
            throw new UnauthorizedException(AUTH_CONSTANTS.MESSAGES.INCORRECT_PASSWORD);
        }

        const hashedPassword = await hashPassword(dto.newPassword);

        await this.prisma.user.update({
            where: { id: userId },
            data: {
                password: hashedPassword,
                updateDate: new Date(),
            },
        });

        return { message: AUTH_CONSTANTS.MESSAGES.PASSWORD_CHANGED };
    }

    /**
     * Delete user account.
     */
    async deleteUser(userId: number): Promise<MessageResponse> {
        await this.findUserOrThrow(userId);

        await this.prisma.user.delete({
            where: { id: userId },
        });

        return { message: AUTH_CONSTANTS.MESSAGES.ACCOUNT_DELETED };
    }

    /**
     * Check if email is available.
     */
    private async checkEmailAvailability(email: string): Promise<void> {
        const existingUser = await this.prisma.user.findFirst({
            where: { email },
        });

        if (existingUser) {
            throw new ConflictException(AUTH_CONSTANTS.MESSAGES.EMAIL_ALREADY_EXISTS);
        }
    }

    /**
     * Find user by ID or throw exception.
     */
    private async findUserOrThrow(userId: number) {
        const user = await this.prisma.user.findUnique({
            where: { id: userId },
        });

        if (!user) {
            throw new UnauthorizedException(AUTH_CONSTANTS.MESSAGES.USER_NOT_FOUND);
        }

        return user;
    }

    /**
     * Generate JWT token.
     */
    private generateToken(userId: number): string {
        const payload: JwtPayload = { sub: userId };
        return this.jwtService.sign(payload);
    }
}
