import { TRPCError } from "@trpc/server";
import { z } from "zod";

import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";

const PRIORITY = ["CRITICAL", "HIGH", "MEDIUM", "LOW"] as const;
const STATUS = [
  "UNASSIGNED",
  "TODO",
  "INPROGRESS",
  "TESTING",
  "CLOSED",
] as const;
export const projectRouter = createTRPCRouter({
  getDetailsById: protectedProcedure
    .input(
      z.object({
        id: z.string().cuid(),
        priority: z.array(z.enum(PRIORITY)).optional(),
        status: z.array(z.enum(STATUS)).optional(),
      })
    )
    .query(
      async ({
        ctx,
        input: {
          id,
          priority = ["CRITICAL", "HIGH", "LOW", "MEDIUM"],
          status = ["CLOSED", "INPROGRESS", "TESTING", "TODO", "UNASSIGNED"],
        },
      }) => {
        const data = await ctx.prisma.project.findUnique({
          where: { id },
          select: {
            name: true,
            owner: { select: { id: true, name: true, image: true } },
            bugs: {
              select: {
                reportingUser: { select: { name: true } },
                _count: { select: { comments: true } },
                id: true,
                createdAt: true,
                title: true,
                markdown: true,
                priority: true,
                status: true,
                assignedTo: { select: { id: true, name: true, image: true } },
              },
              where: {
                AND: { priority: { in: priority }, status: { in: status } },
              },
            },
            developers: { select: { id: true, name: true, image: true } },
          },
        });
        if (!data) {
          throw new TRPCError({
            code: "NOT_FOUND",
          });
        }
        const userId = ctx.session.user.id;
        if (
          data?.owner.id === userId ||
          data?.developers.some((dev) => dev.id === userId)
        )
          return data;
        throw new TRPCError({ code: "UNAUTHORIZED" });
      }
    ),
    getUnassignedBugsTitles: protectedProcedure.input(z.object({id: z.string().cuid()})).query(({
      ctx,
      input,
    }) => {
      return ctx.prisma.bug.findMany({where: {status: "UNASSIGNED", project: {id: {equals: input.id}}}, select: {id: true, title: true}})
    })
});
