import React from "react";
import Image from "next/image";
import { Squares2X2Icon, MagnifyingGlassIcon } from "@heroicons/react/24/solid";
import { Avatar, AvatarFallback, AvatarImage } from "~/components/Avatar";
import { api } from "~/utils/api";

export default function Sidebar({
  loggedUser,
}: {
  loggedUser:
    | ({ id: string } & {
        name?: string | null | undefined;
        email?: string | null | undefined;
        image?: string | null | undefined;
      })
    | undefined;
}) {
  // eslint-disable-next-line
  const { data, isLoading, isError } = api.user.getLoggedUserDetails.useQuery();

  if (isLoading) return <div className="">loading</div>;
  if (isError) return <div className="">error</div>;

  return (
    <div className="w-full border-r border-sidebar-border bg-slate-800">
      <div className="">
        <Image priority src="../logo.svg" alt="logo" width={250} height={100} />
      </div>
      <div>
        <input type="text" placeholder="Quick Search..." />{" "}
        <MagnifyingGlassIcon className="h-6 w-6" />
      </div>

      <div className="text-gray-400">
        Dashboard
        <Squares2X2Icon className="h-6 w-6" />
      </div>
      <div className="uppercase text-gray-400">
        My work ({data.assignedBugs.length})
      </div>
      <div>
        {!isLoading &&
          !isError &&
          data.assignedBugs.length > 0 &&
          data.assignedBugs.map((bug) => <div key={bug.id}>{bug.title}</div>)}
      </div>
      <div className="uppercase text-gray-400">
        My projects ({data.ownedProjects.length})
      </div>
      <div>
        {!isLoading &&
          !isError &&
          data.ownedProjects.length > 0 &&
          data.ownedProjects.map((project) => (
            <div key={project.id}>{project.name}</div>
          ))}
      </div>
      <div className="">
        <Avatar title="avatar">
          <AvatarImage src={loggedUser?.image ?? ""} />
          <AvatarFallback>{loggedUser?.name}</AvatarFallback>
        </Avatar>
      </div>
    </div>
  );
}
