import type { ReactNode } from "react";
import { useContext } from "react";
import { api } from "~/utils/api";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "~/components/Dialog";
import { PlusIcon } from "@heroicons/react/24/outline";
import { ProjectContext } from "~/context/ProjectDetailsContext";

export default function AssignBugsToDev({
  children,
  developer,
}: {
  children: ReactNode;
  developer: {
    id: string;
    name: string | null;
    image: string | null;
  };
}) {
  const utils = api.useContext();
  const { queryVariables } = useContext(ProjectContext);
  const { data } = api.project.getUnassignedBugsTitles.useQuery({
    id: queryVariables.id,
  });
  const { mutate } = api.bug.assignTo.useMutation({
    async onMutate(assignee) {
      await utils.project.getDetailsById.cancel();
      const pdPrevData = utils.project.getDetailsById.getData();
      const ubPrevData = utils.project.getUnassignedBugsTitles.getData();
      utils.project.getDetailsById.setData(queryVariables, (old) => {
        if (old)
          return {
            ...old,
            bugs: old?.bugs.map((bug) =>
              bug.id === assignee.bugId
                ? {
                    ...bug,
                    status: "TODO",
                    assignedTo: developer,
                  }
                : bug
            ),
          };
      });
      utils.project.getUnassignedBugsTitles.setData(
        {
          id: queryVariables.id,
        },
        (old) => {
          if (old) return old.filter((bug) => bug.id !== assignee.bugId);
        }
      );
      return { pdPrevData, ubPrevData };
    },
    onError(err, newStatus, ctx) {
      utils.project.getDetailsById.setData(queryVariables, ctx?.pdPrevData);
      utils.project.getUnassignedBugsTitles.setData(
        { id: queryVariables.id },
        ctx?.ubPrevData
      );
    },
    onSettled() {
      void utils.project.getDetailsById.invalidate();
      void utils.project.getUnassignedBugsTitles.invalidate();
    },
  });
  return (
    <Dialog>
      <DialogTrigger>{children}</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Assign to {developer.name}</DialogTitle>
        </DialogHeader>
        <ul className="space-y-3  pt-4">
          {data && data.length > 0 ? (
            data.map((bug) => (
              <li
                key={bug.id}
                className="flex justify-between text-bodys text-white"
              >
                <div className="flex">{bug.title}</div>
                <button
                  onClick={() =>
                    mutate({ bugId: bug.id, userId: developer.id })
                  }
                >
                  <PlusIcon
                    aria-hidden
                    className="h-6 w-6 cursor-pointer transition duration-200 hover:opacity-50"
                  />
                </button>
              </li>
            ))
          ) : (
            <p className=" text-white">
              Great news! There are currently no bugs to assign. Take a moment
              to bask in the glory of your bug-free code, but stay vigilant,
              because those pesky bugs are always lurking around the corner.
            </p>
          )}
        </ul>
      </DialogContent>
    </Dialog>
  );
}
