import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import type { Dispatch, SetStateAction } from "react";
import { getBugSortLabel, allSortingTypes } from "~/utils/sorting";
import type { bugSortingType } from "~/utils/sorting";

const SortDropdown = ({
  sort,
  setSort,
}: {
  sort: bugSortingType;
  setSort: Dispatch<SetStateAction<bugSortingType>>;
}) => {
  return (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger asChild>
        <button className={`hover:underline`}>
          Sort by: <span className="capitalize">{sort}</span>
        </button>
      </DropdownMenu.Trigger>

      <DropdownMenu.Portal className={``}>
        <DropdownMenu.Content className="my-4  rounded-lg border border-white border-opacity-10 bg-gray-800 p-3  font-medium text-white">
          <DropdownMenu.RadioGroup>
            {allSortingTypes.map((sortType) => (
              <DropdownMenu.RadioItem
                key={sortType}
                value={sortType}
                onSelect={() => setSort(sortType)}
                className={`my-1 cursor-pointer  capitalize outline-none transition hover:text-gray-500`}
              >
                {getBugSortLabel(sortType)}
              </DropdownMenu.RadioItem>
            ))}
          </DropdownMenu.RadioGroup>
        </DropdownMenu.Content>
      </DropdownMenu.Portal>
    </DropdownMenu.Root>
  );
};

export default SortDropdown;
