import { orderStatusInfo } from "@/lib/format";

export function OrderStatusBadge({ status }: { status: string }) {
  const info = orderStatusInfo(status);
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium ring-1 ring-inset ${info.className}`}
    >
      <span className={`h-1.5 w-1.5 rounded-full ${info.dot}`} />
      {info.label}
    </span>
  );
}
