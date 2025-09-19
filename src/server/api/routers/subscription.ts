import { z } from 'zod';
import { createTRPCRouter, protectedProcedure, publicProcedure } from '~/server/api/trpc';
import { TRPCError } from '@trpc/server';
import { StripeService, ALL_PLANS, STRIPE_PLANS, FREE_PLAN } from '~/server/services/stripe';

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
		return Object.values(ALL_PLANS);
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

		let planInfo = subscription.stripePriceId ? Object.values(STRIPE_PLANS).find((plan) => plan.priceId === subscription.stripePriceId) : null;

		if (!planInfo && subscription.planName === FREE_PLAN.name) {
			planInfo = FREE_PLAN;
		}

		return {
			...subscription,
			plan: planInfo || FREE_PLAN,
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

			const planInfo = Object.values(ALL_PLANS).find((plan) => plan.priceId === input.priceId);

			if (!planInfo) {
				throw new TRPCError({
					code: 'BAD_REQUEST',
					message: 'Plan non trouvé',
				});
			}

			if (!planInfo.isStripe) {
				throw new TRPCError({
					code: 'BAD_REQUEST',
					message: 'Le plan gratuit ne nécessite pas de paiement',
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

	/**
	 * Annule un abonnement
	 */
	cancelSubscription: protectedProcedure
		.input(
			z.object({
				cancelAtPeriodEnd: z.boolean().optional().default(true),
			}),
		)
		.mutation(async ({ ctx, input }) => {
			try {
				const subscription = await ctx.db.subscription.findUnique({
					where: { userId: ctx.session.user.id },
				});

				if (!subscription) {
					throw new TRPCError({
						code: 'NOT_FOUND',
						message: 'Aucun abonnement trouvé',
					});
				}

				if (!subscription.stripeSubscriptionId) {
					throw new TRPCError({
						code: 'BAD_REQUEST',
						message: 'Aucun abonnement Stripe associé',
					});
				}

				if (subscription.status === 'canceled') {
					throw new TRPCError({
						code: 'BAD_REQUEST',
						message: "L'abonnement est déjà annulé",
					});
				}

				const canceledSubscription = await StripeService.cancelSubscription(subscription.stripeSubscriptionId, input.cancelAtPeriodEnd);

				const updatedSubscription = await ctx.db.subscription.update({
					where: { userId: ctx.session.user.id },
					data: {
						status: input.cancelAtPeriodEnd ? 'active' : 'canceled', // Reste actif jusqu'à la fin si cancelAtPeriodEnd = true
						cancelAt: canceledSubscription.cancel_at ? new Date(canceledSubscription.cancel_at * 1000) : null,
						canceledAt: canceledSubscription.canceled_at ? new Date(canceledSubscription.canceled_at * 1000) : null,
					},
				});

				return {
					success: true,
					subscription: updatedSubscription,
					cancelAtPeriodEnd: input.cancelAtPeriodEnd,
					cancelAt: canceledSubscription.cancel_at ? new Date(canceledSubscription.cancel_at * 1000) : null,
				};
			} catch (error) {
				console.error('Subscription cancellation failed:', error);

				if (error instanceof TRPCError) {
					throw error;
				}

				throw new TRPCError({
					code: 'INTERNAL_SERVER_ERROR',
					message: "Impossible d'annuler l'abonnement",
				});
			}
		}),

	/**
	 * Réactive un abonnement annulé (si encore dans la période de grâce)
	 */
	reactivateSubscription: protectedProcedure.mutation(async ({ ctx }) => {
		try {
			const subscription = await ctx.db.subscription.findUnique({
				where: { userId: ctx.session.user.id },
			});

			if (!subscription) {
				throw new TRPCError({
					code: 'NOT_FOUND',
					message: 'Aucun abonnement trouvé',
				});
			}

			if (!subscription.stripeSubscriptionId) {
				throw new TRPCError({
					code: 'BAD_REQUEST',
					message: 'Aucun abonnement Stripe associé',
				});
			}

			if (!subscription.cancelAt) {
				throw new TRPCError({
					code: 'BAD_REQUEST',
					message: "L'abonnement n'est pas programmé pour être annulé",
				});
			}

			const reactivatedSubscription = await StripeService.reactivateSubscription(subscription.stripeSubscriptionId);

			const updatedSubscription = await ctx.db.subscription.update({
				where: { userId: ctx.session.user.id },
				data: {
					status: reactivatedSubscription.status,
					cancelAt: null,
					canceledAt: null,
				},
			});

			return {
				success: true,
				subscription: updatedSubscription,
			};
		} catch (error) {
			console.error('Subscription reactivation failed:', error);

			if (error instanceof TRPCError) {
				throw error;
			}

			throw new TRPCError({
				code: 'INTERNAL_SERVER_ERROR',
				message: "Impossible de réactiver l'abonnement",
			});
		}
	}),

	/**
	 * Met à jour un abonnement vers un nouveau plan
	 */
	updateSubscription: protectedProcedure
		.input(
			z.object({
				newPriceId: z.string(),
			}),
		)
		.mutation(async ({ ctx, input }) => {
			try {
				const subscription = await ctx.db.subscription.findUnique({
					where: { userId: ctx.session.user.id },
				});

				if (!subscription) {
					throw new TRPCError({
						code: 'NOT_FOUND',
						message: 'Aucun abonnement trouvé',
					});
				}

				if (subscription.status !== 'active') {
					throw new TRPCError({
						code: 'BAD_REQUEST',
						message: "L'abonnement doit être actif pour être modifié",
					});
				}

				if (subscription.stripePriceId === input.newPriceId) {
					throw new TRPCError({
						code: 'BAD_REQUEST',
						message: 'Le nouveau plan est identique au plan actuel',
					});
				}

				const newPlanInfo = Object.values(ALL_PLANS).find((plan) => plan.priceId === input.newPriceId);

				if (!newPlanInfo) {
					throw new TRPCError({
						code: 'BAD_REQUEST',
						message: 'Plan non trouvé',
					});
				}

				if (!subscription.stripeSubscriptionId) {
					console.log('🔄 Passage du plan gratuit vers un plan payant');

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
						priceId: input.newPriceId,
						customerId: user.stripeCustomerId,
					});

					return {
						success: true,
						subscription: subscription,
						newPlan: newPlanInfo,
						clientSecret: stripeSubscription.clientSecret,
						stripeSubscriptionId: stripeSubscription.subscriptionId,
					};
				}

				if (!newPlanInfo.isStripe) {
					if (subscription.stripeSubscriptionId) {
						await StripeService.cancelSubscription(subscription.stripeSubscriptionId, false);
					}

					const updatedSubscription = await ctx.db.subscription.update({
						where: { userId: ctx.session.user.id },
						data: {
							stripeSubscriptionId: null,
							stripePriceId: null,
							stripeProductId: null,
							planName: newPlanInfo.name,
							planPrice: newPlanInfo.price,
							planInterval: newPlanInfo.interval,
							status: 'active',
							cancelAt: null,
							canceledAt: null,
						},
					});

					return {
						success: true,
						subscription: updatedSubscription,
						newPlan: newPlanInfo,
					};
				}

				if (!subscription.stripeSubscriptionId) {
					throw new TRPCError({
						code: 'BAD_REQUEST',
						message: 'Impossible de mettre à jour depuis un plan gratuit vers un plan payant via cette méthode',
					});
				}

				const updatedStripeSubscription = await StripeService.updateSubscription(subscription.stripeSubscriptionId, input.newPriceId);

				const updatedSubscription = await ctx.db.subscription.update({
					where: { userId: ctx.session.user.id },
					data: {
						stripePriceId: input.newPriceId,
						stripeProductId: newPlanInfo.productId,
						planName: newPlanInfo.name,
						planPrice: newPlanInfo.price,
						planInterval: newPlanInfo.interval,
						status: updatedStripeSubscription.status,
					},
				});

				return {
					success: true,
					subscription: updatedSubscription,
					newPlan: newPlanInfo,
				};
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
	 * Crée un abonnement gratuit local pour un nouvel utilisateur
	 */
	createFreeSubscription: protectedProcedure.mutation(async ({ ctx }) => {
		try {
			const existingSubscription = await ctx.db.subscription.findUnique({
				where: { userId: ctx.session.user.id },
			});

			if (existingSubscription) {
				return { success: false, message: 'Un abonnement existe déjà' };
			}

			let stripeCustomerId = null;
			const user = await ctx.db.user.findUnique({
				where: { id: ctx.session.user.id },
			});

			if (user && !user.stripeCustomerId) {
				const customer = await StripeService.createCustomer({
					userId: ctx.session.user.id,
					email: user.email!,
					name: user.name || undefined,
				});
				stripeCustomerId = customer.id;

				await ctx.db.user.update({
					where: { id: ctx.session.user.id },
					data: { stripeCustomerId },
				});
			} else {
				stripeCustomerId = user?.stripeCustomerId || null;
			}

			const freeSubscriptionData = StripeService.createFreeSubscription(ctx.session.user.id, stripeCustomerId || undefined);

			const subscription = await ctx.db.subscription.create({
				data: {
					...freeSubscriptionData,
					stripeCustomerId: stripeCustomerId || '',
				},
			});

			return {
				success: true,
				subscription,
				plan: FREE_PLAN,
			};
		} catch (error) {
			console.error('Free subscription creation failed:', error);

			throw new TRPCError({
				code: 'INTERNAL_SERVER_ERROR',
				message: "Impossible de créer l'abonnement gratuit",
			});
		}
	}),
});
