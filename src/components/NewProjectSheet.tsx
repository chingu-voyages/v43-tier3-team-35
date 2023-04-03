import React, { useState, useEffect } from "react";
import { api } from "~/utils/api";
import { Avatar, AvatarFallback, AvatarImage } from "~/components/Avatar";
import PlusIcon from "@heroicons/react/24/outline/PlusIcon";
import MinusIcon from "@heroicons/react/24/outline/MinusIcon";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "~/components/ui/sheet";

type DeveloperType = {
  id: string;
  name: string | null;
  image: string | null;
};

export default function NewProjectSheet() {
  const { data, isLoading, isError } = api.user.getAllDevelopers.useQuery();
  const [projectName, setProjectName] = useState("");
  const [developers, setDevelopers] = useState<DeveloperType[]>([]);

  return (
    <Sheet>
      <SheetTrigger>New project</SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Add New Project</SheetTitle>
        </SheetHeader>
        <form>
          <input type="text" /> Title
          <input type="text" /> Invite developers
          <button type="submit">Create project</button>
        </form>

        <p>Developers list</p>

        {developers.map((developer) => (
          <li key={developer.id} className="flex justify-between text-bodym">
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

        <p>Team members previously added to projects</p>

        {!isLoading &&
          !isError &&
          data.length > 0 &&
          data
            .filter((dev) => !developers.some((d) => d.id === dev.id))
            .map((developer) => (
              <li
                key={developer.id}
                className="flex justify-between text-bodym"
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
      </SheetContent>
    </Sheet>
  );
}
