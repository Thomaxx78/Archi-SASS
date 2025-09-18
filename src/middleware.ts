import { auth } from '~/server/auth';

export default auth((req) => {
	const { pathname } = req.nextUrl;

	const publicRoutes = ['/', '/login', '/register', '/verify-email', '/check-email', '/forgot-password', '/reset-password', '/api/auth', '/api/trpc', '/_next', '/favicon.ico'];

	const isPublicRoute = publicRoutes.some((route) => {
		if (route === '/') {
			return pathname === '/';
		}
		return pathname.startsWith(route);
	});

	if (!req.auth && !isPublicRoute) {
		const loginUrl = new URL('/login', req.nextUrl.origin);
		loginUrl.searchParams.set('callbackUrl', req.nextUrl.href);
		return Response.redirect(loginUrl);
	}

	if (req.auth && (pathname === '/login' || pathname === '/register')) {
		return Response.redirect(new URL('/', req.nextUrl.origin));
	}

	return;
});

export const config = {
	matcher: [
		/*
		 * Match all request paths except for the ones starting with:
		 * - api (API routes)
		 * - _next/static (static files)
		 * - _next/image (image optimization files)
		 * - favicon.ico (favicon file)
		 * - public (public files)
		 */
		'/((?!api|_next/static|_next/image|favicon.ico|public).*)',
	],
};
