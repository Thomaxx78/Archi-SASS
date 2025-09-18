import { z } from 'zod';
import { createTRPCRouter, protectedProcedure, publicProcedure } from '~/server/api/trpc';
import { TRPCError } from '@trpc/server';
import { StripeService, PLANS } from '~/server/services/stripe';

const createSubscriptionSchema = z.object({
	priceId: z.string(),
	paymentMethodId: z.string().optional(),
	customerId: z.string().optional(),
	userId: z.string().optional(),
});

export const subscriptionRouter = createTRPCRouter({
	/**
	 * Récupère les plans disponibles
	 */
	getPlans: publicProcedure.query(async () => {
		return Object.values(PLANS);
	}),

	/**
	 * Récupère l'abonnement actuel de l'utilisateur
	 */
	getCurrentSubscription: protectedProcedure.query(async ({ ctx }) => {
		const subscription = await ctx.db.subscription.findUnique({
			where: { userId: ctx.session.user.id },
			include: {
				invoices: {
					orderBy: { createdAt: 'desc' },
					take: 5,
				},
			},
		});

		if (!subscription) {
			return null;
		}

		const planInfo = Object.values(PLANS).find((plan) => plan.priceId === subscription.stripePriceId);

		return {
			...subscription,
			plan: planInfo || PLANS.starter,
		};
	}),

	/**
	 * Crée un abonnement
	 */
	createSubscription: protectedProcedure.input(createSubscriptionSchema).mutation(async ({ ctx, input }) => {
		try {
			const existingSubscription = await ctx.db.subscription.findUnique({
				where: { userId: ctx.session.user.id },
			});

			if (existingSubscription && existingSubscription.status === 'active') {
				throw new TRPCError({
					code: 'BAD_REQUEST',
					message: 'Vous avez déjà un abonnement actif',
				});
			}

			const user = await ctx.db.user.findUnique({
				where: { id: ctx.session.user.id },
			});

			const stripeSubscription = await StripeService.createSubscription({
				priceId: input.priceId,
				customerId: user!.stripeCustomerId!,
			});
			return {
				subscriptionId: stripeSubscription.subscriptionId,
				status: stripeSubscription.status,
				clientSecret: stripeSubscription.clientSecret,
			};
		} catch (error) {
			console.error('Subscription creation failed:', error);

			if (error instanceof TRPCError) {
				throw error;
			}

			throw new TRPCError({
				code: 'INTERNAL_SERVER_ERROR',
				message: "Impossible de créer l'abonnement",
			});
		}
	}),
});
