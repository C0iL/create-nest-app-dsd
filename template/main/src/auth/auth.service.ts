import {
	BadRequestException,
	HttpException,
	HttpStatus,
	Inject,
	Injectable,
	Logger,
	NotFoundException,
	UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
	ConfirmPasswordDto,
	ConfirmUserDto,
	CreateUserDto,
	ResendEmailDto,
	ResetPasswordDto,
} from 'src/api/user/user.dto';
import { User } from 'src/api/user/user.entity';
import { UserService } from 'src/api/user/user.service';
import { MailService } from 'src/mail/mail.service';
import { ConfirmationEmail, EmailType, ErrorMsg, RecoveryEmail } from 'src/shared/constants';
import { AuthHelper } from './auth.helper';

@Injectable()
export class AuthService {
	@Inject(UserService)
	private userService: UserService;
	@Inject(MailService)
	private mailService: MailService;
	@Inject(ConfigService)
	private configService: ConfigService;

	@Inject(AuthHelper)
	private readonly helper: AuthHelper;

	private readonly logger = new Logger(AuthService.name);

	async validateUser(email: string, password: string): Promise<any> {
		const user = await this.userService.findByUsername(email?.toLowerCase());

		if (user && this.helper.isPasswordValid(password, user.password)) {
			if (!user.isEmailConfirmed)
				throw new UnauthorizedException(ErrorMsg.EMAIL_NOT_CONFIRMED);
			const { password, ...result } = user;
			return result;
		}
		return null;
	}

	async login(user: any) {
		const token = this.helper.generateToken(user);
		return {
			access_token: token,
		};
	}

	async register(body: CreateUserDto) {
		const { email, username, password, passwordMatch, acceptTerms }: CreateUserDto = body;

		if (!acceptTerms) throw new BadRequestException(ErrorMsg.TERMS_NOT_ACCEPTED);
		this.validatePassword(password, passwordMatch);

		const existing: User = await this.userService.findConflictUser(email, username);
		if (existing) throw new HttpException(ErrorMsg.CONFLICT_USER, HttpStatus.CONFLICT);

		const user = new User();

		//May add an option to login/register via username later
		user.username = username;
		user.email = email.toLowerCase();
		user.password = this.helper.encodePassword(password);
		await this.userService.upsertUser(user);

		const token = this.helper.generateEmailToken(user.email, '1d');
		const emailContext = this.emailContextBuilder(username, token, EmailType.CONFIRMATION);

		try {
			await this.mailService.sendUserConfirmation(
				user.email,
				emailContext,
				EmailType.CONFIRMATION
			);
		} catch (error) {
			this.logger.error(`Error while sending an email to ${user.email}`);
			this.logger.error(`Error code => ${error.code}`);
			this.logger.error(`Error message => ${error.message}`);
		}
	}

	public async resendEmail(dto: ResendEmailDto) {
		const { email } = dto;
		const user = await this.userService.findByUsername(email.toLowerCase());
		if (!user) throw new NotFoundException(ErrorMsg.NOT_FOUND_USER);
		if (user.isEmailConfirmed) throw new BadRequestException(ErrorMsg.EMAIL_ALREADY_CONFIRMED);

		const token = this.helper.generateEmailToken(user.email, '1d');
		const emailContext = this.emailContextBuilder(user.username, token, EmailType.CONFIRMATION);
		return this.mailService.sendUserConfirmation(
			user.email,
			emailContext,
			EmailType.CONFIRMATION
		);
	}

	public async resetPassword(dto: ResetPasswordDto) {
		const { email } = dto;
		const user = await this.userService.findByUsername(email.toLowerCase());
		if (!user) throw new NotFoundException(ErrorMsg.NOT_FOUND_USER);

		const token = this.helper.generateEmailToken(email, '1h');
		const emailContext = this.emailContextBuilder(user.username, token, EmailType.RECOVERY);
		return this.mailService.sendUserConfirmation(email, emailContext, EmailType.RECOVERY);
	}

	public async confirmPassword(dto: ConfirmPasswordDto) {
		const email = this.helper.decodeEmailToken(dto.token);
		const user = await this.userService.findByUsername(email.toLowerCase());
		if (!user) throw new NotFoundException(ErrorMsg.NOT_FOUND_USER);

		const { password, passwordMatch } = dto;
		this.validatePassword(password, passwordMatch);

		user.password = this.helper.encodePassword(password);
		await this.userService.upsertUser(user);
	}

	public async confirmUserRegistration(dto: ConfirmUserDto) {
		const email = this.helper.decodeEmailToken(dto.token);
		const user = await this.userService.findByUsername(email.toLowerCase());
		if (!user) throw new NotFoundException(ErrorMsg.NOT_FOUND_USER);
		if (user.isEmailConfirmed) throw new BadRequestException(ErrorMsg.EMAIL_ALREADY_CONFIRMED);

		await this.userService.confirmUserEmail(user);
	}

	private validatePassword(password: string, passwordMatch: string) {
		const validation = this.helper.isStrongPassword(password);
		if (validation.length > 0) throw new BadRequestException(validation);
		if (password !== passwordMatch) throw new BadRequestException(ErrorMsg.PASSWORD_MISMATCH);
	}

	private emailContextBuilder(username: string, token: string, type: EmailType) {
		let header: string,
			text: string,
			subject: string,
			path: string = '';
		let footer: string;

		if (type === EmailType.CONFIRMATION) {
			subject = ConfirmationEmail.SUBJECT;
			header = ConfirmationEmail.HEADER;
			text = ConfirmationEmail.URL_TEXT;
			path = ConfirmationEmail.URL;
		}

		if (type === EmailType.RECOVERY) {
			subject = RecoveryEmail.SUBJECT;
			header = RecoveryEmail.HEADER;
			text = RecoveryEmail.URL_TEXT;
			path = RecoveryEmail.URL;
			footer = RecoveryEmail.FOOTER;
		}
		return {
			username,
			subject,
			header,
			url: {
				path: `${this.configService.get('EMAIL_LINK')}${path}?token=${token}`,
				text,
			},
			footer,
		};
	}
}
