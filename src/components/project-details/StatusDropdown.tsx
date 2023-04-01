import { useContext, useState } from "react";
import type { Status } from "@prisma/client";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import { useSession } from "next-auth/react";
import { api } from "~/utils/api";
import AssignBugToDev from "./AssignBugToDev";
import { defaultStatuses } from "~/utils/data";
import { ProjectContext } from "~/context/ProjectDetailsContext";

type StatusDropdownProps = {
  bugId: string;
  assigneId?: string;
  status: Status;
  bugTitle: string;
};
const StatusDropdown = ({
  bugId,
  status,
  assigneId,
  bugTitle,
}: StatusDropdownProps) => {
  const { queryVariables, projectOwnerId } = useContext(ProjectContext);
  const utils = api.useContext();
  const { data: sessionData } = useSession();
  const { mutate } = api.bug.changeStatus.useMutation({
    async onMutate(newStatus) {
      await utils.project.getDetailsById.cancel();
      const pdPrevData = utils.project.getDetailsById.getData();
      const ubPrevData = utils.project.getUnassignedBugsTitles.getData();
      utils.project.getDetailsById.setData(queryVariables, (old) => {
        if (old)
          return {
            ...old,
            bugs: old?.bugs.map((bug) =>
              bug.id === newStatus.bugId
                ? {
                    ...bug,
                    status: newStatus.status,
                    assignedTo:
                      newStatus.status === "UNASSIGNED" ? null : bug.assignedTo,
                  }
                : bug
            ),
          };
      });
      if (newStatus.status === "UNASSIGNED")
        utils.project.getUnassignedBugsTitles.setData(
          { id: queryVariables.id },
          (old) => {
            return (
              old && old.concat([{ id: newStatus.bugId, title: bugTitle }])
            );
          }
        );
      else if (status === "UNASSIGNED")
        utils.project.getUnassignedBugsTitles.setData(
          { id: queryVariables.id },
          (old) => {
            return old && old.filter((bug) => bug.id !== newStatus.bugId);
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
  const readonly =
    !sessionData || ![assigneId, projectOwnerId].includes(sessionData.user.id);
  const isOwner = projectOwnerId === sessionData?.user.id;
  const Statuses = isOwner
    ? defaultStatuses
    : defaultStatuses.filter((item) => item.value !== "CLOSED");
  const [open, setOpen] = useState(false);
  const selectedStatusObject = Statuses?.find(
    (item) => item.value === status
  ) ?? {
    value: "UNASSIGNED" as const,
    background: "bg-slate-900",
    label: "Unassigned",
  };

  if (status !== "UNASSIGNED" || sessionData?.user.id !== projectOwnerId)
    return (
      <DropdownMenu.Root
        open={open}
        onOpenChange={(open) => setOpen(readonly ? false : open)}
      >
        <DropdownMenu.Trigger asChild>
          <button
            disabled={readonly}
            className={`rounded-[4px] ${
              readonly ? "cursor-default" : "cursor-pointer"
            } transition hover:bg-opacity-75 ${
              selectedStatusObject.background
            } options w-28 py-1.5 text-center
          text-sm capitalize`}
          >
            {selectedStatusObject.label}
          </button>
        </DropdownMenu.Trigger>

        <DropdownMenu.Portal className={``}>
          <DropdownMenu.Content className="my-2 w-28 rounded-lg border border-white border-opacity-10 bg-gray-800 p-3 text-sm font-medium text-white">
            <DropdownMenu.RadioGroup>
              {Statuses.map((status) => (
                <DropdownMenu.RadioItem
                  key={status.value}
                  value={status.value}
                  onSelect={() => {
                    mutate({ status: status.value, bugId });
                  }}
                  className={`my-1 cursor-pointer text-center capitalize outline-none transition hover:text-gray-500`}
                >
                  {status.value.toLowerCase()}
                </DropdownMenu.RadioItem>
              ))}
            </DropdownMenu.RadioGroup>
          </DropdownMenu.Content>
        </DropdownMenu.Portal>
      </DropdownMenu.Root>
    );
  return (
    <AssignBugToDev bugTitle={bugTitle} bugId={bugId}>
      <span
        className={`inline-block cursor-pointer rounded-[4px] transition hover:bg-opacity-75 ${selectedStatusObject.background} options text-centerz w-28 py-1.5
    text-sm capitalize`}
      >
        {selectedStatusObject.label}
      </span>
    </AssignBugToDev>
  );
};

export default StatusDropdown;
