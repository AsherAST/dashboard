"use client";

import {
  Cell,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
} from "recharts";
import type { StatusCount } from "@/lib/stats";
import { orderStatusInfo } from "@/lib/format";

const COLORS: Record<string, string> = {
  PENDING: "#f59e0b",
  PAID: "#0ea5e9",
  SHIPPED: "#6366f1",
  DELIVERED: "#10b981",
  CANCELLED: "#ef4444",
};

export function OrdersPieChart({ data }: { data: StatusCount[] }) {
  return (
    <ResponsiveContainer width="100%" height={260}>
      <PieChart>
        <Pie
          data={data}
          dataKey="count"
          nameKey="status"
          innerRadius={50}
          outerRadius={90}
          paddingAngle={2}
          strokeWidth={2}
        >
          {data.map((entry) => (
            <Cell key={entry.status} fill={COLORS[entry.status] ?? "#18181b"} />
          ))}
        </Pie>
        <Tooltip
          formatter={(value, _name, entry) => [
            `${Number(value)} pedido${Number(value) !== 1 ? "s" : ""}`,
            orderStatusInfo(
              (entry?.payload as { status?: string } | undefined)?.status ?? "",
            ).label,
          ]}
          contentStyle={{ borderRadius: 8, border: "1px solid #e4e4e7", fontSize: 12 }}
        />
        <Legend
          formatter={(value: string) => orderStatusInfo(value).label}
          iconType="circle"
          iconSize={8}
          wrapperStyle={{ fontSize: 12 }}
        />
      </PieChart>
    </ResponsiveContainer>
  );
}