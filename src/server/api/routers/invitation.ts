import { z } from 'zod';
import { createTRPCRouter, protectedProcedure, publicProcedure } from '~/server/api/trpc';
import { mailService } from '~/server/services/mail';
import { getInvitationTemplate } from '~/server/templates';

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
			const event = await ctx.db.event.findFirst({
				where: {
					id: input.eventId,
					createdById: ctx.session.user.id,
				},
			});

			if (!event) throw new Error('Event not found');

			for (const inv of input.invitations) {
				const invitationLink = `${process.env.NEXTAUTH_URL}/event/invitation?token=${event.shareToken}&email=${encodeURIComponent(inv.email)}`;
				const emailContent = getInvitationTemplate({
					invitedUserName: inv.name || 'Invité',
					inviterName: ctx.session.user.name || 'Un organisateur',
					eventTitle: event.title,
					eventDescription: event.description || '',
					eventLocation: event.location || 'Non spécifié',
					eventDate: event.startDate.toLocaleString('fr-FR', { dateStyle: 'full', timeStyle: 'short' }),
					invitationUrl: invitationLink,
				});

				await mailService.sendMail({
					to: inv.email,
					template: emailContent,
				});
			}

			return ctx.db.invitation.createMany({
				data: input.invitations.map((inv) => ({
					...inv,
					eventId: input.eventId,
				})),
				skipDuplicates: true,
			});
		}),

	removeInvitation: protectedProcedure
		.input(
			z.object({
				invitationId: z.string(),
			}),
		)
		.mutation(async ({ ctx, input }) => {
			await ctx.db.response.deleteMany({
				where: {
					invitationId: input.invitationId,
				},
			});

			return ctx.db.invitation.delete({
				where: {
					id: input.invitationId,
				},
			});
		}),

	getAll: protectedProcedure.input(z.object({ eventId: z.string() })).query(async ({ ctx, input }) => {
		return ctx.db.invitation.findMany({
			where: {
				eventId: input.eventId,
			},
			include: {
				response: true,
			},
			orderBy: {
				sentAt: 'desc',
			},
		});
	}),

	getInvitationDetails: publicProcedure
		.input(
			z.object({
				shareToken: z.string(),
				email: z.string().email(),
			}),
		)
		.query(async ({ ctx, input }) => {
			const event = await ctx.db.event.findUnique({
				where: { shareToken: input.shareToken },
				include: {
					invitations: {
						where: { email: input.email },
						include: {
							response: true,
						},
					},
					createdBy: {
						select: {
							name: true,
						},
					},
				},
			});

			if (!event || !event.invitations[0]) {
				throw new Error('Invitation not found');
			}

			const invitation = event.invitations[0];

			return {
				event: {
					id: event.id,
					title: event.title,
					description: event.description,
					startDate: event.startDate,
					endDate: event.endDate,
					location: event.location,
					organizerName: event.createdBy.name,
				},
				invitation: {
					id: invitation.id,
					email: invitation.email,
					name: invitation.name,
					role: invitation.role,
					hasResponded: !!invitation.response,
					response: invitation.response,
				},
			};
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

			const existingResponse = await ctx.db.response.findUnique({
				where: { invitationId: invitation.id },
			});

			if (existingResponse) {
				return ctx.db.response.update({
					where: { invitationId: invitation.id },
					data: {
						response: input.response,
						comment: input.comment,
						respondedAt: new Date(),
					},
				});
			} else {
				return ctx.db.response.create({
					data: {
						invitationId: invitation.id,
						response: input.response,
						comment: input.comment,
					},
				});
			}
		}),
});
