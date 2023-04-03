import type { ReactNode } from "react";
import { api } from "~/utils/api";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "~/components/Dialog";
import { Avatar, AvatarFallback, AvatarImage } from "~/components/Avatar";
import { getNameLetters } from "~/lib/utils";
import { MinusIcon } from "@heroicons/react/24/outline";
import UsersCombobox from "./UsersCombobox";

export default function ProjectDevsSettings({
  projectId,
  children,
}: {
  children: ReactNode;
  projectId: string;
}) {
  const utils = api.useContext();
  const { data } = api.project.getTeam.useQuery({ projectId });

  const { mutate: removeMutate } = api.project.removeDev.useMutation({
    async onMutate(newStatus) {
      await utils.project.getTeam.cancel();
      const prevData = utils.project.getTeam.getData();
      utils.project.getTeam.setData({ projectId }, (old) => {
        if (old)
          return {
            ...old,
            developers: old.developers.filter(
              (dev) => dev.id !== newStatus.devId
            ),
          };
      });

      return { prevData };
    },
    onError(err, newStatus, ctx) {
      utils.project.getTeam.setData({ projectId }, ctx?.prevData);
    },
    onSettled() {
      void utils.project.getDetails.invalidate();
      void utils.project.getTeam.invalidate();
    },
  });
  return (
    <Dialog>
      <DialogTrigger>{children}</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="text-2xl">Manage Team </DialogTitle>
          <h3 className="pt-6 text-hxs text-white">Add new developer</h3>
          <div className="w-80">
            <UsersCombobox projectId={projectId} />
          </div>
          <h3 className="pt-6 text-hxs text-white">Team Members</h3>
          <ul className=" space-y-3 pt-2">
            {data?.developers.map((developer) => (
              <li
                key={developer.id}
                className="flex justify-between text-bodys text-white"
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
                <button
                  onClick={() =>
                    removeMutate({ projectId, devId: developer.id })
                  }
                  aria-label={`Remove to ${developer?.name ?? ""} `}
                >
                  <MinusIcon
                    aria-hidden
                    className="h-6 w-6 cursor-pointer transition duration-200 hover:opacity-50"
                  />
                </button>
              </li>
            ))}
            {data?.developers.length === 0 && (
              <li className="text-bodys text-white text-opacity-75">
                No developers are currently assigned to this project.
              </li>
            )}
          </ul>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
}
