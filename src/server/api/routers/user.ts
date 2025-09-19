import { z } from 'zod';
import { createTRPCRouter, protectedProcedure } from '~/server/api/trpc';

const updateProfileSchema = z.object({
	firstName: z.string().optional(),
	lastName: z.string().optional(),
	description: z.string().optional(),
});

export const userRouter = createTRPCRouter({
	getProfile: protectedProcedure.query(async ({ ctx }) => {
		const user = await ctx.db.user.findUnique({
			where: { id: ctx.session.user.id },
			include: {
				subscription: true,
			},
		});

		if (user && !user.subscription) {
			try {
				const { StripeService, FREE_PLAN } = await import('~/server/services/stripe');

				let stripeCustomerId = user.stripeCustomerId;

				if (!stripeCustomerId) {
					const customer = await StripeService.createCustomer({
						userId: user.id,
						email: user.email!,
						name: user.name || undefined,
					});
					stripeCustomerId = customer.id;

					await ctx.db.user.update({
						where: { id: user.id },
						data: { stripeCustomerId },
					});
				}

				const freeSubscriptionData = StripeService.createFreeSubscription(user.id, stripeCustomerId || undefined);

				await ctx.db.subscription.create({
					data: {
						...freeSubscriptionData,
						stripeCustomerId: stripeCustomerId || '',
					},
				});

				console.log(`✅ Abonnement gratuit créé automatiquement pour l'utilisateur ${user.id}`);
			} catch (error) {
				console.error("❌ Erreur lors de la création de l'abonnement gratuit:", error);
			}
		}

		return ctx.db.user.findUnique({
			where: { id: ctx.session.user.id },
		});
	}),

	updateProfile: protectedProcedure.input(updateProfileSchema).mutation(async ({ ctx, input }) => {
		return ctx.db.user.update({
			where: { id: ctx.session.user.id },
			data: input,
		});
	}),
});
