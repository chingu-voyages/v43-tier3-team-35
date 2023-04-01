import type { ReactNode } from "react";

export default function SidebarCard({
  title,
  children,
  className = "",
}: {
  title: string;
  className?: string;
  children: ReactNode;
}) {
  return (
    <div className="mb-6 rounded-xl bg-slate-800 px-6 py-4">
      <h2 className="mb-4 text-hs">{title}</h2>
      <ul className={className}>{children}</ul>
    </div>
  );
}
