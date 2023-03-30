import { useState } from "react";
import type { Status } from "@prisma/client";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import { useSession } from "next-auth/react";
import { api } from "~/utils/api";

const defaultStatuses = [
  { value: "UNASSIGNED" as Status, background: "bg-slate-900" },
  { value: "TODO" as Status, background: "bg-violet-800" },
  { value: "INPROGRESS" as Status, background: "bg-sky-600" },
  { value: "TESTING" as Status, background: "bg-teal-600" },
  { value: "CLOSED" as Status, background: "bg-white text-gray-800" },
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
  const ctx = api.useContext();
  const { data: sessionData } = useSession();
  const { mutate } = api.bug.changeStatus.useMutation({
    onError: () => {
      void ctx.project.getDetailsById.invalidate();
    },
  });
  const readonly =
    !sessionData || ![assigneId, projectOwnerId].includes(sessionData.user.id);
  const isOwner = projectOwnerId === sessionData?.user.id;
  const Statuses = isOwner
    ? defaultStatuses
    : defaultStatuses.filter((item) => item.value !== "CLOSED");
  const [open, setOpen] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState<Status>(status);
  const selectedStatusObject = Statuses?.find(
    (item) => item.value === selectedStatus
  ) ?? {
    value: "UNASSIGNED" as const,
    background: "bg-slate-900",
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
          {selectedStatus.toLowerCase()}
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
                  setSelectedStatus(status.value);
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
