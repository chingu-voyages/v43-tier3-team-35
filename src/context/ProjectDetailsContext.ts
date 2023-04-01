import { createContext } from "react";
import type { selectedPrioritiesType } from "~/components/PriorityButton";
import type { selectedStatusType } from "~/components/StatusButton";

type ProjectContextType = {
  queryVariables: {
    id: string;
    status: selectedStatusType;
    priority: selectedPrioritiesType;
  };
  projectOwnerId: string;
  projectDevelopers: {
    id: string;
    name: string | null;
    image: string | null;
  }[];
};

export const ProjectContext = createContext<ProjectContextType>(
  {} as ProjectContextType
);
