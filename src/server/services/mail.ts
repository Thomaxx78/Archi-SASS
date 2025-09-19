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
	private transporter: nodemailer.Transporter | null = null;

	constructor() {
		this.initializeTransporter();
	}

	private async initializeTransporter() {
		try {
			if (typeof window === 'undefined' && typeof process !== 'undefined') {
				this.transporter = nodemailer.createTransport({
					host: env.EMAIL_SERVER_HOST,
					port: parseInt(env.EMAIL_SERVER_PORT),
					secure: false,
					auth: env.EMAIL_USER && env.EMAIL_PASS ? {
						user: env.EMAIL_USER,
						pass: env.EMAIL_PASS,
					} : undefined,
					tls: {
						rejectUnauthorized: false
					}
				});
			}
		} catch (error) {
			console.log('📧 Nodemailer not available, will use fallback');
		}
	}

	async sendMail(options: SendMailOptions): Promise<void> {
		if (!this.transporter) {
			await this.initializeTransporter();
		}

		if (!this.transporter) {
			console.log('📧 =============== EMAIL TO SEND (FALLBACK) ===============');
			console.log('📧 To:', options.to);
			console.log('📧 Subject:', options.template.subject);
			console.log('📧 HTML Preview:', options.template.html.substring(0, 200) + '...');
			console.log('📧 =========================================================');
			return;
		}

		const mailOptions = {
			from: env.EMAIL_FROM || env.EMAIL_USER || 'noreply@localhost',
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
		if (!this.transporter) {
			await this.initializeTransporter();
		}

		if (!this.transporter) {
			console.warn('⚠️ Email transporter not initialized');
			return false;
		}

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
			port: parseInt(env.EMAIL_SERVER_PORT || '587'),
			secure: parseInt(env.EMAIL_SERVER_PORT || '587') === 465,
			user: env.EMAIL_USER || 'not-configured',
			hasPassword: !!env.EMAIL_PASS,
			auth: env.EMAIL_USER && env.EMAIL_PASS ? {
				user: env.EMAIL_USER,
				pass: env.EMAIL_PASS ? '***' : undefined, // Masquer le mot de passe
			} : undefined,
		};
	}
}

export const mailService = new MailService();