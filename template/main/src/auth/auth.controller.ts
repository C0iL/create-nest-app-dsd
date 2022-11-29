import {
	Body,
	ClassSerializerInterceptor,
	Controller,
	Post,
	Req,
	UseGuards,
	UseInterceptors,
} from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { Request } from 'express';
import {
	ConfirmPasswordDto,
	ConfirmUserDto,
	CreateUserDto,
	ResendEmailDto,
	ResetPasswordDto,
} from 'src/api/user/user.dto';
import { AuthService } from './auth.service';
import { LocalAuthGuard } from './guards/local.guard';

@ApiTags('Authentication')
@Controller('auth')
export class AuthController {
	constructor(private readonly service: AuthService) {}

	@ApiOperation({ summary: 'User login' })
	@UseGuards(LocalAuthGuard)
	@Post('login')
	async login(@Req() req: Request) {
		return this.service.login(req.user);
	}

	@ApiOperation({ summary: 'User registration' })
	@UseInterceptors(ClassSerializerInterceptor)
	@Post('register')
	register(@Body() body: CreateUserDto) {
		return this.service.register(body);
	}

	@ApiOperation({ summary: 'Resend confirmation email' })
	@UseInterceptors(ClassSerializerInterceptor)
	@Post('register/resend-email')
	resendEmail(@Body() body: ResendEmailDto) {
		return this.service.resendEmail(body);
	}

	@ApiOperation({ summary: 'Confirm user registration' })
	@UseInterceptors(ClassSerializerInterceptor)
	@Post('register/confirm')
	confirm(@Body() body: ConfirmUserDto) {
		return this.service.confirmUserRegistration(body);
	}

	@ApiOperation({ summary: 'Reset password' })
	@Post('reset-password')
	resetPassword(@Body() body: ResetPasswordDto) {
		return this.service.resetPassword(body);
	}

	@ApiOperation({ summary: 'Reset password' })
	@Post('reset-password/confirm')
	confirmPassword(@Body() body: ConfirmPasswordDto) {
		return this.service.confirmPassword(body);
	}
}
