import { z } from 'zod';
import { createTRPCRouter, protectedProcedure, publicProcedure } from '~/server/api/trpc';

export const invitationRouter = createTRPCRouter({
	addInvitations: protectedProcedure
		.input(
			z.object({
				eventId: z.string(),
				invitations: z.array(
					z.object({
						email: z.string().email(),
						name: z.string().optional(),
						role: z.enum(['ORGANIZER', 'PARTICIPANT']).default('PARTICIPANT'),
					}),
				),
			}),
		)
		.mutation(async ({ ctx, input }) => {
			// Vérifier que l'utilisateur possède l'événement
			const event = await ctx.db.event.findFirst({
				where: {
					id: input.eventId,
					createdById: ctx.session.user.id,
				},
			});

			if (!event) throw new Error('Event not found');

			return ctx.db.invitation.createMany({
				data: input.invitations.map((inv) => ({
					...inv,
					eventId: input.eventId,
				})),
				skipDuplicates: true,
			});
		}),

	respondToInvitation: publicProcedure
		.input(
			z.object({
				shareToken: z.string(),
				email: z.string().email(),
				response: z.enum(['YES', 'NO', 'MAYBE']),
				comment: z.string().optional(),
			}),
		)
		.mutation(async ({ ctx, input }) => {
			// Trouver l'événement et l'invitation
			const event = await ctx.db.event.findUnique({
				where: { shareToken: input.shareToken },
				include: {
					invitations: {
						where: { email: input.email },
					},
				},
			});

			if (!event || !event.invitations[0]) {
				throw new Error('Invitation not found');
			}

			const invitation = event.invitations[0];

			return ctx.db.response.create({
				data: {
					invitationId: invitation.id,
					response: input.response,
					comment: input.comment,
				},
			});
		}),
});
