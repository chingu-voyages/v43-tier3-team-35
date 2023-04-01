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
  const { data } = api.bug.getUnassignedTitles.useQuery({
    id: queryVariables.id,
  });
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
                    assignedTo: developer,
                  }
                : bug
            ),
          };
      });
      utils.bug.getUnassignedTitles.setData(
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
      utils.project.getDetails.setData(queryVariables, ctx?.pdPrevData);
      utils.bug.getUnassignedTitles.setData(
        { id: queryVariables.id },
        ctx?.ubPrevData
      );
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
