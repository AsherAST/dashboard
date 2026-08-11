"use client";

import { useRouter } from "next/navigation";
import { buildInventoryUrl } from "@/lib/params";
import { SearchIcon } from "@/components/icons";
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

const selectClass =
  "rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-700 shadow-sm outline-none transition-colors focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100";

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
    <div className="flex flex-col gap-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm shadow-slate-200/60 lg:flex-row lg:items-center">
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
        <div className="relative min-w-0 flex-1">
          <SearchIcon className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <input
            name="q"
            defaultValue={search}
            placeholder="Buscar por nombre o SKU…"
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
          name="categoria"
          defaultValue={category ?? ""}
          onChange={(e) => apply({ categoria: e.target.value })}
          className={selectClass}
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
          className={selectClass}
        >
          <option value="">Todo el stock</option>
          <option value="bajo">Con stock bajo</option>
          <option value="agotado">Agotados</option>
        </select>
        <select
          name="orden"
          defaultValue={sort ?? ""}
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
