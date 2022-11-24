import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/api/user/user.entity';
import { UserModule } from 'src/api/user/user.module';
import { MailModule } from 'src/mail/mail.module';
import { AuthController } from './auth.controller';
import { AuthHelper } from './auth.helper';
import { AuthService } from './auth.service';
import { JwtStrategy } from './strategies/jwt.strategy';
import { LocalStrategy } from './strategies/local.strategy';

@Module({
	controllers: [AuthController],
	providers: [AuthService, AuthHelper, LocalStrategy, JwtStrategy],
	imports: [
		MailModule,
		PassportModule,
		JwtModule.registerAsync({
			imports: [ConfigModule],
			inject: [ConfigService],
			useFactory: (config: ConfigService) => ({
				secret: config.get<string>('JWT_SECRET'),
				signOptions: { expiresIn: config.get<string>('JWT_EXPIRE') },
			}),
		}),
		TypeOrmModule.forFeature([User]),
		UserModule,
	],
})
export class AuthModule {}
