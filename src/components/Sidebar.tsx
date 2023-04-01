import React from "react";
import Image from "next/image";
import { Squares2X2Icon, MagnifyingGlassIcon } from "@heroicons/react/24/solid";
import { Avatar, AvatarFallback, AvatarImage } from "~/components/Avatar";
import { api } from "~/utils/api";
import Link from "next/link";
import { Command as CommandPrimitive } from "cmdk";
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
  CommandShortcut,
} from "~/components/ui/command";

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
        <CommandPrimitive>
          <CommandInput placeholder="Type a command or search..." />
          <CommandList></CommandList>
        </CommandPrimitive>

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
          data.assignedBugs.map((bug) => (
            <Link key={bug.id} href={`/bug/${bug.id}`} className="flex">
              <Image
                priority
                src="../bug.svg"
                alt="bug"
                width={20}
                height={20}
              />{" "}
              {bug.title}
            </Link>
          ))}
      </div>
      <div className="uppercase text-gray-400">
        My projects ({data.ownedProjects.length})
      </div>
      <div>
        {!isLoading &&
          !isError &&
          data.ownedProjects.length > 0 &&
          data.ownedProjects.map((project) => (
            <Link
              key={project.id}
              href={`/project/${project.id}`}
              className="flex"
            >
              <Image
                priority
                src="../project.svg"
                alt="project"
                width={20}
                height={20}
              />
              {project.name}
            </Link>
          ))}
      </div>
      <div className="">
        <Link href={"/dashboard"}>
          <Avatar title="avatar">
            <AvatarImage src={loggedUser?.image ?? ""} />
            <AvatarFallback>{loggedUser?.name}</AvatarFallback>
          </Avatar>
        </Link>
      </div>
    </div>
  );
}
