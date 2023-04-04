import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";
import { z } from "zod";

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
  getLoggedUserDetails: protectedProcedure
  .query(async({ctx}) => {
      const data = await ctx.prisma.user.findFirstOrThrow({
        where: {id: {equals: ctx.session.user.id}},
        select: {
          assignedBugs: true,
          ownedProjects: true,
        }
      });

      return data;
}), 
  getAllDevelopers: protectedProcedure
    .query(
      async({ctx}) => {
      const developers = await ctx.prisma.user.findMany({
        select: {
          id: true,
          name: true,
          image: true
        }
      });
  
    return developers;
})});
