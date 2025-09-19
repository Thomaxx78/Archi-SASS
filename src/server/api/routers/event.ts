import { z } from 'zod';
import { createTRPCRouter, protectedProcedure } from '~/server/api/trpc';

const createEventSchema = z.object({
	title: z.string().min(1).max(100),
	description: z.string().optional(),
	startDate: z.date(),
	endDate: z.date().optional(),
	location: z.string().optional(),
});

const updateEventSchema = z.object({
	id: z.string(),
	title: z.string().min(1).max(100).optional(),
	description: z.string().optional(),
	startDate: z.date().optional(),
	endDate: z.date().optional(),
	location: z.string().optional(),
});

export const eventRouter = createTRPCRouter({
	create: protectedProcedure.input(createEventSchema).mutation(async ({ ctx, input }) => {
		const event = await ctx.db.event.create({
			data: {
				...input,
				createdById: ctx.session.user.id,
			},
		});

		// Créer une notification pour l'utilisateur
		await ctx.db.notification.create({
			data: {
				userId: ctx.session.user.id,
				title: "Événement créé",
				message: `Votre événement "${input.title}" a été créé avec succès.`,
				type: "SUCCESS",
				actionUrl: `/event/${event.id}/settings`,
			},
		});

		return event;
	}),

	getAll: protectedProcedure.query(async ({ ctx }) => {
		return ctx.db.event.findMany({
			where: { createdById: ctx.session.user.id },
			orderBy: { startDate: 'asc' },
		});
	}),

	getById: protectedProcedure.input(z.object({ id: z.string() })).query(async ({ ctx, input }) => {
		return ctx.db.event.findFirst({
			where: {
				id: input.id,
				createdById: ctx.session.user.id,
			},
		});
	}),

	update: protectedProcedure.input(updateEventSchema).mutation(async ({ ctx, input }) => {
		const { id, ...updateData } = input;
		return ctx.db.event.update({
			where: {
				id,
				createdById: ctx.session.user.id,
			},
			data: updateData,
		});
	}),

	updateStatus: protectedProcedure
		.input(
			z.object({
				id: z.string(),
				status: z.enum(['DRAFT', 'PUBLISHED', 'CANCELLED', 'COMPLETED']),
			}),
		)
		.mutation(async ({ ctx, input }) => {
			const event = await ctx.db.event.update({
				where: {
					id: input.id,
					createdById: ctx.session.user.id,
				},
				data: { status: input.status },
			});

			// Créer une notification selon le nouveau statut
			const statusMessages = {
				PUBLISHED: "Votre événement a été publié et est maintenant visible.",
				CANCELLED: "Votre événement a été annulé.",
				COMPLETED: "Votre événement a été marqué comme terminé.",
				DRAFT: "Votre événement a été remis en brouillon.",
			};

			const notificationTypes = {
				PUBLISHED: "SUCCESS" as const,
				CANCELLED: "WARNING" as const,
				COMPLETED: "SUCCESS" as const,
				DRAFT: "INFO" as const,
			};

			await ctx.db.notification.create({
				data: {
					userId: ctx.session.user.id,
					title: "Statut de l'événement modifié",
					message: statusMessages[input.status],
					type: notificationTypes[input.status],
					actionUrl: `/event/${input.id}/settings`,
				},
			});

			return event;
		}),
});
