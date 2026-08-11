import { orderStatusInfo } from "@/lib/format";

export function OrderStatusBadge({ status }: { status: string }) {
  const info = orderStatusInfo(status);
  return (
    <span
      className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${info.className}`}
    >
      {info.label}
    </span>
  );
}