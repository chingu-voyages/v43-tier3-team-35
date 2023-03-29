import { useRouter } from "next/router";
import { Dispatch, forwardRef, SetStateAction, useState } from "react";
import type { ReactNode } from "react";
import { api } from "../../utils/api";
import { Priority, Status } from "@prisma/client";

type selectedStatusType = (
  | "UNASSIGNED"
  | "TODO"
  | "INPROGRESS"
  | "TESTING"
  | "CLOSED"
)[];
export default function ProjectDetails() {
  const {
    query: { id },
  } = useRouter();
  const [selectedStatus, setSelectedStatus] = useState<selectedStatusType>([
    "CLOSED",
    "INPROGRESS",
    "TESTING",
    "TODO",
    "UNASSIGNED",
  ]);
  const { data, isLoading, isError } = api.project.getDetailsById.useQuery(
    {
      id: id as string,
      status: selectedStatus,
    },
    { keepPreviousData: true }
  );
  if (isLoading) return <div className="">loading</div>;

  if (isError) return <div className="">error</div>;
  return (
    <main className="grid grid-cols-5 gap-8 p-11">
      <div className="col-span-4">
        <div className="flex items-center justify-between rounded-xl bg-slate-800 px-6 py-5">
          <div className="">
            <h1 className="text-hm font-medium">{data.name}</h1>
          </div>
          <button className="rounded-md bg-blue-900 px-5 py-3 text-bodym font-medium text-white transition duration-300 hover:bg-white hover:text-blue-900">
            Report New Bug
          </button>
        </div>
      </div>
      <div className="">
        <SidebarCard title="Bug Status" className="flex flex-wrap gap-2">
          {Object.values(Status).map((item) => (
            <StatusButton
              key={item}
              statusValue={item}
              setSelectedStatus={setSelectedStatus}
              selected={selectedStatus.includes(item)}
            >
              {item.toLowerCase()}
            </StatusButton>
          ))}
        </SidebarCard>
      </div>
    </main>
  );
}

interface StatusButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  selected: boolean;
  setSelectedStatus: Dispatch<SetStateAction<selectedStatusType>>;
  statusValue: "UNASSIGNED" | "TODO" | "INPROGRESS" | "TESTING" | "CLOSED";
}

const StatusButton = forwardRef<HTMLButtonElement, StatusButtonProps>(
  ({ className, selected, setSelectedStatus, statusValue, ...props }, ref) => {
    return (
      <button
        ref={ref}
        onClick={() => {
          if (selected) {
            setSelectedStatus((selectedStatus) =>
              selectedStatus.filter((item) => item !== statusValue)
            );
          } else {
            setSelectedStatus((selectedStatus) =>
              selectedStatus.concat(statusValue)
            );
          }
        }}
        {...props}
        className={
          "rounded-[10px] px-3  py-2 text-[0.8125rem] font-bold capitalize transition hover:bg-slate-700 " +
          (selected
            ? "bg-slate-900 "
            : "bg-slate-600 text-slate-900" + (className || ""))
        }
      />
    );
  }
);

StatusButton.displayName = "Status Button";

function SidebarCard({
  title,
  children,
  className,
}: {
  title: string;
  className?: string;
  children: ReactNode;
}) {
  return (
    <div className={"rounded-xl bg-slate-800 px-6 py-4 " + (className || "")}>
      <h2 className="mb-6 text-hs">{title}</h2>
      {children}
    </div>
  );
}
