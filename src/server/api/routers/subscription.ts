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

			if (!user?.stripeCustomerId) {
				throw new TRPCError({
					code: 'BAD_REQUEST',
					message: 'Aucun customer Stripe trouvé',
				});
			}

			const stripeSubscription = await StripeService.createSubscription({
				priceId: input.priceId,
				customerId: user.stripeCustomerId,
			});

			const planInfo = Object.values(PLANS).find((plan) => plan.priceId === input.priceId);

			if (!planInfo) {
				throw new TRPCError({
					code: 'BAD_REQUEST',
					message: 'Plan non trouvé',
				});
			}

			const subscription = await ctx.db.subscription.upsert({
				where: { userId: ctx.session.user.id },
				create: {
					userId: ctx.session.user.id,
					stripeCustomerId: user.stripeCustomerId,
					stripeSubscriptionId: stripeSubscription.subscriptionId,
					stripePriceId: input.priceId,
					stripeProductId: planInfo.productId,
					status: stripeSubscription.status,
					planName: planInfo.name,
					planPrice: planInfo.price,
					planInterval: planInfo.interval,
				},
				update: {
					stripeSubscriptionId: stripeSubscription.subscriptionId,
					stripePriceId: input.priceId,
					stripeProductId: planInfo.productId,
					status: stripeSubscription.status,
					planName: planInfo.name,
					planPrice: planInfo.price,
					planInterval: planInfo.interval,
				},
			});

			return {
				subscriptionId: stripeSubscription.subscriptionId,
				status: stripeSubscription.status,
				clientSecret: stripeSubscription.clientSecret,
				databaseId: subscription.id,
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

	/**
	 * Met à jour un abonnement depuis un webhook Stripe
	 */
	updateSubscriptionFromWebhook: publicProcedure
		.input(
			z.object({
				stripeSubscriptionId: z.string(),
				status: z.string(),
				currentPeriodStart: z.number().optional(),
				currentPeriodEnd: z.number().optional(),
				cancelAt: z.number().optional(),
				canceledAt: z.number().optional(),
				trialStart: z.number().optional(),
				trialEnd: z.number().optional(),
			}),
		)
		.mutation(async ({ ctx, input }) => {
			try {
				const subscription = await ctx.db.subscription.findUnique({
					where: { stripeSubscriptionId: input.stripeSubscriptionId },
				});

				if (!subscription) {
					throw new TRPCError({
						code: 'NOT_FOUND',
						message: 'Abonnement non trouvé',
					});
				}

				const updatedSubscription = await ctx.db.subscription.update({
					where: { stripeSubscriptionId: input.stripeSubscriptionId },
					data: {
						status: input.status,
						currentPeriodStart: input.currentPeriodStart ? new Date(input.currentPeriodStart * 1000) : undefined,
						currentPeriodEnd: input.currentPeriodEnd ? new Date(input.currentPeriodEnd * 1000) : undefined,
						cancelAt: input.cancelAt ? new Date(input.cancelAt * 1000) : undefined,
						canceledAt: input.canceledAt ? new Date(input.canceledAt * 1000) : undefined,
						trialStart: input.trialStart ? new Date(input.trialStart * 1000) : undefined,
						trialEnd: input.trialEnd ? new Date(input.trialEnd * 1000) : undefined,
					},
				});

				return updatedSubscription;
			} catch (error) {
				console.error('Subscription update failed:', error);

				if (error instanceof TRPCError) {
					throw error;
				}

				throw new TRPCError({
					code: 'INTERNAL_SERVER_ERROR',
					message: "Impossible de mettre à jour l'abonnement",
				});
			}
		}),

	/**
	 * Récupère les moyens de paiement de l'utilisateur
	 */
	getPaymentMethods: protectedProcedure.query(async ({ ctx }) => {
		try {
			const user = await ctx.db.user.findUnique({
				where: { id: ctx.session.user.id },
			});

			if (!user?.stripeCustomerId) {
				return [];
			}

			const paymentMethods = await StripeService.getPaymentMethods(user.stripeCustomerId);
			return paymentMethods;
		} catch (error) {
			console.error('Payment methods retrieval failed:', error);

			if (error instanceof TRPCError) {
				throw error;
			}

			throw new TRPCError({
				code: 'INTERNAL_SERVER_ERROR',
				message: 'Impossible de récupérer les moyens de paiement',
			});
		}
	}),

	/**
	 * Supprime un moyen de paiement
	 */
	removePaymentMethod: protectedProcedure
		.input(
			z.object({
				paymentMethodId: z.string(),
			}),
		)
		.mutation(async ({ ctx, input }) => {
			try {
				await StripeService.detachPaymentMethod(input.paymentMethodId);
				return { success: true };
			} catch (error) {
				console.error('Payment method removal failed:', error);

				if (error instanceof TRPCError) {
					throw error;
				}

				throw new TRPCError({
					code: 'INTERNAL_SERVER_ERROR',
					message: 'Impossible de supprimer le moyen de paiement',
				});
			}
		}),

	/**
	 * Crée un Setup Intent pour ajouter un nouveau moyen de paiement
	 */
	createSetupIntent: protectedProcedure.mutation(async ({ ctx }) => {
		try {
			const user = await ctx.db.user.findUnique({
				where: { id: ctx.session.user.id },
			});

			if (!user?.stripeCustomerId) {
				throw new TRPCError({
					code: 'BAD_REQUEST',
					message: 'Aucun customer Stripe trouvé',
				});
			}

			const setupIntent = await StripeService.createSetupIntent(user.stripeCustomerId);
			return setupIntent;
		} catch (error) {
			console.error('Setup intent creation failed:', error);

			if (error instanceof TRPCError) {
				throw error;
			}

			throw new TRPCError({
				code: 'INTERNAL_SERVER_ERROR',
				message: 'Impossible de créer le Setup Intent',
			});
		}
	}),
});
