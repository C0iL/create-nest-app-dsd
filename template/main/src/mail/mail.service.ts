import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';
import { ConfirmationEmail, EmailType, RecoveryEmail } from 'src/shared/constants';

@Injectable()
export class MailService {
	constructor(private mailerService: MailerService) {}

	async sendUserConfirmation(email: string, context: { [name: string]: any }, type: EmailType) {
		await this.mailerService.sendMail({
			to: email,
			subject: context.subject,
			template: './confirmation',
			context,
		});
		return;
	}
}
