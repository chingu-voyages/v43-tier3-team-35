import { useState } from "react";
import { type NextPage } from "next";
import Link from "next/link";
import { CheckIcon, ChevronUpDownIcon } from "@heroicons/react/24/outline";
import { api } from "~/utils/api";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, type SubmitHandler, Controller } from "react-hook-form";
import { bugSchema } from "~/validation/bugInfo";
import { cn } from "~/lib/utils";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "~/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "~/components/ui/popover";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";
import { useRouter } from "next/router";
import type { Priority } from "@prisma/client";

const statuses = [
  { value: "LOW", label: "Low" },
  { value: "MEDIUM", label: "Medium" },
  { value: "HIGH", label: "High" },
  { value: "CRITICAL", label: "Critical" },
];

type Inputs = {
  title: string;
  markdown: string;
  priority: Priority;
  projectId: string;
};

const NewBug: NextPage = () => {
  const [open, setOpen] = useState(false);
  const {
    query: { id },
    push,
  } = useRouter();
  const projects = api.project.getTitles.useQuery();
  const isValidProject = projects.data?.some((project) => project.id === id);
  const { mutate } = api.bug.create.useMutation({
    onSuccess: () => {
      console.log("success");
    },
    onError: () => {
      console.log("error");
    },
  });

  const {
    control,
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<Inputs>({
    resolver: zodResolver(bugSchema),
  });

  const onSubmit: SubmitHandler<Inputs> = (data) => {
    mutate(data);
    void push(`/project/${id as string}`);
  };
  if (projects.isLoading) return <div className="">loading...</div>;
  if (!isValidProject) return <div className="">error</div>;
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-gray-900">
      <div className="container m-auto text-white">
        <h1 className="mb-8 text-5xl text-white">Report a bug</h1>
        {/* eslint-disable-next-line @typescript-eslint/no-misused-promises */}
        <form action="POST" onSubmit={handleSubmit(onSubmit)}>
          <div className="mb-4 flex flex-row">
            <div className="flex-auto pr-2">
              <label className="mb-2 block font-medium" htmlFor="">
                Title
              </label>
              <input
                placeholder=""
                type="text"
                className="custom-input"
                {...register("title")}
              />
              {errors.title && (
                <p className="mt-2 font-medium text-red-500">
                  {errors.title.message}
                </p>
              )}
            </div>
            <div className="flex-auto px-2">
              <label className="mb-2 block font-medium" htmlFor="">
                Project
              </label>
              <div>
                <Controller
                  control={control}
                  name="projectId"
                  defaultValue={id as string}
                  render={({ field: { value: fieldValue, onChange } }) => (
                    <Popover open={open} onOpenChange={setOpen}>
                      <PopoverTrigger asChild>
                        <button className="custom-input flex items-center justify-between text-left">
                          {fieldValue && projects.data
                            ? projects.data.find(
                                (project) => project.id === fieldValue
                              )?.name
                            : "Select project..."}
                          <ChevronUpDownIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                        </button>
                      </PopoverTrigger>
                      <PopoverContent className="w-full p-0">
                        <Command>
                          <CommandInput placeholder="Search project..." />
                          <CommandEmpty>No project found.</CommandEmpty>
                          <CommandGroup>
                            {projects.data &&
                              projects.data.map((project) => (
                                <CommandItem
                                  key={project.id}
                                  value={project.id}
                                  onSelect={(currentValue) => {
                                    onChange(currentValue);
                                    setOpen(false);
                                  }}
                                >
                                  <CheckIcon
                                    className={cn(
                                      "mr-2 h-4 w-4",
                                      fieldValue === project.id
                                        ? "opacity-100"
                                        : "opacity-0"
                                    )}
                                  />
                                  {project.name}
                                </CommandItem>
                              ))}
                          </CommandGroup>
                        </Command>
                      </PopoverContent>
                    </Popover>
                  )}
                />
              </div>
              {errors.projectId && (
                <p className="mt-2 font-medium text-red-500">
                  {errors.projectId.message}
                </p>
              )}
            </div>
            <div className="flex-auto px-2">
              <label className="mb-2 block font-medium" htmlFor="">
                Priority
              </label>
              <div className="">
                <Controller
                  control={control}
                  name="priority"
                  render={({ field: { onChange } }) => (
                    <Select
                      onValueChange={(value) => {
                        onChange(value);
                      }}
                    >
                      <SelectTrigger className="custom-input h-full">
                        <SelectValue placeholder="Select priority..." />
                      </SelectTrigger>
                      <SelectContent>
                        {statuses.map((status) => (
                          <SelectItem key={status.value} value={status.value}>
                            {status.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                />
              </div>
              {errors.priority && (
                <p className="mt-2 font-medium text-red-500">
                  {errors.priority.message}
                </p>
              )}
            </div>
          </div>
          <div className="mb-3">
            <label
              className="mb-2 block font-medium text-white"
              htmlFor="description"
            >
              Description
            </label>
            <textarea
              id="description"
              className="custom-input"
              rows={20}
              {...register("markdown")}
            ></textarea>
            {errors.markdown && (
              <p className="mt-2 font-medium text-red-500">
                {errors.markdown.message}
              </p>
            )}
          </div>
          <div className="ml-auto flex justify-end">
            <Link href="/" className="btn mr-2">
              Cancel
            </Link>
            <button type="submit" className="btn-blue">
              Submit
            </button>
          </div>
        </form>
      </div>
    </main>
  );
};

export default NewBug;
