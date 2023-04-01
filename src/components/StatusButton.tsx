import type { Dispatch, SetStateAction } from "react";
import { forwardRef } from "react";

export type selectedStatusType = (
  | "UNASSIGNED"
  | "TODO"
  | "INPROGRESS"
  | "TESTING"
  | "CLOSED"
)[];

interface StatusButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  isSelected: boolean;
  setSelectedStatus: Dispatch<SetStateAction<selectedStatusType>>;
  statusValue: "UNASSIGNED" | "TODO" | "INPROGRESS" | "TESTING" | "CLOSED";
}

const StatusButton = forwardRef<HTMLButtonElement, StatusButtonProps>(
  (
    { className, isSelected, setSelectedStatus, statusValue, ...props },
    ref
  ) => {
    return (
      <button
        ref={ref}
        onClick={() => {
          if (isSelected) {
            setSelectedStatus((selectedStatus) =>
              selectedStatus.filter((item) => item !== statusValue)
            );
          } else {
            setSelectedStatus((selectedStatus) =>
              selectedStatus.concat(statusValue)
            );
          }
        }}
        {...props}
        className={
          "rounded-[10px] px-3  py-2 text-[0.8125rem] font-bold capitalize transition duration-300 hover:bg-slate-700 " +
          (isSelected
            ? "bg-slate-900 "
            : "bg-slate-600 text-slate-900 hover:text-white" +
              (className || ""))
        }
      />
    );
  }
);

StatusButton.displayName = "Status Button";

export default StatusButton;
