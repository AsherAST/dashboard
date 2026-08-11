"use client";

import { useRouter } from "next/navigation";
import { buildOrdersUrl } from "@/lib/params";
import { SearchIcon } from "@/components/icons";
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

const selectClass =
  "rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-700 shadow-sm outline-none transition-colors focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100";

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
    <div className="flex flex-col gap-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm shadow-slate-200/60 lg:flex-row lg:items-center">
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
        <div className="relative min-w-0 flex-1">
          <SearchIcon className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <input
            name="q"
            defaultValue={search}
            placeholder="Buscar cliente, correo o pedido…"
            className="w-full rounded-lg border border-slate-300 bg-white py-2 pl-9 pr-3 text-sm text-slate-700 shadow-sm outline-none transition-colors placeholder:text-slate-400 focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100"
          />
        </div>
        <button
          type="submit"
          className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm transition-colors hover:bg-indigo-500"
        >
          Buscar
        </button>
      </form>
      <div className="flex flex-wrap gap-2">
        <select
          name="estado"
          defaultValue={status ?? ""}
          onChange={(e) => apply({ estado: e.target.value })}
          className={selectClass}
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
          className={selectClass}
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
