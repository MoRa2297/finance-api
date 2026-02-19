import { Controller, Post, Get, Put, Delete, Body, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { RegisterDto, LoginDto, UpdateProfileDto, ChangePasswordDto } from './dto';
import { AuthResponse, UserWithoutPassword, MessageResponse } from './types';
import { CurrentUser, CurrentUserPayload, JwtAuthGuard } from '../common';

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
    async getMe(@CurrentUser() user: CurrentUserPayload): Promise<UserWithoutPassword> {
        return this.authService.getMe(user.id);
    }

    @Put('profile')
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Update current user profile' })
    async updateProfile(
        @CurrentUser() user: CurrentUserPayload,
        @Body() dto: UpdateProfileDto,
    ): Promise<UserWithoutPassword> {
        return this.authService.updateProfile(user.id, dto);
    }

    @Put('change-password')
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Change user password' })
    async changePassword(
        @CurrentUser() user: CurrentUserPayload,
        @Body() dto: ChangePasswordDto,
    ): Promise<MessageResponse> {
        return this.authService.changePassword(user.id, dto);
    }

    @Delete('profile')
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Delete current user account' })
    async deleteAccount(@CurrentUser() user: CurrentUserPayload): Promise<MessageResponse> {
        return this.authService.deleteAccount(user.id);
    }
}
