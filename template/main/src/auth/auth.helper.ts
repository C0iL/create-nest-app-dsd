import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcryptjs';
import * as passwordValidator from 'password-validator';
import { User } from 'src/api/user/user.entity';
import { ErrorMsg } from 'src/shared/constants';
import { Repository } from 'typeorm';

@Injectable()
export class AuthHelper {
	@InjectRepository(User)
	private readonly repo: Repository<User>;
	@Inject(ConfigService)
	private readonly config: ConfigService;

	private readonly jwt: JwtService;

	constructor(jwt: JwtService) {
		this.jwt = jwt;
	}

	public async decode(token: string): Promise<unknown> {
		return this.jwt.decode(token);
	}

	public async validateUser(decoded: any): Promise<User> {
		const user = await this.repo.findOneBy({ id: decoded.sub });
		if (!user.isActive) return null;

		if (decoded.roles) user.roles = decoded.roles;

		return user;
	}

	public generateToken(user: User): string {
		const options = {
			sub: user.id,
			roles: ['user'],
		};
		return this.jwt.sign(options);
	}

	public generateEmailToken(email: string, expiresIn: string): string {
		return this.jwt.sign({ email }, { secret: this.config.get('EMAIL_JWT_SECRET'), expiresIn });
	}

	public decodeEmailToken(token: string): string {
		try {
			const payload = this.jwt.verify(token, { secret: this.config.get('EMAIL_JWT_SECRET') });
			if (typeof payload === 'object' && 'email' in payload) {
				return payload.email;
			}
			throw new BadRequestException(ErrorMsg.INVALID_TOKEN);
		} catch (error) {
			if (error?.name === 'TokenExpiredError') {
				throw new BadRequestException(ErrorMsg.TOKEN_EXPIRED);
			}
			throw new BadRequestException(ErrorMsg.INVALID_TOKEN);
		}
	}

	public isPasswordValid(password: string, userPassword: string): boolean {
		return bcrypt.compareSync(password, userPassword);
	}

	public encodePassword(password: string): string {
		const salt: string = bcrypt.genSaltSync(10);

		return bcrypt.hashSync(password, salt);
	}

	public isStrongPassword(password: string): any[] {
		const schema = new passwordValidator();
		schema
			.is()
			.min(8, ErrorMsg.PASSWORD_TOO_SHORT)
			.is()
			.max(20, ErrorMsg.PASSWORD_TOO_SHORT)
			.has()
			.uppercase(1, ErrorMsg.PASSWORD_UPPERCASE)
			.has()
			.lowercase(1, ErrorMsg.PASSWORD_LOWERCASE)
			.has()
			.digits(1, ErrorMsg.PASSWORD_DIGITS)
			.has()
			.symbols(1, ErrorMsg.PASSWORD_SYMBOLS);
		const result: any = schema.validate(password, { details: true });

		return result.map((val) => val.message);
	}
}
