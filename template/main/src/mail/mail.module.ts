import { MailerModule } from '@nestjs-modules/mailer';
import { Module } from '@nestjs/common';
import { MailerConfigService } from 'src/core/mailer.service';
import { MailService } from './mail.service';

@Module({
	imports: [MailerModule.forRootAsync({ useClass: MailerConfigService })],
	providers: [MailService],
	exports: [MailService],
})
export class MailModule {}
