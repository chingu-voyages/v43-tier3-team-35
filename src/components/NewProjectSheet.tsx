import React, { useState } from "react";
import { api } from "~/utils/api";
import { useSession } from "next-auth/react";
import { Avatar, AvatarFallback, AvatarImage } from "~/components/Avatar";
import PlusIcon from "@heroicons/react/24/outline/PlusIcon";
import MinusIcon from "@heroicons/react/24/outline/MinusIcon";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTrigger,
} from "~/components/ui/sheet";

type DeveloperType = {
  id: string;
  name: string | null;
  image: string | null;
};

export default function NewProjectSheet() {
  const { data: sessionData } = useSession();
  const utils = api.useContext();
  const { data, isLoading, isError } = api.user.getAllDevelopers.useQuery();
  const [projectName, setProjectName] = useState("");
  const [developers, setDevelopers] = useState<DeveloperType[]>([]);

  const { mutate: addMutate } = api.project.addProject.useMutation({
    async onMutate(newProject) {
      const proj = await utils.project.addProject.setData(
        projectName,
        developers.map((d) => d.id)
      );

      return;
    },
  });

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    addMutate({ developers: developers.map((d) => d.id), name: projectName });
  };

  return (
    <Sheet>
      <SheetTrigger>New project</SheetTrigger>
      <SheetContent className="rounded-tl-large rounded-bl-large bg-slate-700">
        <SheetHeader>
          <h1 className="mb-8 text-3xl text-white">Add New Project</h1>
        </SheetHeader>
        <div className="text-white">
          <form onSubmit={(e) => handleSubmit(e)}>
            <div className="text-sm">Title</div>
            <input
              className="custom-input mb-6"
              type="text"
              placeholder="Enter project name"
              onChange={(e) => setProjectName(e.target.value)}
            />
            <div className="text-sm">Invite developers</div>
            <div className="flex items-center gap-4">
              <input
                className="custom-input"
                type="text"
                placeholder="Enter an Email"
              />

              <button className="">Send Invite</button>
            </div>
            <button type="submit" className="btn-blue mt-5">
              Create project
            </button>
          </form>

          {developers.length > 0 && (
            <p className="mb-3 mt-3">Developers list</p>
          )}

          {developers.map((developer) => (
            <li
              key={developer.id}
              className="mb-2 flex justify-between text-bodym"
            >
              <div className="flex">
                <Avatar className="mr-4 h-6 w-6">
                  <AvatarImage src={developer?.image ?? ""} />
                  <AvatarFallback>{developer.name}</AvatarFallback>
                </Avatar>
                {developer.name}
              </div>
              <MinusIcon
                onClick={() =>
                  setDevelopers([
                    ...developers.filter((dev) => dev.id !== developer.id),
                  ])
                }
                className="h-6 w-6 cursor-pointer hover:opacity-50"
              />
            </li>
          ))}

          <p className="mt-3 mb-3">Team members previously added to projects</p>

          {!isLoading &&
            !isError &&
            data.length > 0 &&
            data
              .filter(
                (dev) =>
                  !developers.some((d) => d.id === dev.id) &&
                  dev.id !== sessionData?.user.id
              )
              .map((developer) => (
                <li
                  key={developer.id}
                  className="mb-2 flex justify-between text-bodym"
                >
                  <div className="flex">
                    <Avatar className="mr-4 h-6 w-6">
                      <AvatarImage src={developer?.image ?? ""} />
                      <AvatarFallback>{developer.name}</AvatarFallback>
                    </Avatar>
                    {developer.name}
                  </div>
                  <PlusIcon
                    onClick={() => setDevelopers([...developers, developer])}
                    className="h-6 w-6 cursor-pointer hover:opacity-50"
                  />
                </li>
              ))}
        </div>
      </SheetContent>
    </Sheet>
  );
}
