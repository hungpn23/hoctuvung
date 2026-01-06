import { type MailConfig, mailConfig } from "@config/mail.config";
import { Inject, Injectable, Logger } from "@nestjs/common";
import { createTransport, Transporter } from "nodemailer";

@Injectable()
export class MailService {
	private readonly logger = new Logger(MailService.name);
	private readonly transporter: Transporter;

	constructor(
		@Inject(mailConfig.KEY)
		readonly mailConf: MailConfig,
	) {
		const { host, port, secure, user, pass } = mailConf;

		this.transporter = createTransport({
			host,
			port,
			secure,
			auth: { user, pass },
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
