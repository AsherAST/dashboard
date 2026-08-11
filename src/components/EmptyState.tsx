import { BoxIcon } from "@/components/icons";

export function EmptyState({ message }: { message: string }) {
  return (
    <div className="mt-12 flex flex-col items-center gap-3 rounded-2xl border border-dashed border-slate-300 bg-white/60 py-16 text-center">
      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-slate-100 text-slate-400">
        <BoxIcon className="h-6 w-6" />
      </div>
      <p className="text-sm font-medium text-slate-600">{message}</p>
    </div>
  );
}
