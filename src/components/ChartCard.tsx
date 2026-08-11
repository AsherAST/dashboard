export function ChartCard({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-xl border border-zinc-200 bg-white p-5">
      <h2 className="text-sm font-semibold text-neutral-900">{title}</h2>
      {subtitle ? (
        <p className="mt-0.5 text-xs text-zinc-500">{subtitle}</p>
      ) : null}
      <div className="mt-4">{children}</div>
    </div>
  );
}