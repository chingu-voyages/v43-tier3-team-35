import { forwardRef } from "react";
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
import { cn, getNameLetters } from "~/lib/utils";
import { MinusIcon } from "@heroicons/react/24/outline";

export default function ProjectDevsSettings({
  projectId,
  children,
}: {
  children: ReactNode;
  projectId: string;
}) {
  const utils = api.useContext();
  const { data } = api.project.getTeam.useQuery({ projectId });
  const { mutate: addMutate, isLoading } = api.project.addDev.useMutation({
    onSettled() {
      void utils.project.getDetails.invalidate();
      void utils.project.getTeam.invalidate();
    },
  });
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
          <h3 className="my-4 text-hxs text-white">Add new developer</h3>
          <div className="">
            <p className="text-xs text-white">
              this will be replaced later with a combobox{" "}
              {isLoading && "loading ..."}
            </p>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                const formData = new FormData(e.currentTarget);
                const email = formData.get("email") as string;
                addMutate({ projectId, email });
              }}
            >
              <Input
                name="email"
                type="email"
                placeholder="New developer email"
                className="mt-2 mb-4"
              />
            </form>
          </div>
          <h3 className="my-4 text-hxs text-white">Team Members</h3>
          <ul className="space-y-3  pt-4">
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
          </ul>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
}

// TO BE REPLACED WITH COMBOBOX
const Input = forwardRef<
  HTMLInputElement,
  React.InputHTMLAttributes<HTMLInputElement>
>(({ className, ...props }, ref) => {
  return (
    <input
      className={cn(
        "flex h-10 w-full rounded-md border border-slate-300 bg-transparent py-2 px-3 text-sm placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 dark:border-slate-700 dark:text-slate-50 dark:focus:ring-slate-400 dark:focus:ring-offset-slate-900",
        className
      )}
      ref={ref}
      {...props}
    />
  );
});
Input.displayName = "Input";
