import { TRPCError } from "@trpc/server";
import { z } from "zod";

import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";
import { PRIORITY } from "./project";

const STATUS = [
  "UNASSIGNED",
  "TODO",
  "INPROGRESS",
  "TESTING",
  "CLOSED",
] as const;

const bugSchema = z.object({
  title: z.string().min(5, { message: "Title is too short" }).max(100),
  markdown: z.string(),
  priority: z.enum(PRIORITY),
  projectId: z.string().cuid(),
});

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
        if (input.status === "UNASSIGNED") {
          return ctx.prisma.bug.update({
            where: { id: input.bugId },
            data: { status: input.status, assignedToUserId: null },
            select: {
              id: true,
              status: true,
              assignedTo: { select: { id: true, name: true, image: true } },
            },
          });
        }
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
  assignTo: protectedProcedure
    .input(
      z.object({
        bugId: z.string().cuid(),
        userId: z.string().cuid(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const bug = await ctx.prisma.bug.findUnique({
        where: { id: input.bugId },
        select: {
          project: { select: { ownerId: true } },
        },
      });
      if (bug?.project.ownerId === ctx.session.user.id) {
        return ctx.prisma.bug.update({
          where: { id: input.bugId },
          data: { assignedToUserId: input.userId, status: "TODO" },
          select: {
            id: true,
            assignedTo: { select: { id: true, name: true, image: true } },
            status: true,
          },
        });
      }
      throw new TRPCError({
        code: "UNAUTHORIZED",
      });
    }),
  create: protectedProcedure.input(bugSchema).mutation(({ ctx, input }) => {
    return ctx.prisma.bug.create({
      data: {
        ...input,
        reportingUserId: ctx.session.user.id,
      },
      select: {
        id: true,
      },
    });
  }),
  getUnassignedTitles: protectedProcedure
    .input(z.object({ id: z.string().cuid() }))
    .query(({ ctx, input }) => {
      return ctx.prisma.bug.findMany({
        where: { status: "UNASSIGNED", project: { id: { equals: input.id } } },
        select: { id: true, title: true },
      });
    }),
});
