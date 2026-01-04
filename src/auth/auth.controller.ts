import {Controller, Post, Get, Body, UseGuards, Request, Put} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import {ChangePasswordDto, LoginDto, RegisterDto, UpdateDto} from './dto';
import { JwtAuthGuard } from './guards';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService) {}

    @Post('register')
    @ApiOperation({ summary: 'Register a new user' })
    async register(@Body() dto: RegisterDto) {
        return this.authService.register(dto);
    }

    @Post('login')
    @ApiOperation({ summary: 'Login user' })
    async login(@Body() dto: LoginDto) {
        return this.authService.login(dto);
    }

    @Get('me')
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Get current user' })
    async getMe(@Request() req: { user: { id: number } }) {
        return this.authService.getUserById(req.user.id);
    }

    @Put('profile')
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Update current user profile' })
    async updateProfile(
        @Request() req: { user: { id: number } },
        @Body() dto: UpdateDto,
    ) {
        return this.authService.updateProfile(req.user.id, dto);
    }

    @Put('change-password')
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Change current user password' })
    async changePassword(
        @Request() req: { user: { id: number } },
        @Body() dto: ChangePasswordDto,
    ) {
        return this.authService.changePassword(req.user.id, dto);
    }

}
