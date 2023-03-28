import { Priority, Status } from "@prisma/client";
import { z } from "zod";

import {
  createTRPCRouter,
  publicProcedure,
  protectedProcedure,
} from "~/server/api/trpc";
import { prisma } from "~/server/db";

const PRIORITY = ["CRITICAL", "HIGH", "MEDIUM", "LOW"] as const;
const STATUS = [
  "UNASSIGNED",
  "TODO",
  "INPROGRESS",
  "TESTING",
  "CLOSED",
] as const;
export const projectRouter = createTRPCRouter({
  hello: publicProcedure
    .input(z.object({ text: z.string() }))
    .query(({ input }) => {
      return {
        greeting: `Hello ${input.text}`,
      };
    }),
  getProjectById: protectedProcedure
    .input(
      z.object({
        id: z.string(),
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
        const projectData = await ctx.prisma.project.findUnique({
          where: { id },
          select: {
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
        const userId = ctx.session.user.id;
        if (
          projectData?.owner.id === userId ||
          projectData?.developers.some((dev) => dev.id === userID)
        )
          return projectData;
        return Error("unauthorized");
      }
    ),
  getAll: publicProcedure.query(({ ctx }) => {
    return ctx.prisma.project.findMany();
  }),

  getSecretMessage: protectedProcedure.query(() => {
    return "you can now see this secret message!";
  }),
});
