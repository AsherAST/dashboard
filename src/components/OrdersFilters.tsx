"use client";

import { useRouter } from "next/navigation";
import { buildOrdersUrl } from "@/lib/params";
import { OrderStatus } from "@/generated/prisma/enums";
import type { OrdersSort } from "@/lib/orders";

type Props = {
  search?: string;
  status?: OrderStatus;
  sort?: OrdersSort;
};

const SORT_OPTIONS: { value: string; label: string }[] = [
  { value: "recent", label: "Más recientes" },
  { value: "oldest", label: "Más antiguos" },
  { value: "total-desc", label: "Mayor total" },
  { value: "total-asc", label: "Menor total" },
];

const STATUS_OPTIONS: { value: string; label: string }[] = [
  { value: "", label: "Todos los estados" },
  { value: OrderStatus.PENDING, label: "Pendiente" },
  { value: OrderStatus.PAID, label: "Pagado" },
  { value: OrderStatus.SHIPPED, label: "Enviado" },
  { value: OrderStatus.DELIVERED, label: "Entregado" },
  { value: OrderStatus.CANCELLED, label: "Cancelado" },
];

export function OrdersFilters({ search, status, sort }: Props) {
  const router = useRouter();

  function apply(overrides: Record<string, string>) {
    const next = {
      q: search ?? "",
      estado: status ?? "",
      orden: sort ?? "",
      ...overrides,
    };
    router.replace(
      buildOrdersUrl({
        q: next.q.trim() || undefined,
        estado: next.estado || undefined,
        orden: next.orden || undefined,
      }),
      { scroll: false },
    );
  }

  return (
    <div className="flex flex-col gap-3 lg:flex-row lg:items-end">
      <form
        className="flex flex-1 gap-2"
        onSubmit={(e) => {
          e.preventDefault();
          const form = new FormData(e.currentTarget);
          apply({
            q: String(form.get("q") ?? ""),
            estado: String(form.get("estado") ?? ""),
            orden: String(form.get("orden") ?? ""),
          });
        }}
      >
        <input
          name="q"
          defaultValue={search}
          placeholder="Buscar cliente, correo o pedido…"
          className="min-w-0 flex-1 rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm outline-none focus:border-zinc-500"
        />
        <button
          type="submit"
          className="rounded-lg bg-zinc-900 px-4 py-2 text-sm text-white transition-colors hover:bg-zinc-700"
        >
          Buscar
        </button>
      </form>
      <div className="flex flex-wrap gap-2">
        <select
          name="estado"
          defaultValue={status ?? ""}
          onChange={(e) => apply({ estado: e.target.value })}
          className="rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm outline-none focus:border-zinc-500"
        >
          {STATUS_OPTIONS.map((s) => (
            <option key={s.value} value={s.value}>
              {s.label}
            </option>
          ))}
        </select>
        <select
          name="orden"
          defaultValue={sort ?? "recent"}
          onChange={(e) => apply({ orden: e.target.value })}
          className="rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm outline-none focus:border-zinc-500"
        >
          {SORT_OPTIONS.map((s) => (
            <option key={s.value} value={s.value}>
              {s.label}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}