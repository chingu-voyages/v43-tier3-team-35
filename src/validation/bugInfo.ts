import { z } from "zod";

const PRIORITY = ["CRITICAL", "HIGH", "MEDIUM", "LOW"] as const;

export const bugSchema = z.object({
  title: z.string().min(5, { message: "Title is too short" }).max(100),
  markdown: z.string().min(5, { message: "Description is too short" }),
  priority: z.enum(PRIORITY),
  projectId: z.string(),
  duration: z.string().optional(),
});
