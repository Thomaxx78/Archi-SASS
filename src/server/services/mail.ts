import nodemailer from 'nodemailer';
import { env } from '~/env';

export interface MailTemplate {
	subject: string;
	html: string;
	text?: string;
}

export interface SendMailOptions {
	to: string | string[];
	template: MailTemplate;
	cc?: string | string[];
	bcc?: string | string[];
}

class MailService {
	private transporter: nodemailer.Transporter;

	constructor() {
		this.transporter = nodemailer.createTransport({
			host: env.EMAIL_SERVER_HOST,
			port: parseInt(env.EMAIL_SERVER_PORT),
			secure: false,
			auth:
				process.env.EMAIL_USER && process.env.EMAIL_PASS
					? {
							user: process.env.EMAIL_USER,
							pass: process.env.EMAIL_PASS,
						}
					: undefined,
			tls: {
				rejectUnauthorized: false,
			},
		});
	}

	async sendMail(options: SendMailOptions): Promise<void> {
		const mailOptions = {
			from: process.env.EMAIL_FROM || 'noreply@localhost',
			to: Array.isArray(options.to) ? options.to.join(', ') : options.to,
			cc: options.cc ? (Array.isArray(options.cc) ? options.cc.join(', ') : options.cc) : undefined,
			bcc: options.bcc ? (Array.isArray(options.bcc) ? options.bcc.join(', ') : options.bcc) : undefined,
			subject: options.template.subject,
			html: options.template.html,
			text: options.template.text,
		};

		try {
			const info = await this.transporter.sendMail(mailOptions);
			console.log('✅ Email sent successfully to:', options.to);
			console.log('📧 Message ID:', info.messageId);
			return info;
		} catch (error) {
			console.error('❌ Error sending email:', error);
			throw new Error(`Failed to send email: ${error instanceof Error ? error.message : 'Unknown error'}`);
		}
	}

	async verifyConnection(): Promise<boolean> {
		try {
			await this.transporter.verify();
			console.log('✅ SMTP connection verified successfully');
			return true;
		} catch (error) {
			console.error('❌ SMTP connection failed:', error);
			return false;
		}
	}

	getTransporterOptions() {
		return {
			host: env.EMAIL_SERVER_HOST,
			port: parseInt(env.EMAIL_SERVER_PORT),
			secure: parseInt(env.EMAIL_SERVER_PORT) === 465,
			auth:
				process.env.EMAIL_USER && process.env.EMAIL_PASS
					? {
							user: process.env.EMAIL_USER,
							pass: process.env.EMAIL_PASS ? '***' : undefined, // Masquer le mot de passe
						}
					: undefined,
		};
	}
}

export const mailService = new MailService();
