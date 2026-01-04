import { Controller, Post, Get, Put, Delete, Body, UseGuards, Request } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { RegisterDto, LoginDto, UpdateProfileDto, ChangePasswordDto } from './dto';
import { JwtAuthGuard } from './guards';
import { AuthResponse, UserWithoutPassword, MessageResponse } from './types';

interface AuthenticatedRequest {
    user: { id: number };
}

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) {}

    @Post('register')
    @ApiOperation({ summary: 'Register a new user' })
    async register(@Body() dto: RegisterDto): Promise<AuthResponse> {
        return this.authService.register(dto);
    }

    @Post('login')
    @ApiOperation({ summary: 'Login user' })
    async login(@Body() dto: LoginDto): Promise<AuthResponse> {
        return this.authService.login(dto);
    }

    @Get('me')
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Get current user' })
    async getMe(@Request() req: AuthenticatedRequest): Promise<UserWithoutPassword> {
        return this.authService.getUserById(req.user.id);
    }

    @Put('profile')
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Update current user profile' })
    async updateProfile(
        @Request() req: AuthenticatedRequest,
        @Body() dto: UpdateProfileDto,
    ): Promise<UserWithoutPassword> {
        return this.authService.updateProfile(req.user.id, dto);
    }

    @Put('change-password')
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Change user password' })
    async changePassword(
        @Request() req: AuthenticatedRequest,
        @Body() dto: ChangePasswordDto,
    ): Promise<MessageResponse> {
        return this.authService.changePassword(req.user.id, dto);
    }

    @Delete('profile')
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Delete user account' })
    async deleteProfile(@Request() req: AuthenticatedRequest): Promise<MessageResponse> {
        return this.authService.deleteUser(req.user.id);
    }
}
