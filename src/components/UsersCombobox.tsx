import { useDebounce } from "~/lib/utils";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "./Command";
import { Popover, PopoverContent } from "./Popover";
import { PopoverAnchor } from "@radix-ui/react-popover";
import { api } from "~/utils/api";
import { useState } from "react";

export default function UsersCombobox({ projectId }: { projectId: string }) {
  const utils = api.useContext();
  const [searchFor, setSearchfor] = useState("");
  const [selectedDev, setSelecteDev] = useState<{
    name: string | null;
    id: string;
    image: string | null;
  } | null>(null);
  const { mutate: addMutate } = api.project.addDev.useMutation({
    async onMutate(newDev) {
      await utils.project.getTeam.cancel();
      const prevData = utils.project.getTeam.getData();
      utils.project.getTeam.setData({ projectId }, (old) => {
        if (old && selectedDev && selectedDev.id === newDev.devId)
          return {
            ...old,
            developers: old.developers.concat(selectedDev),
          };
      });
      setSelecteDev(null);
      setSearchfor("");
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
  const debouncedSearchFor = useDebounce(
    (value: string) => setSearchfor(value),
    500
  );
  const { data, isFetching } = api.user.findByText.useQuery(
    {
      searchFor,
      projectId,
    },
    {
      enabled: searchFor.length > 2,
    }
  );
  return (
    <Command>
      <Popover
        open={searchFor.length > 0}
        onOpenChange={(open) => {
          if (!open) setSearchfor("");
        }}
      >
        <PopoverAnchor>
          <CommandInput
            onValueChange={(value) => {
              void debouncedSearchFor(value);
            }}
            placeholder="Search for developer..."
          />
        </PopoverAnchor>
        <PopoverContent
          onOpenAutoFocus={(e) => e.preventDefault()}
          className="w-80 bg-blue-500 p-0"
        >
          <CommandEmpty className="p-4 text-hxs text-white">
            {isFetching ? "Loading..." : "No Users found."}
          </CommandEmpty>

          <CommandGroup>
            {data &&
              data.map((developer) => (
                <CommandItem
                  key={developer.id}
                  onSelect={() => {
                    setSelecteDev(developer);
                    addMutate({
                      devId: developer.id,
                      projectId,
                    });
                  }}
                >
                  {developer.name}
                </CommandItem>
              ))}
          </CommandGroup>
        </PopoverContent>
      </Popover>
    </Command>
  );
}
