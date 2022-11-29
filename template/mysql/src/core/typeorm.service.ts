import { Inject, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { TypeOrmModuleOptions, TypeOrmOptionsFactory } from '@nestjs/typeorm';
import { LoggerOptions } from 'typeorm';

@Injectable()
export class TypeOrmConfigService implements TypeOrmOptionsFactory {
	@Inject(ConfigService)
	private readonly config: ConfigService;

	private readonly logging: LoggerOptions = ['prod', 'preprod'].includes(process.env.NODE_ENV)
		? ['error', 'warn']
		: ['query'];

	public createTypeOrmOptions(): TypeOrmModuleOptions {
		return {
			type: 'mysql',
			host: this.config.get<string>('DB_HOST'),
			port: this.config.get<number>('DB_PORT'),
			database: this.config.get<string>('DB_NAME'),
			username: this.config.get<string>('DB_USER'),
			password: this.config.get<string>('DB_PASSWORD'),
			entities: [__dirname + '/../**/*.entity{.ts,.js}'],
			synchronize: false, // this.config.get<boolean>('DB_SYNC'),
			logging: this.logging,
			logger: 'advanced-console',
			maxQueryExecutionTime: 1000,
		};
	}
}
