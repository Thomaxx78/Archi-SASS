import { type DefaultSession, type NextAuthConfig } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import GoogleProvider from 'next-auth/providers/google';
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
		GoogleProvider({
			clientId: process.env.GOOGLE_CLIENT_ID!,
			clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
		}),
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
		async signIn({ user, account }) {
			if (!account) return false;

			// For OAuth providers (Google), auto-verify email
			if (account.provider === 'google') {
				if (!user.email) return false;

				// Check if user already exists
				const existingUser = await db.user.findUnique({
					where: { email: user.email },
				});

				if (existingUser) {
					// Update existing user to mark as email verified if needed
					if (!existingUser.emailVerified) {
						await db.user.update({
							where: { id: existingUser.id },
							data: {
								emailVerified: new Date(),
								name: user.name || existingUser.name,
								image: user.image || existingUser.image,
							},
						});
					}
				} else {
					// Create new user with verified email
					await db.user.create({
						data: {
							email: user.email,
							name: user.name,
							image: user.image,
							emailVerified: new Date(),
						},
					});
				}
				return true;
			}

			// For credentials provider, check email verification
			if (account.provider === 'credentials') {
				if (user.id) {
					const dbUser = await db.user.findUnique({
						where: { id: user.id },
					});
					return !!dbUser?.emailVerified;
				}
			}

			return true;
		},
		async jwt({ token, user, account }) {
			if (user) {
				// For new sign-ins, get the database user ID
				if (account?.provider === 'google') {
					const dbUser = await db.user.findUnique({
						where: { email: user.email! },
					});
					token.id = dbUser?.id;
				} else {
					token.id = user.id;
				}
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
		async redirect({ url, baseUrl }) {
			// Redirect to home page after successful authentication
			if (url.startsWith("/api/auth")) {
				return baseUrl;
			}
			// Allows relative callback URLs
			if (url.startsWith("/")) return `${baseUrl}${url}`;
			// Allows callback URLs on the same origin
			if (new URL(url).origin === baseUrl) return url;
			return baseUrl;
		},
	},
	pages: {
        signIn: '/login',
        newUser: '/register',
		error: '/auth/error',
	},
} satisfies NextAuthConfig;
