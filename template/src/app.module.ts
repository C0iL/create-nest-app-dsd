import { CacheInterceptor, CacheModule, ClassSerializerInterceptor, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from './api/user/user.module';
import { AuthModule } from './auth/auth.module';
import { ReferenceModule } from './api/reference/reference.module';
import { TypeOrmConfigService } from './core/typeorm.service';
import { MailModule } from './mail/mail.module';

@Module({
	imports: [
		ConfigModule.forRoot({
			isGlobal: true,
			envFilePath: `.${process.env.NODE_ENV}.env`,
		}),
		TypeOrmModule.forRootAsync({ useClass: TypeOrmConfigService }),
		AuthModule,
		UserModule,
		MailModule,
		ReferenceModule,
		CacheModule.register({ isGlobal: true }),
	],
	providers: [
		{ provide: APP_INTERCEPTOR, useClass: ClassSerializerInterceptor },
		{
			provide: APP_INTERCEPTOR,
			useClass: CacheInterceptor,
		},
	],
})
export class AppModule {}
