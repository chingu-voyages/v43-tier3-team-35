import { useState } from "react";
import type { Status } from "@prisma/client";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import { useSession } from "next-auth/react";
import { api } from "~/utils/api";

const defaultStatuses = [
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

type StatusDropdownProps = {
  bugId: string;
  projectOwnerId: string;
  assigneId?: string;
  status: Status;
};
const StatusDropdown = ({
  bugId,
  status,
  assigneId,
  projectOwnerId,
}: StatusDropdownProps) => {
  const utils = api.useContext();
  const { data: sessionData } = useSession();
  const { mutate } = api.bug.changeStatus.useMutation({
    async onMutate(newStatus) {
      await utils.project.getDetailsById.cancel();
      const prevData = utils.project.getDetailsById.getData();
      utils.project.getDetailsById.setData(
        {
          id: "clfsqlwll0000sjmn1th17zmi",
          status: ["CLOSED", "INPROGRESS", "TESTING", "TODO", "UNASSIGNED"],
          priority: ["CRITICAL", "HIGH", "MEDIUM", "LOW"],
        },
        (old) => {
          if (old)
            return {
              ...old,
              bugs: old?.bugs.map((bug) =>
                bug.id === newStatus.bugId
                  ? {
                      ...bug,
                      status: newStatus.status,
                      assignedTo:
                        newStatus.status === "UNASSIGNED"
                          ? null
                          : bug.assignedTo,
                    }
                  : bug
              ),
            };
        }
      );
      return { prevData };
    },
    onError(err, newStatus, ctx) {
      utils.project.getDetailsById.setData(
        { id: "clfsqlwll0000sjmn1th17zmi" },
        ctx?.prevData
      );
    },
    onSettled() {
      void utils.project.getDetailsById.invalidate();
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
};

export default StatusDropdown;
