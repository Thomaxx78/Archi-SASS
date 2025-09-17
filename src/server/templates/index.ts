// templates/index.ts - Mise à jour
export { getWelcomeTemplate, type WelcomeTemplateData } from './welcome';
export { getInvitationTemplate, type InvitationTemplateData } from './invitation';
export { getLoginTemplate, type LoginTemplateData } from './login';

// config.ts - Configuration finale
import { PrismaAdapter } from '@auth/prisma-adapter';
import { type DefaultSession, type NextAuthConfig } from 'next-auth';
import EmailProvider from 'next-auth/providers/nodemailer';
import { mailService } from '~/server/services/mail';
import { getLoginTemplate } from '~/server/templates/login';

import { db } from '~/server/db';

declare module 'next-auth' {
	interface Session extends DefaultSession {
		user: {
			id: string;
		} & DefaultSession['user'];
	}
}

export const authConfig = {
	providers: [
		EmailProvider({
			server: {
				host: process.env.EMAIL_SERVER_HOST,
				port: Number(process.env.EMAIL_SERVER_PORT),
				auth: process.env.EMAIL_USER && process.env.EMAIL_PASS ? {
					user: process.env.EMAIL_USER,
					pass: process.env.EMAIL_PASS,
				} : undefined,
			},
			from: process.env.EMAIL_FROM || 'noreply@localhost',
			// Utilisation du template personnalisé
			sendVerificationRequest: async ({ identifier: email, url }) => {
				try {
					const template = getLoginTemplate({
						email,
						appName: process.env.APP_NAME || 'Mon Application',
						loginUrl: url,
					});

					await mailService.sendMail({
						to: email,
						template,
					});

					console.log(`✅ Email de connexion envoyé avec template personnalisé à: ${email}`);
				} catch (error) {
					console.error('❌ Erreur lors de l\'envoi de l\'email personnalisé:', error);
					throw error;
				}
			},
		}),
	],
	adapter: PrismaAdapter(db),
	callbacks: {
		session: ({ session, user }) => ({
			...session,
			user: {
				...session.user,
				id: user.id,
			},
		}),
	},
	// Optionnel : personnaliser les pages
	pages: {
		verifyRequest: '/auth/verify-request', // Page après envoi d'email
		error: '/auth/error', // Page d'erreur
	},
} satisfies NextAuthConfig;