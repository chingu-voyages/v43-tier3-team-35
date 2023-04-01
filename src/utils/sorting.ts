import type { Prisma } from "@prisma/client";

export type bugSortingType =
  | "recent"
  | "oldest"
  | "highest-priority"
  | "lowest-priorty"
  | "most-comments"
  | "least-comments";

export const allSortingTypes = [
  "most-comments",
  "least-comments",
  "highest-priority",
  "lowest-priorty",
  "recent",
  "oldest",
] as const;
export function getBugSort(
  sort: bugSortingType
): Prisma.Enumerable<Prisma.BugOrderByWithRelationInput> {
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
    case "least-comments":
      return {
        comments: { _count: "asc" },
      };
  }
}
export function getBugSortLabel(sort: bugSortingType): string {
  switch (sort) {
    case "highest-priority":
      return "Highest Priority";
    case "lowest-priorty":
      return "Lowest Priority";
    case "oldest":
      return "Oldest";
    case "recent":
      return "Newly added";
    case "most-comments":
      return "Most Comments";
    case "least-comments":
      return "Least Comments";
  }
}
