import { type MailConfig, mailConfig } from "@config/mail.config";
import { Inject, Injectable, Logger } from "@nestjs/common";
import { type Transporter, createTransport } from "nodemailer";

@Injectable()
export class MailService {
	private readonly logger = new Logger(MailService.name);
	private readonly transporter: Transporter;

	constructor(
		@Inject(mailConfig.KEY)
		private readonly mailConf: MailConfig,
	) {
		this.transporter = createTransport({
			host: this.mailConf.host,
			port: this.mailConf.port,
			secure: this.mailConf.secure,
			auth: {
				user: this.mailConf.user,
				pass: this.mailConf.pass,
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
