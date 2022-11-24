import { Inject, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { User } from 'src/api/user/user.entity';
import { AuthHelper } from '../auth.helper';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
	@Inject(AuthHelper)
	private readonly helper: AuthHelper;

	constructor(protected readonly config: ConfigService) {
		super({
			jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
			ignoreExpiration: false,
			secretOrKey: config.get<string>('JWT_SECRET'),
		});
	}

	async validate(payload: string): Promise<User | never> {
		return this.helper.validateUser(payload);
	}
}
