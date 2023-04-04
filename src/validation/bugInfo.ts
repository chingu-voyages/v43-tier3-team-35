import { z } from "zod";

export const bugSchema = z.object({
  title: z.string().min(5, { message: "Title is too short" }).max(100),
  markdown: z.string().min(5, { message: "Description is too short" }),
  priority: z.string(),
  projectId: z.string(),
  duration: z.string().optional(),
});
