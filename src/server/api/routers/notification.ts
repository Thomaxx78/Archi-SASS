import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";

export const notificationRouter = createTRPCRouter({
	getAll: protectedProcedure.query(async ({ ctx }) => {
		return ctx.db.notification.findMany({
			where: {
				userId: ctx.session.user.id,
			},
			orderBy: {
				createdAt: "desc",
			},
		});
	}),

	getUnreadCount: protectedProcedure.query(async ({ ctx }) => {
		return ctx.db.notification.count({
			where: {
				userId: ctx.session.user.id,
				isRead: false,
			},
		});
	}),

	markAsRead: protectedProcedure
		.input(z.string())
		.mutation(async ({ ctx, input }) => {
			return ctx.db.notification.update({
				where: {
					id: input,
					userId: ctx.session.user.id,
				},
				data: {
					isRead: true,
				},
			});
		}),

	markAllAsRead: protectedProcedure.mutation(async ({ ctx }) => {
		return ctx.db.notification.updateMany({
			where: {
				userId: ctx.session.user.id,
				isRead: false,
			},
			data: {
				isRead: true,
			},
		});
	}),

	create: protectedProcedure
		.input(
			z.object({
				title: z.string(),
				message: z.string(),
				type: z.enum([
					"INFO",
					"SUCCESS",
					"WARNING",
					"ERROR",
					"EVENT_INVITATION",
					"EVENT_UPDATE",
					"SUBSCRIPTION_UPDATE",
				]).default("INFO"),
				actionUrl: z.string().optional(),
				metadata: z.string().optional(),
			})
		)
		.mutation(async ({ ctx, input }) => {
			return ctx.db.notification.create({
				data: {
					...input,
					userId: ctx.session.user.id,
				},
			});
		}),

	delete: protectedProcedure
		.input(z.string())
		.mutation(async ({ ctx, input }) => {
			return ctx.db.notification.delete({
				where: {
					id: input,
					userId: ctx.session.user.id,
				},
			});
		}),
});