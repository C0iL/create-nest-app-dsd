import { ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthGuard, IAuthGuard } from '@nestjs/passport';
import { Request } from 'express';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') implements IAuthGuard {
	public async canActivate(context: ExecutionContext): Promise<boolean> {
		await super.canActivate(context);

		const req: Request = context.switchToHttp().getRequest();

		if (req.authInfo) {
			const error: any = req.authInfo;
			throw new UnauthorizedException({ message: [error.message] });
		}
		return !!req.user;
	}
}
