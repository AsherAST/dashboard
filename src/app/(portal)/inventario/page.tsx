import type { Metadata } from "next";
import { getInventory, getCategories } from "@/lib/products";
import { parseInventoryParams, buildInventoryUrl, buildExportUrl } from "@/lib/params";
import { formatPrice } from "@/lib/format";
import { InventoryFilters } from "@/components/InventoryFilters";
import { StockBadge } from "@/components/StockBadge";
import { Pagination } from "@/components/Pagination";

export const metadata: Metadata = {
  title: "Inventario | Dashboard",
  description: "Gestión de inventario con búsqueda, filtros y stock bajo.",
};

export const dynamic = "force-dynamic";

export default async function InventarioPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const query = parseInventoryParams(await searchParams);
  const page = query.page ?? 1;
  const [data, categories] = await Promise.all([
    getInventory(query),
    getCategories(),
  ]);
  const { items, total, totalPages, lowStockCount } = data;

  const paginationLink = (p: number) =>
    buildInventoryUrl({
      q: query.search,
      categoria: query.category,
      stock: query.stockState,
      orden: query.sort,
      pagina: p > 1 ? String(p) : undefined,
    });

  const exportFilters = {
    q: query.search,
    categoria: query.category,
    stock: query.stockState,
  };

  return (
    <div>
      <h1 className="text-xl font-semibold text-neutral-900">Inventario</h1>
      <div className="flex items-center justify-between gap-4">
        <p className="mt-1 text-sm text-zinc-500">
          Productos, stock y alertas.
        </p>
        <div className="flex gap-2">
          <a
            href={buildExportUrl("/api/export/inventario", exportFilters)}
            className="rounded-lg border border-zinc-300 bg-white px-3 py-1.5 text-sm transition-colors hover:border-zinc-500"
          >
            Exportar CSV
          </a>
          <a
            href="/api/export/pdf"
            className="rounded-lg border border-zinc-300 bg-white px-3 py-1.5 text-sm transition-colors hover:border-zinc-500"
          >
            Exportar PDF
          </a>
        </div>
      </div>

      {lowStockCount > 0 && (
        <div className="mt-4 rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-700">
          ⚠️ {lowStockCount}{" "}
          {lowStockCount === 1 ? "producto tiene" : "productos tienen"} stock
          igual o menor al mínimo.{" "}
          <a
            href={buildInventoryUrl({ stock: "bajo" })}
            className="font-medium underline"
          >
            Ver
          </a>
        </div>
      )}

      <div className="mt-4">
        <InventoryFilters
          search={query.search}
          category={query.category}
          stockState={query.stockState}
          sort={query.sort}
          categories={categories}
        />
      </div>

      {items.length > 0 ? (
        <>
          <p className="mt-5 text-sm text-zinc-500">
            {total} producto{total !== 1 ? "s" : ""}
          </p>
          <div className="mt-3 overflow-x-auto rounded-xl border border-zinc-200 bg-white">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-zinc-200 text-left text-xs uppercase tracking-wide text-zinc-400">
                  <th className="px-4 py-3 font-medium">SKU</th>
                  <th className="px-4 py-3 font-medium">Producto</th>
                  <th className="px-4 py-3 font-medium">Categoría</th>
                  <th className="px-4 py-3 text-right font-medium">Precio</th>
                  <th className="px-4 py-3 text-right font-medium">Costo</th>
                  <th className="px-4 py-3 text-right font-medium">Stock</th>
                  <th className="px-4 py-3 text-right font-medium">Mínimo</th>
                  <th className="px-4 py-3 font-medium">Estado</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-100">
                {items.map((p) => (
                  <tr key={p.id} className="hover:bg-zinc-50">
                    <td className="px-4 py-3 font-mono text-xs text-zinc-500">
                      {p.sku}
                    </td>
                    <td className="px-4 py-3 font-medium text-neutral-900">
                      {p.name}
                    </td>
                    <td className="px-4 py-3 text-zinc-600">{p.category}</td>
                    <td className="px-4 py-3 text-right text-zinc-900">
                      {formatPrice(p.price)}
                    </td>
                    <td className="px-4 py-3 text-right text-zinc-500">
                      {formatPrice(p.cost)}
                    </td>
                    <td className="px-4 py-3 text-right font-medium">
                      <span className={p.stock === 0 ? "text-red-600" : p.stock <= p.stockMin ? "text-amber-600" : "text-zinc-900"}>
                        {p.stock}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right text-zinc-500">
                      {p.stockMin}
                    </td>
                    <td className="px-4 py-3">
                      <StockBadge stock={p.stock} stockMin={p.stockMin} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <Pagination page={page} totalPages={totalPages} buildHref={paginationLink} />
        </>
      ) : (
        <p className="mt-12 text-center text-zinc-500">
          No se encontraron productos con esos filtros.
        </p>
      )}
    </div>
  );
}