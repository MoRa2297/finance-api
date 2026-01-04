import { Injectable, UnauthorizedException, ConflictException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { PrismaService } from '../prisma';
import {ChangePasswordDto, LoginDto, RegisterDto, UpdateDto} from './dto';

@Injectable()
export class AuthService {
    constructor(
        private prisma: PrismaService,
        private jwtService: JwtService,
    ) {}

    /**
     * Register a new user.
     */
    async register(dto: RegisterDto) {
        // Check if user already exists
        const existingUser = await this.prisma.user.findFirst({
            where: { email: dto.email },
        });

        if (existingUser) {
            throw new ConflictException('Email already registered');
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(dto.password, 10);

        // Create user
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

        // Generate token
        const token = this.generateToken(user.id);

        // Remove password from response
        const { password, ...userWithoutPassword } = user;

        return {
            user: userWithoutPassword,
            accessToken: token,
        };
    }

    /**
     * Login user.
     */
    async login(dto: LoginDto) {
        // Find user
        const user = await this.prisma.user.findFirst({
            where: { email: dto.email },
        });

        if (!user || !user.password) {
            throw new UnauthorizedException('Invalid credentials');
        }

        // Verify password
        const isPasswordValid = await bcrypt.compare(dto.password, user.password);

        if (!isPasswordValid) {
            throw new UnauthorizedException('Invalid credentials');
        }

        // Generate token
        const token = this.generateToken(user.id);

        // Remove password from response
        const { password, ...userWithoutPassword } = user;

        return {
            user: userWithoutPassword,
            accessToken: token,
        };
    }

    /**
     * Get user by ID.
     */
    async getUserById(userId: number) {
        const user = await this.prisma.user.findUnique({
            where: { id: userId },
        });

        if (!user) {
            throw new UnauthorizedException('User not found');
        }

        const { password, ...userWithoutPassword } = user;
        return userWithoutPassword;
    }

    /**
     * Update user by ID.
     */
    async updateProfile(userId: number, userData:  UpdateDto) {
        const { name, surname, sex, birthDate, imageUrl } =
            userData;

        const user = await this.prisma.user.update({
            where: { id: userId },
            data: {
                ...(name && { name }),
                ...(surname && { surname }),
                ...(sex && { sex }),
                // ...(imageUrl && newImageUrl && { imageUrl: newImageUrl }), TODO add AWS cloud
                // ...(birthDate && { birthDate: birthDateFormatted }),
                updateDate: new Date(),
            }
        });

        const { password, ...userWithoutPassword } = user;
        return userWithoutPassword;
    }


    /**
     * Update user by ID.
     */
    async changePassword(userId: number, newPassword:  ChangePasswordDto) {
        const user = await this.prisma.user.update({
            where: { id: userId },
            data: {
                password: newPassword.password,
                updateDate: new Date(),

            }
        });

        const { password, ...userWithoutPassword } = user;
        // TODO change output??
        return userWithoutPassword;
    }


    /**
     * Generate JWT token.
     */
    private generateToken(userId: number): string {
        return this.jwtService.sign({ sub: userId });
    }
}
