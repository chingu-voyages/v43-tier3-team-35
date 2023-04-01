import type { Prisma } from "@prisma/client";

export type bugSortingType =
  | "recent"
  | "oldest"
  | "highest-priority"
  | "lowest-priorty"
  | "most-comments"
  | "least-comments";

export const allSortingTypes = [
  "recent",
  "oldest",
  "highest-priority",
  "lowest-priorty",
  "most-comments",
  "least-comments",
] as const;
export function getBugSort(
  sort: bugSortingType
): Prisma.Enumerable<Prisma.BugOrderByWithRelationInput> | undefined {
  switch (sort) {
    case "highest-priority":
      return {
        priority: "asc",
      };
    case "lowest-priorty":
      return {
        priority: "desc",
      };
    case "oldest":
      return {
        createdAt: "asc",
      };
    case "recent":
      return {
        createdAt: "desc",
      };
    case "most-comments":
      return {
        comments: { _count: "desc" },
      };
    case "recent":
      return {
        comments: { _count: "asc" },
      };
  }
}
