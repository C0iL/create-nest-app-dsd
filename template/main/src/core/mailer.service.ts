import { MailerOptions, MailerOptionsFactory } from '@nestjs-modules/mailer';
import { Inject, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { join } from 'path';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';

@Injectable()
export class MailerConfigService implements MailerOptionsFactory {
	@Inject(ConfigService)
	private readonly config: ConfigService;

	public createMailerOptions(): MailerOptions | Promise<MailerOptions> {
		return {
			transport: {
				host: this.config.get<string>('EMAIL_HOST'),
				port: this.config.get<number>('EMAIL_PORT'),
				secure: false,
				tls: {
					rejectUnauthorized: false,
					ciphers: 'SSLv3',
					secureProtocol: 'TLSv1_method',
				},
				connectionTimeout: 10000,
			},
			defaults: {
				from: this.config.get<string>('EMAIL_SENDER_ADDRESS'),
			},
			template: {
				dir: join(__dirname + '/../mail', 'templates'),
				adapter: new HandlebarsAdapter(),
				options: { strict: true },
			},
		};
	}
}
