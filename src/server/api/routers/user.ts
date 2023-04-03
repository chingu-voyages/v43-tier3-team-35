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

    console.log("all devs: ", developers);
  
    return developers;
})})
