import { Status } from "@prisma/client";
import { TRPCError } from "@trpc/server";
import { z } from "zod";

import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";

const STATUS = [
  "UNASSIGNED",
  "TODO",
  "INPROGRESS",
  "TESTING",
  "CLOSED",
] as const;

export const bugRouter = createTRPCRouter({
  changeStatus: protectedProcedure
    .input(
      z.object({
        bugId: z.string().cuid(),
        status: z.enum(STATUS),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const bug = await ctx.prisma.bug.findUnique({
        where: { id: input.bugId },
        select: {
          project: { select: { ownerId: true } },
          assignedToUserId: true,
        },
      });
      if (
        bug?.project.ownerId === ctx.session.user.id ||
        (bug?.assignedToUserId === ctx.session.user.id &&
          input.status !== "CLOSED")
      ) {
        return ctx.prisma.bug.update({
          where: { id: input.bugId },
          data: { status: input.status },
          select: { id: true, status: true },
        });
      }
      throw new TRPCError({
        code: "UNAUTHORIZED",
      });
    }),
});
