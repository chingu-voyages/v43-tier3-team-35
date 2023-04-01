import { NoResultsSVG } from "../SVG";

export default function EmptyState() {
  return (
    <div className="mt-6 flex h-[80%] flex-col items-center justify-center rounded-2xl bg-slate-800 text-center">
      <NoResultsSVG />

      <h2 className="mt-6 mb-3 text-hm font-semibold">
        No Bugs Here: Keep up the Great Work!
      </h2>
      <p className="max-w-md text-sm text-white text-opacity-70">
        No bugs match the selected filters for this project at the moment. Keep
        up the good work, and don&apos;t hesitate to adjust the filters or
        report any new bugs that may arise.
      </p>
    </div>
  );
}
