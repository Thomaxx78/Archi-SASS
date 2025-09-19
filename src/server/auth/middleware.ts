import NextAuth from 'next-auth';
import { middlewareAuthConfig } from './middleware-config';

export const { auth } = NextAuth(middlewareAuthConfig);