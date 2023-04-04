import type { Dispatch, SetStateAction } from "react";

export type selectedPrioritiesType = ("CRITICAL" | "HIGH" | "MEDIUM" | "LOW")[];

export default function PriorityButton({
  value,
  color,
  isSelected,
  setSelectedPriorities,
  count,
}: {
  count: number;
  value: "CRITICAL" | "HIGH" | "MEDIUM" | "LOW";
  color: string;
  isSelected: boolean;
  setSelectedPriorities: Dispatch<SetStateAction<selectedPrioritiesType>>;
}) {
  return (
    <li
      className={`flex justify-between transition duration-300 hover:opacity-50 ${
        isSelected ? "" : "opacity-20"
      }`}
    >
      <div className="flex items-center">
        <div className={`${color} mr-4 h-2 w-2 rounded-full`}></div>
        <button
          onClick={() => {
            if (isSelected) {
              setSelectedPriorities((selectedPriorities) =>
                selectedPriorities.filter((item) => item !== value)
              );
            } else {
              setSelectedPriorities((selectedPriorities) =>
                selectedPriorities.concat(value)
              );
            }
          }}
          className="text-hxs capitalize"
        >
          {value.toLowerCase()}
        </button>
      </div>
      <div className="text-hxs">{count}</div>
    </li>
  );
}
