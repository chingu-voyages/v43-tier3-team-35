import React from "react";
import { api } from "~/utils/api";
import { Avatar, AvatarFallback, AvatarImage } from "~/components/Avatar";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "~/components/ui/sheet";

export default function NewProjectSheet() {
  const { data, isLoading, isError } = api.user.getAllDevelopers.useQuery();

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

        <p>Team members previously added to projects</p>

        {!isLoading &&
          !isError &&
          data.length > 0 &&
          data.map((developer) => (
            <li key={developer.id} className="flex justify-between text-bodym">
              <div className="flex">
                <Avatar className="mr-4 h-6 w-6">
                  <AvatarImage src={developer?.image ?? ""} />
                  <AvatarFallback>{developer.name}</AvatarFallback>
                </Avatar>
                {developer.name}
              </div>
              {/* {sessionData?.user.id === data.owner.id && (
              <AssignBugsToDev developer={developer}>
                <PlusIcon className="h-6 w-6 cursor-pointer hover:opacity-50" />
              </AssignBugsToDev>
            )} */}
            </li>
          ))}
      </SheetContent>
    </Sheet>
  );
}
