import React from "react";
import Image from "next/image";
import { Squares2X2Icon } from "@heroicons/react/24/solid";
import { Avatar, AvatarFallback, AvatarImage } from "~/components/Avatar";
import { api } from "~/utils/api";
import Link from "next/link";
import { Command as CommandPrimitive } from "cmdk";
import { CommandInput, CommandList } from "~/components/ui/command";
import NewProjectSheet from "./NewProjectSheet";

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
  const { data, isLoading, isError } = api.user.getLoggedUserDetails.useQuery();

  if (isLoading) return <div className="">loading</div>;
  if (isError) return <div className="">error</div>;

  return (
    <div className="flex w-[60rem] flex-col border-r border-sidebar-border bg-slate-800">
      <Image
        priority
        src="../logo.svg"
        alt="logo"
        width={132}
        height={60}
        className="m-0 mt-6 self-center"
      />

      <div>
        <CommandPrimitive>
          <CommandInput placeholder="Quick Search..." />
          <CommandList></CommandList>
        </CommandPrimitive>
      </div>

      <div className="flex h-full flex-col justify-between text-gray-400">
        <div className="ml-4">
          <div className="">
            <Link href="/dashboard" className="mb-2 flex gap-2">
              <Squares2X2Icon className="h-6 w-6" />
              Dashboard
            </Link>
          </div>
          <div className="">
            <NewProjectSheet />
          </div>
          <div className="mt-5 text-hsb uppercase">
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
                  className="mb-2 mt-4 flex gap-2 text-bodym"
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
          <div className="mt-5 text-hsb uppercase">
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
                  className="mb-2 mt-4 flex gap-2 text-bodym"
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
        </div>
        <div className="m-0 mb-6 self-center">
          <Link href={"/dashboard"}>
            <Avatar title="avatar">
              <AvatarImage src={loggedUser?.image ?? ""} />
              <AvatarFallback>{loggedUser?.name}</AvatarFallback>
            </Avatar>
          </Link>
        </div>
      </div>
    </div>
  );
}
