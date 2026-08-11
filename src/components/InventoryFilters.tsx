"use client";

import { useRouter } from "next/navigation";
import { buildInventoryUrl } from "@/lib/params";
import type { InventorySort, StockState } from "@/lib/products";

type Props = {
  search?: string;
  category?: string;
  stockState?: StockState;
  sort?: InventorySort;
  categories: string[];
};

const SORT_OPTIONS: { value: string; label: string }[] = [
  { value: "", label: "Más recientes" },
  { value: "name-asc", label: "Nombre (A-Z)" },
  { value: "price-desc", label: "Mayor precio" },
  { value: "stock-asc", label: "Menor stock" },
];

export function InventoryFilters({ search, category, stockState, sort, categories }: Props) {
  const router = useRouter();

  function apply(overrides: Record<string, string>) {
    const next = {
      q: search ?? "",
      categoria: category ?? "",
      stock: stockState ?? "",
      orden: sort ?? "",
      ...overrides,
    };
    router.replace(
      buildInventoryUrl({
        q: next.q.trim() || undefined,
        categoria: next.categoria || undefined,
        stock: next.stock || undefined,
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
            categoria: String(form.get("categoria") ?? ""),
            stock: String(form.get("stock") ?? ""),
            orden: String(form.get("orden") ?? ""),
          });
        }}
      >
        <input
          name="q"
          defaultValue={search}
          placeholder="Buscar por nombre o SKU…"
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
          name="categoria"
          defaultValue={category ?? ""}
          onChange={(e) => apply({ categoria: e.target.value })}
          className="rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm outline-none focus:border-zinc-500"
        >
          <option value="">Todas las categorías</option>
          {categories.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
        <select
          name="stock"
          defaultValue={stockState ?? ""}
          onChange={(e) => apply({ stock: e.target.value })}
          className="rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm outline-none focus:border-zinc-500"
        >
          <option value="">Todo el stock</option>
          <option value="bajo">Con stock bajo</option>
          <option value="agotado">Agotados</option>
        </select>
        <select
          name="orden"
          defaultValue={sort ?? ""}
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