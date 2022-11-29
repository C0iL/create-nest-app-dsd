import { ApiProperty, PartialType } from '@nestjs/swagger';
import {
	IsAlphanumeric,
	IsBoolean,
	IsEmail,
	IsNotEmpty,
	IsString,
	MinLength,
	NotContains,
} from 'class-validator';
import { ErrorMsg } from 'src/shared/constants';

export class CreateUserDto {
	@IsAlphanumeric('en-US', { message: ErrorMsg.INVALID_CHARACTER })
	@IsNotEmpty({ message: ErrorMsg.EMPTY_USERNAME })
	@MinLength(2, { message: ErrorMsg.USERNAME_TOO_SHORT })
	@NotContains(' ', { message: ErrorMsg.USERNAME_HAS_SPACE })
	public username: string;

	@ApiProperty({ example: 'email@test.mn', description: 'Email address' })
	@IsEmail({}, { message: ErrorMsg.INVALID_EMAIL })
	@IsNotEmpty({ message: ErrorMsg.EMPTY_EMAIL })
	public email: string;

	@ApiProperty({
		example: 'Password with more than 8 characters',
		description: 'Password',
	})
	@IsString()
	@MinLength(8, { message: ErrorMsg.PASSWORD_TOO_SHORT })
	@IsNotEmpty({ message: ErrorMsg.EMPTY_PASSWORD })
	public password: string;

	@ApiProperty({
		example: 'Password with more than 8 characters',
		description: 'Re-entered password',
	})
	@IsString()
	@MinLength(8, { message: 'password_match_too_short' })
	public passwordMatch: string;

	@IsBoolean()
	public acceptTerms: boolean;
}

export class ResetPasswordDto {
	@ApiProperty({ example: 'email@test.mn', description: 'Email address' })
	@IsEmail({}, { message: ErrorMsg.INVALID_EMAIL })
	@IsNotEmpty({ message: ErrorMsg.EMPTY_EMAIL })
	public email: string;
}

export class ResendEmailDto extends PartialType(ResetPasswordDto) {}

export class ConfirmPasswordDto {
	@ApiProperty({ description: 'JWT token to confirm' })
	@IsNotEmpty({ message: ErrorMsg.EMPTY_TOKEN })
	public token: string;

	@ApiProperty({
		example: 'Password with more than 8 characters',
		description: 'Password',
	})
	@IsString()
	@MinLength(8, { message: 'password_too_short' })
	@IsNotEmpty({ message: ErrorMsg.EMPTY_PASSWORD })
	public password: string;

	@ApiProperty({
		example: 'Password with more than 8 characters',
		description: 'Re-entered password',
	})
	@IsString()
	@MinLength(8, { message: 'password_match_too_short' })
	public passwordMatch: string;
}

export class ConfirmUserDto {
	@ApiProperty({ description: 'JWT token to confirm' })
	@IsNotEmpty({ message: ErrorMsg.EMPTY_TOKEN })
	public token: string;
}

export class UpdateUserDto {}
