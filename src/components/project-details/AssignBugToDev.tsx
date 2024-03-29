import { useContext } from "react";
import type { ReactNode } from "react";
import { api } from "~/utils/api";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "~/components/Dialog";
import { Avatar, AvatarFallback, AvatarImage } from "~/components/Avatar";
import PlusIcon from "@heroicons/react/24/outline/PlusIcon";
import { ProjectContext } from "~/context/ProjectDetailsContext";
import { getNameLetters } from "~/lib/utils";

type AssignBugToDevProps = {
  bugTitle: string;

  bugId: string;
  children: ReactNode;
};
export default function AssignBugToDev({
  children,
  bugId,
  bugTitle,
}: AssignBugToDevProps) {
  const utils = api.useContext();
  const { queryVariables, projectDevelopers } = useContext(ProjectContext);
  const { mutate } = api.bug.assignTo.useMutation({
    async onMutate(assignee) {
      await utils.project.getDetails.cancel();
      const pdPrevData = utils.project.getDetails.getData();
      const ubPrevData = utils.bug.getUnassignedTitles.getData();
      utils.project.getDetails.setData(queryVariables, (old) => {
        if (old)
          return {
            ...old,
            bugs: old?.bugs.map((bug) =>
              bug.id === assignee.bugId
                ? {
                    ...bug,
                    status: "TODO",
                    assignedTo:
                      projectDevelopers?.find(
                        (dev) => dev.id === assignee.userId
                      ) ?? null,
                  }
                : bug
            ),
          };
      });
      utils.bug.getUnassignedTitles.setData(
        { id: queryVariables.id },
        (old) => {
          return old && old.filter((bug) => bug.id !== assignee.bugId);
        }
      );
      return { pdPrevData, ubPrevData };
    },
    onError(err, newStatus, ctx) {
      utils.project.getDetails.setData(queryVariables, ctx?.pdPrevData);
      utils.bug.getUnassignedTitles.setData(queryVariables, ctx?.ubPrevData);
    },
    onSettled() {
      void utils.project.getDetails.invalidate();
      void utils.bug.getUnassignedTitles.invalidate();
    },
  });
  return (
    <Dialog>
      <DialogTrigger>{children}</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Assign {bugTitle} to</DialogTitle>
          {/* <DialogDescription> */}
          <ul className="space-y-3  pt-4">
            {projectDevelopers.map((developer) => (
              <li
                key={developer.id}
                className="flex justify-between text-bodys text-white"
              >
                <div className="flex">
                  <Avatar className="mr-4 h-6 w-6">
                    <AvatarImage src={developer?.image ?? ""} />
                    <AvatarFallback>
                      {getNameLetters(developer?.name ?? "")}
                    </AvatarFallback>
                  </Avatar>
                  {developer.name}
                </div>
                <button
                  onClick={() => mutate({ bugId, userId: developer.id })}
                  aria-label={`Assign to ${developer?.name ?? ""} `}
                >
                  <PlusIcon
                    aria-hidden
                    className="h-6 w-6 cursor-pointer transition duration-200 hover:opacity-50"
                  />
                </button>
              </li>
            ))}
          </ul>
          {/* </DialogDescription> */}
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
}
