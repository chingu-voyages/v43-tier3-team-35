import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";

export const userRouter = createTRPCRouter({
  getLoggedUserDetails: protectedProcedure.
    query(
      async({ctx}) => {
      const data = await ctx.prisma.user.findFirstOrThrow({
        where: {id: {equals: ctx.session.user.id}},
        select: {
          assignedBugs: true,
          ownedProjects: true,
        }
      });

      console.log("DATA IS: ", data)

      return data;
})})
