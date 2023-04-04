import { useRouter } from "next/router";
import { useState } from "react";
import { api } from "../../../utils/api";
import { Status } from "@prisma/client";
import { PlusIcon } from "@heroicons/react/24/outline";
import { Avatar, AvatarFallback, AvatarImage } from "~/components/Avatar";
import { useSession } from "next-auth/react";
import StatusButton from "~/components/StatusButton";
import type { selectedStatusType } from "~/components/StatusButton";
import type { selectedPrioritiesType } from "~/components/PriorityButton";
import PriorityButton from "~/components/PriorityButton";
import BugCard from "~/components/FullBugCard";
import SidebarCard from "~/components/SidebarCard";
import AssignBugsToDev from "~/components/project-details/AssignBugsToDev";
import EmptyState from "~/components/project-details/EmptyState";
import { Priorities } from "~/utils/data";
import { ProjectContext } from "~/context/ProjectDetailsContext";
import type { bugSortingType } from "~/utils/sorting";
import SortDropdown from "~/components/project-details/SortDropdown";
import { getNameLetters } from "~/lib/utils";
import { UserPlusIcon } from "@heroicons/react/24/solid";
import ProjectDevsSettings from "~/components/ProjectDevsSettings";
import Link from "next/link";

export default function ProjectDetails() {
  const {
    query: { id },
    isReady,
  } = useRouter();
  const { data: sessionData } = useSession();
  const [selectedStatus, setSelectedStatus] = useState<selectedStatusType>([
    "CLOSED",
    "INPROGRESS",
    "TESTING",
    "TODO",
    "UNASSIGNED",
  ]);
  const [selectedPriorities, setSelectedPriorities] =
    useState<selectedPrioritiesType>(["CRITICAL", "HIGH", "MEDIUM", "LOW"]);
  const [sortBy, setSortBy] = useState<bugSortingType>("recent");
  const queryVariables = {
    id: id as string,
    status: selectedStatus,
    priority: selectedPriorities,
    sort: sortBy,
  };
  const { data, isLoading, isError } = api.project.getDetails.useQuery(
    queryVariables,
    { keepPreviousData: true, enabled: isReady }
  );
  const isOwner = sessionData?.user.id === data?.owner.id;
  if (isLoading) return <div className="">loading</div>;

  if (isError) return <div className="">error</div>;
  return (
    <ProjectContext.Provider
      value={{
        projectDevelopers: data.developers,
        queryVariables,
        projectOwnerId: data.owner.id,
      }}
    >
      <main className="grid min-h-screen grid-cols-5 gap-x-8 p-11">
        <div className="col-span-4">
          <div className="flex items-center justify-between rounded-xl bg-slate-800 px-6 py-5">
            <div className="flex items-center justify-between gap-6">
              <h1 className="text-hm font-medium">{data.name}</h1>
              <SortDropdown sort={sortBy} setSort={setSortBy} />
            </div>
            <Link
              href={`./${id as string}/new`}
              className="rounded-md bg-blue-900 px-5 py-3 text-bodym font-medium text-white transition duration-300 hover:bg-white hover:text-blue-900"
            >
              Report New Bug
            </Link>
          </div>
          {data.bugs.length > 0 ? (
            <div className="mt-4 grid grid-cols-3 gap-x-5 gap-y-5">
              {data.bugs.map((bug) => (
                <BugCard
                  id={bug.id}
                  title={bug.title}
                  description={bug.markdown}
                  author={bug.reportingUser?.name ?? "anonymous"}
                  assignee={bug.assignedTo}
                  n_comments={bug._count.comments}
                  createdAt={bug.createdAt}
                  priority={
                    Priorities?.find((item) => item.value === bug.priority) ?? {
                      value: "LOW",
                      stroke: "stroke-white",
                    }
                  }
                  status={bug.status}
                  key={bug.id}
                />
              ))}
            </div>
          ) : (
            <EmptyState />
          )}
        </div>
        <div className="">
          <SidebarCard title="Bug Status" className="flex flex-wrap gap-2">
            {Object.values(Status).map((item) => (
              <li key={item}>
                <StatusButton
                  statusValue={item}
                  setSelectedStatus={setSelectedStatus}
                  isSelected={selectedStatus.includes(item)}
                >
                  {item.toLowerCase()}
                </StatusButton>
              </li>
            ))}
          </SidebarCard>
          <SidebarCard title="Bug Priority" className="space-y-1">
            {Priorities.map(({ value, background }) => (
              <PriorityButton
                count={data.bugs.filter((bug) => bug.priority === value).length}
                isSelected={selectedPriorities.includes(value)}
                setSelectedPriorities={setSelectedPriorities}
                value={value}
                color={background}
                key={value}
              />
            ))}
          </SidebarCard>
          <SidebarCard
            title="Developers"
            className="space-y-3"
            topRight={
              <>
                {isOwner && (
                  <ProjectDevsSettings projectId={id as string}>
                    <UserPlusIcon className="h-6 w-6 transition duration-300 hover:fill-blue-500" />
                  </ProjectDevsSettings>
                )}
              </>
            }
          >
            {data.developers.map((developer) => (
              <li
                key={developer.id}
                className="flex justify-between text-bodym"
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
                {isOwner && (
                  <AssignBugsToDev developer={developer}>
                    <PlusIcon className="h-6 w-6 cursor-pointer hover:stroke-blue-500" />
                  </AssignBugsToDev>
                )}
              </li>
            ))}
            {data.developers.length === 0 && (
              <li className="text-justify text-bodys leading-5 text-white text-opacity-75">
                No developers are currently assigned to this project. To add a
                developer, please click the &quot;Add Developer&quot; icon.
              </li>
            )}
          </SidebarCard>
        </div>
      </main>
    </ProjectContext.Provider>
  );
}
