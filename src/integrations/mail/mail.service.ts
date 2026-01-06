import { type MailConfig, mailConfig } from "@config/mail.config";
import { Inject, Injectable, Logger } from "@nestjs/common";
import { Transporter, createTransport } from "nodemailer";

@Injectable()
export class MailService {
	private readonly logger = new Logger(MailService.name);
	private readonly transporter: Transporter;

	constructor(
		@Inject(mailConfig.KEY)
		private readonly mailConfig: MailConfig,
	) {
		this.transporter = createTransport({
			host: this.mailConfig.host,
			port: this.mailConfig.port,
			secure: this.mailConfig.secure,
			auth: {
				user: this.mailConfig.user,
				pass: this.mailConfig.pass,
			},
		});

		this.transporter.verify((error) => {
			if (error) {
				this.logger.error("Error connecting to mail server:", error.message);
			} else {
				this.logger.debug("Mail server connection established");
			}
		});
	}
}
