import { createCallerFactory, createTRPCRouter } from '~/server/api/trpc';
import { eventRouter } from './routers/event';
import { invitationRouter } from './routers/invitation';
import { userRouter } from './routers/user';
import { authRouter } from './routers/auth';
import { subscriptionRouter } from './routers/subscription';
import { notificationRouter } from './routers/notification';
/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
	auth: authRouter,
	event: eventRouter,
	invitation: invitationRouter,
	user: userRouter,
	subscription: subscriptionRouter,
	notification: notificationRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;

/**
 * Create a server-side caller for the tRPC API.
 * @example
 * const trpc = createCaller(createContext);
 * const res = await trpc.post.all();
 *       ^? Post[]
 */
export const createCaller = createCallerFactory(appRouter);
