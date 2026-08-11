type IconType = React.ComponentType<{ className?: string }>;

const ACCENTS = {
  indigo: {
    icon: "bg-indigo-50 text-indigo-600 ring-1 ring-inset ring-indigo-100",
    bar: "from-indigo-500/10",
  },
  emerald: {
    icon: "bg-emerald-50 text-emerald-600 ring-1 ring-inset ring-emerald-100",
    bar: "from-emerald-500/10",
  },
  amber: {
    icon: "bg-amber-50 text-amber-600 ring-1 ring-inset ring-amber-100",
    bar: "from-amber-500/10",
  },
  violet: {
    icon: "bg-violet-50 text-violet-600 ring-1 ring-inset ring-violet-100",
    bar: "from-violet-500/10",
  },
} as const;

export function StatCard({
  label,
  value,
  hint,
  icon,
  accent = "indigo",
}: {
  label: string;
  value: string;
  hint?: string;
  icon: IconType;
  accent?: keyof typeof ACCENTS;
}) {
  const Icon = icon;
  const tone = ACCENTS[accent];

  return (
    <div className="relative overflow-hidden rounded-2xl border border-slate-200 bg-white p-5 shadow-sm shadow-slate-200/60 transition-all hover:-translate-y-0.5 hover:shadow-md">
      <div
        className={`pointer-events-none absolute inset-x-0 top-0 h-0.5 bg-gradient-to-r ${tone.bar} to-transparent`}
      />
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
            {label}
          </p>
          <p className="mt-2 text-2xl font-bold tracking-tight text-slate-900">
            {value}
          </p>
          {hint ? <p className="mt-1 text-xs text-slate-400">{hint}</p> : null}
        </div>
        <div
          className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${tone.icon}`}
        >
          <Icon className="h-5 w-5" />
        </div>
      </div>
    </div>
  );
}
