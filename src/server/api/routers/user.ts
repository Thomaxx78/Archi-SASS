import { z } from 'zod';
import { createTRPCRouter, protectedProcedure } from '~/server/api/trpc';

const updateProfileSchema = z.object({
    firstName: z.string().optional(),
    lastName: z.string().optional(),
    description: z.string().optional(),
});

export const userRouter = createTRPCRouter({
    getProfile: protectedProcedure.query(async ({ ctx }) => {
        return ctx.db.user.findUnique({
            where: { id: ctx.session.user.id },
        });
    }),

    updateProfile: protectedProcedure
        .input(updateProfileSchema)
        .mutation(async ({ ctx, input }) => {
            return ctx.db.user.update({
                where: { id: ctx.session.user.id },
                data: input,
            });
        }),
});