// config.ts - Version modifiée
import { PrismaAdapter } from '@auth/prisma-adapter';
import { type DefaultSession, type NextAuthConfig } from 'next-auth';
import EmailProvider from 'next-auth/providers/nodemailer';
import { mailService } from '~/server/services/mail';
import { getWelcomeTemplate } from '~/server/templates/welcome';

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
				auth: {
					user: process.env.EMAIL_USER,
					pass: process.env.EMAIL_PASS,
				},
			},
			from: process.env.EMAIL_FROM,
			// Configuration personnalisée pour utiliser vos templates
			sendVerificationRequest: async ({ identifier: email, url, provider, theme }) => {
				try {
					// Utiliser votre template personnalisé
					const template = getWelcomeTemplate({
						userName: email, // Vous pouvez extraire le nom de l'email si nécessaire
						appName: 'Votre App', // Remplacez par le nom de votre app
						loginUrl: url,
					});

					await mailService.sendMail({
						to: email,
						template,
					});

					console.log('Email de connexion envoyé avec template personnalisé à:', email);
				} catch (error) {
					console.error('Erreur lors de l\'envoi de l\'email personnalisé:', error);
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
} satisfies NextAuthConfig;