import { z } from 'zod';
import { createTRPCRouter, protectedProcedure } from '~/server/api/trpc';

const createEventSchema = z.object({
	title: z.string().min(1).max(100),
	description: z.string().optional(),
	startDate: z.date(),
	endDate: z.date().optional(),
	location: z.string().optional(),
});

export const eventRouter = createTRPCRouter({
	create: protectedProcedure.input(createEventSchema).mutation(async ({ ctx, input }) => {
		return ctx.db.event.create({
			data: {
				...input,
				createdById: ctx.session.user.id,
			},
		});
	}),

	getAll: protectedProcedure.query(async ({ ctx }) => {
		return ctx.db.event.findMany({
			where: { createdById: ctx.session.user.id },
			include: {
				invitations: {
					include: { responses: true },
				},
			},
			orderBy: { startDate: 'asc' },
		});
	}),

	getById: protectedProcedure.input(z.object({ id: z.string() })).query(async ({ ctx, input }) => {
		return ctx.db.event.findFirst({
			where: {
				id: input.id,
				createdById: ctx.session.user.id,
			},
			include: {
				invitations: {
					include: { responses: true },
				},
			},
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
			return ctx.db.event.update({
				where: {
					id: input.id,
					createdById: ctx.session.user.id,
				},
				data: { status: input.status },
			});
		}),
});
