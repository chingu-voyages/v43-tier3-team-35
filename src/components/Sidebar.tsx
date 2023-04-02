import React from "react";
import Image from "next/image";
import { Squares2X2Icon } from "@heroicons/react/24/solid";
import { Avatar, AvatarFallback, AvatarImage } from "~/components/Avatar";
import { api } from "~/utils/api";
import Link from "next/link";
import { Command as CommandPrimitive } from "cmdk";
import { CommandInput, CommandList } from "~/components/ui/command";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "~/components/ui/sheet";

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
          <CommandInput placeholder="Quick Search..." />
          <CommandList></CommandList>
        </CommandPrimitive>
      </div>

      <div className="text-gray-400">
        <Link href="/dashboard" className="mb-2 flex gap-2">
          <Squares2X2Icon className="h-6 w-6" />
          Dashboard
        </Link>
      </div>
      <div className="text-gray-400">
        <Sheet>
          <SheetTrigger>New project</SheetTrigger>
          <SheetContent>
            <SheetHeader>
              <SheetTitle>Add New Project</SheetTitle>
              <form>
                <input type="text" /> Title
                <input type="text" /> Invite developers
                <button type="submit">Create project</button>
              </form>
            </SheetHeader>
          </SheetContent>
        </Sheet>
      </div>
      <div className="uppercase text-gray-400">
        My work ({data.assignedBugs.length})
      </div>
      <div>
        {!isLoading &&
          !isError &&
          data.assignedBugs.length > 0 &&
          data.assignedBugs.map((bug) => (
            <Link
              key={bug.id}
              href={`/bug/${bug.id}`}
              className="mb-2 flex gap-2"
            >
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
              className="mb-2 flex gap-2"
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
