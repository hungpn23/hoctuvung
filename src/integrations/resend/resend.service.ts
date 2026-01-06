import { type MailConfig, mailConfig } from "@config/mail.config";
import { Inject, Injectable, Logger } from "@nestjs/common";
import { Resend } from "resend";

@Injectable()
export class ResendService {
	private readonly logger = new Logger(ResendService.name);
	private readonly resend;

	constructor(
		@Inject(mailConfig.KEY)
		private readonly mailConf: MailConfig,
	) {
		this.resend = new Resend(this.mailConf.resendApiKey);
	}

	async sendEmail() {
		const { data, error } = await this.resend.emails.send({
			from: this.mailConf.from,
			to: ["hungpn23@gmail.com"],
			subject: "Hello from NestJS Processor!",
			html: "<strong>It works!</strong>",
		});

		if (error) return this.logger.error({ error });

		this.logger.debug({ data });
	}
}
