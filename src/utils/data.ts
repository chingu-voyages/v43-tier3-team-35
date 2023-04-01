import type { Status } from "@prisma/client";

export const Priorities = [
  {
    value: "CRITICAL" as const,
    stroke: "stroke-red-500",
    background: "bg-red-500",
  },
  {
    value: "HIGH" as const,
    stroke: "stroke-orange-500",
    background: "bg-orange-500",
  },
  {
    value: "MEDIUM" as const,
    stroke: "stroke-yellow-500",
    background: "bg-yellow-500",
  },
  { value: "LOW" as const, stroke: "stroke-white", background: "bg-white" },
];

export const defaultStatuses = [
  {
    value: "UNASSIGNED" as Status,
    label: "Unassigned",
    background: "bg-slate-900",
  },
  { value: "TODO" as Status, label: "Todo", background: "bg-violet-800" },
  {
    value: "INPROGRESS" as Status,
    background: "bg-sky-600",
    label: "In Progress",
  },
  { value: "TESTING" as Status, background: "bg-teal-600", label: "Testing" },
  {
    value: "CLOSED" as Status,
    background: "bg-white text-gray-800",
    label: "Closed",
  },
];
