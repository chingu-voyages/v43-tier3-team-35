import type { ReactNode } from "react";

export default function SidebarCard({
  title,
  children,
  topRight,
  className = "",
}: {
  title: string;
  className?: string;
  children: ReactNode;
  topRight?: ReactNode;
}) {
  return (
    <div className="mb-6 rounded-xl bg-slate-800 px-6 py-4">
      <div className="mb-4 flex items-center justify-between">
        <h2 className=" text-hs">{title}</h2>
        {topRight}
      </div>
      <ul className={className}>{children}</ul>
    </div>
  );
}
