import { TRPCError } from "@trpc/server";
import { map } from "@trpc/server/observable";
import { z } from "zod";

import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";
import { allSortingTypes, getBugSort } from "~/utils/sorting";

export const PRIORITY = ["CRITICAL", "HIGH", "MEDIUM", "LOW"] as const;
const STATUS = [
  "UNASSIGNED",
  "TODO",
  "INPROGRESS",
  "TESTING",
  "CLOSED",
] as const;
export const projectRouter = createTRPCRouter({
  getDetails: protectedProcedure
    .input(
      z.object({
        id: z.string().cuid(),
        priority: z.array(z.enum(PRIORITY)).optional(),
        status: z.array(z.enum(STATUS)).optional(),
        sort: z.enum(allSortingTypes),
      })
    )
    .query(
      async ({
        ctx,
        input: {
          id,
          priority = ["CRITICAL", "HIGH", "LOW", "MEDIUM"],
          status = ["CLOSED", "INPROGRESS", "TESTING", "TODO", "UNASSIGNED"],
          sort = "recent",
        },
      }) => {
        const data = await ctx.prisma.project.findUnique({
          where: { id },
          select: {
            name: true,
            owner: { select: { id: true, name: true, image: true } },
            bugs: {
              orderBy: {
                ...getBugSort(sort),
              },
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
  addProject: protectedProcedure
    .input(z.object({
      name: z.string(),
      developers: z.array(z.string().cuid())
    }))
    .mutation(async({ctx, input}) => {
      return await ctx.prisma.project.create({
        data: {
          ownerId: ctx.session.user.id,
          name: input.name,
          developers: {
            connect: [
              ...input.developers.map(dev => ({id: dev}))
            ]
          }
        }
      })


    }),
  getTitles: protectedProcedure.query(async ({ ctx }) => {
    return ctx.prisma.project.findMany({
      where: {
        OR: [
          { owner: { id: { equals: ctx.session.user.id } } },
          { developers: { some: { id: ctx.session.user.id } } },
        ],
      },
      select: {
        id: true,
        name: true,
      },
    });
  }),
  addDev: protectedProcedure
    .input(z.object({ devId: z.string().cuid(), projectId: z.string().cuid() }))
    .mutation(async ({ ctx, input }) => {
      const ownedProjects = await ctx.prisma.project.findMany({
        where: { ownerId: { equals: ctx.session.user.id } },
        select: { id: true },
      });
      if (ownedProjects.some((project) => project.id === input.projectId)) {
        return ctx.prisma.project.update({
          where: { id: input.projectId },
          data: { developers: { connect: { id: input.devId } } },
        });
      }
      throw new TRPCError({
        code: "UNAUTHORIZED",
      });
    }),
  removeDev: protectedProcedure
    .input(z.object({ devId: z.string().cuid(), projectId: z.string().cuid() }))
    .mutation(async ({ ctx, input }) => {
      const ownedProjects = await ctx.prisma.project.findMany({
        where: { ownerId: { equals: ctx.session.user.id } },
        select: { id: true },
      });
      if (ownedProjects.some((project) => project.id === input.projectId)) {
        return ctx.prisma.project.update({
          where: { id: input.projectId },
          data: { developers: { disconnect: { id: input.devId } } },
        });
      }
      throw new TRPCError({
        code: "UNAUTHORIZED",
      });
    }),
  getTeam: protectedProcedure
    .input(z.object({ projectId: z.string().cuid() }))
    .query(({ ctx, input }) => {
      return ctx.prisma.project.findUnique({
        where: { id: input.projectId },
        select: {
          owner: { select: { id: true, name: true, image: true } },
          developers: { select: { id: true, name: true, image: true } },
        },
      });
    }),
});
