import { ForbiddenException, Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Request } from 'express';
import { Strategy } from 'passport-local';
import { AuthService } from '../auth.service';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
	constructor(private service: AuthService) {
		super({ usernameField: 'email', passReqToCallback: true });
	}

	async validate(req: Request, email: string, password: string): Promise<any> {
		const isAdmin = req?.body?.admin;

		const user = await this.service.validateUser(email, password);
		if (!user) {
			throw new UnauthorizedException('invalid_credentials');
		}
		if (!user.isActive) throw new UnauthorizedException('user_inactive');
		if (isAdmin && !user.isAdmin) throw new ForbiddenException('forbidden');
		return user;
	}
}
