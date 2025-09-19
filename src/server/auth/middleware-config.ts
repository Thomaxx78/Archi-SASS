import { type NextAuthConfig } from 'next-auth';
import { env } from '~/env';

export const middlewareAuthConfig = {
	secret: env.AUTH_SECRET,
	session: {
		strategy: 'jwt',
	},
	providers: [],
	callbacks: {
		authorized: ({ token }) => !!token,
	},
} satisfies NextAuthConfig;