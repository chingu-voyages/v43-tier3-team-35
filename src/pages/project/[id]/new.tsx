import { useState } from 'react';
import { type NextPage } from "next";
import Link from "next/link";
import { CheckIcon, ChevronUpDownIcon } from "@heroicons/react/24/outline"
import { api } from "~/utils/api";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, type SubmitHandler, Controller } from "react-hook-form";
import { bugSchema } from "~/validation/bugInfo";
import { cn } from "~/lib/utils"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "~/components/ui/command"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "~/components/ui/popover"

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select"


const statuses = [
  { value: "LOW", label: "Low" },
  { value: "MEDIUM", label: "Medium" },
  { value: "HIGH", label: "High" },
  { value: "CRITICAL", label: "Critical" },
]

type Inputs = {
  title: string,
  markdown: string,
  priority: string,
  projectId: string,
}

const NewBug: NextPage = () => {
  const [open, setOpen] = useState(false)

  const projects = api.project.getAll.useQuery();
  const { mutate } = api.bugs.create.useMutation({
    onSuccess: () => {
      console.log("success")
    },
    onError: () => {
      console.log("error")
    }
  });

  const { control, register, handleSubmit, formState: { errors } } = useForm<Inputs>({
    resolver: zodResolver(bugSchema),
  });


  const onSubmit: SubmitHandler<Inputs> = (data) => {
    mutate(data);
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-gray-900">
      <div className="container m-auto text-white">
        <h1 className="text-white text-5xl mb-8">Report a bug</h1>
        <form action="POST" onSubmit={handleSubmit(onSubmit)<void>}>
          <div className="flex flex-row mb-4">
            <div className="flex-auto pr-2">
              <label className="block font-medium mb-2" htmlFor="">Title</label>
              <input placeholder="" type="text" className="custom-input" {...register("title")} />
              {errors.title && <p className="text-red-500 mt-2 font-medium">{errors.title.message}</p>}
            </div>
            <div className="flex-auto px-2">
              <label className="block font-medium mb-2" htmlFor="">Project</label>
              <div>
                <Controller
                  control={control}
                  name="projectId"
                  render={({ field: { value: fieldValue, onChange } }) => (
                    <Popover open={open} onOpenChange={setOpen}>
                      <PopoverTrigger asChild>
                        <button className='custom-input text-left flex justify-between items-center'>
                          {fieldValue && projects.data
                            ? projects.data.find((project) => project.id === fieldValue)?.name
                            : "Select project..."}
                          <ChevronUpDownIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                        </button>
                      </PopoverTrigger>
                      <PopoverContent className="w-full p-0">
                        <Command>
                          <CommandInput placeholder="Search project..." />
                          <CommandEmpty>No project found.</CommandEmpty>
                          <CommandGroup>
                            {projects.data && projects.data.map((project) => (
                              <CommandItem
                                key={project.id}
                                onSelect={(currentValue) => {
                                  onChange(currentValue)
                                  setOpen(false)
                                }}
                              >
                                <CheckIcon
                                  className={cn(
                                    "mr-2 h-4 w-4",
                                    fieldValue === project.id ? "opacity-100" : "opacity-0"
                                  )}
                                />
                                {project.id}
                              </CommandItem>
                            ))}
                          </CommandGroup>
                        </Command>
                      </PopoverContent>
                    </Popover>
                  )}
                />
              </div>
              {errors.projectId && <p className="text-red-500 mt-2 font-medium">{errors.projectId.message}</p>}
            </div>
            <div className="flex-auto px-2">
              <label className="block font-medium mb-2" htmlFor="">Priority</label>
              <div className="">
                <Controller
                  control={control}
                  name="priority"
                  render={({ field: { onChange } }) => (
                    <Select onValueChange={value => {
                      onChange(value)
                    }}>
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
              {errors.priority && <p className="text-red-500 mt-2 font-medium">{errors.priority.message}</p>}
            </div>
          </div>
          <div className="mb-3">
            <label className="text-white font-medium mb-2 block" htmlFor="description">Description</label>
            <textarea id="description" className="custom-input" rows={20} {...register("markdown")}></textarea>
            {errors.markdown && <p className="text-red-500 mt-2 font-medium">{errors.markdown.message}</p>}
          </div>
          <div className="ml-auto flex justify-end">
            <Link href="/" className="btn mr-2">Cancel</Link>
            <button type="submit" className="btn-blue">Submit</button>
          </div>
        </form>
      </div >
    </main >
  );
};

export default NewBug;
