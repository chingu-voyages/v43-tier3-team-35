import { z } from "zod";

import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";

export const userRouter = createTRPCRouter({
  findByText: protectedProcedure
    .input(z.object({ searchFor: z.string(), projectId: z.string().cuid() }))
    .query(({ ctx, input }) => {
      return ctx.prisma.user.findMany({
        where: {
          OR: [
            { name: { contains: input.searchFor, mode: "insensitive" } },
            { email: { contains: input.searchFor, mode: "insensitive" } },
          ],
          ownedProjects: { none: { id: { equals: input.projectId } } },
          developerOnProjects: { none: { id: { equals: input.projectId } } },
        },
        select: {
          name: true,
          id: true,
          image: true,
        },
      });
    }),
});
