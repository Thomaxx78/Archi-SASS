import { type DefaultSession, type NextAuthConfig } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import bcryptjs from 'bcryptjs';
import { db } from '~/server/db';

declare module 'next-auth' {
	interface Session extends DefaultSession {
		user: {
			id: string;
		} & DefaultSession['user'];
	}
}

export const authConfig = {
	secret: process.env.AUTH_SECRET,
	session: {
		strategy: "jwt",
	},
	providers: [
		CredentialsProvider({
			name: 'credentials',
			credentials: {
				email: { label: 'Email', type: 'email' },
				password: { label: 'Password', type: 'password' },
			},
			async authorize(credentials) {
				if (!credentials?.email || !credentials?.password) {
					return null;
				}

				const user = await db.user.findUnique({
					where: { email: credentials.email as string },
				});

				if (!user || !user.password) {
					return null;
				}

				const isValidPassword = await bcryptjs.compare(credentials.password as string, user.password);

				if (!isValidPassword) {
					return null;
				}

				if (!user.emailVerified) {
					throw new Error('UNVERIFIED_EMAIL');
				}

				return {
					id: user.id,
					email: user.email,
					name: user.name,
				};
			},
		}),
	],
	callbacks: {
		async signIn({ user }) {
			if (user.id) {
				const dbUser = await db.user.findUnique({
					where: { id: user.id },
				});
				return !!dbUser?.emailVerified;
			}
			return true;
		},
		async jwt({ token, user }) {
			if (user) {
				token.id = user.id;
			}
			return token;
		},
		async session({ session, token }) {
			return {
				...session,
				user: {
					...session.user,
					id: token.id as string,
				},
			};
		},
	},
	pages: {
        signIn: '/login',
        newUser: '/register',
		error: '/auth/error',
	},
} satisfies NextAuthConfig;
