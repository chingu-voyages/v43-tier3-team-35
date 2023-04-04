import { createTRPCRouter } from "~/server/api/trpc";
import { exampleRouter } from "~/server/api/routers/example";
import { projectRouter } from "~/server/api/routers/project";
import { bugRouter } from "~/server/api/routers/bug";
import { userRouter } from "~/server/api/routers/user";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  example: exampleRouter,
  project: projectRouter,
  bug: bugRouter,
  user: userRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
