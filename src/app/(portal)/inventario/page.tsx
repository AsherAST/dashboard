import type { Metadata } from "next";
import { getInventory, getCategories } from "@/lib/products";
import { parseInventoryParams, buildInventoryUrl, buildExportUrl } from "@/lib/params";
import { formatPrice } from "@/lib/format";
import { InventoryFilters } from "@/components/InventoryFilters";
import { StockBadge } from "@/components/StockBadge";
import { Pagination } from "@/components/Pagination";
import { PageHeader, ExportButton } from "@/components/PageHeader";
import { EmptyState } from "@/components/EmptyState";
import { AlertIcon, DownloadIcon, FileIcon } from "@/components/icons";

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
      <PageHeader title="Inventario" description="Productos, stock y alertas.">
        <ExportButton href={buildExportUrl("/api/export/inventario", exportFilters)}>
          <DownloadIcon className="h-4 w-4 text-slate-400" />
          Exportar CSV
        </ExportButton>
        <ExportButton href="/api/export/pdf">
          <FileIcon className="h-4 w-4 text-slate-400" />
          Exportar PDF
        </ExportButton>
      </PageHeader>

      {lowStockCount > 0 && (
        <div className="mt-6 flex items-start gap-3 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
          <AlertIcon className="mt-0.5 h-4 w-4 shrink-0 text-amber-600" />
          <p>
            {lowStockCount}{" "}
            {lowStockCount === 1 ? "producto tiene" : "productos tienen"} stock
            igual o menor al mínimo.{" "}
            <a
              href={buildInventoryUrl({ stock: "bajo" })}
              className="font-semibold text-amber-700 underline underline-offset-2 hover:text-amber-900"
            >
              Ver
            </a>
          </p>
        </div>
      )}

      <div className="mt-6">
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
          <p className="mt-5 text-sm text-slate-500">
            <span className="font-semibold text-slate-700">{total}</span>{" "}
            producto{total !== 1 ? "s" : ""}
          </p>
          <div className="mt-3 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm shadow-slate-200/60">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-slate-200 bg-slate-50 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                    <th className="px-4 py-3">SKU</th>
                    <th className="px-4 py-3">Producto</th>
                    <th className="px-4 py-3">Categoría</th>
                    <th className="px-4 py-3 text-right">Precio</th>
                    <th className="px-4 py-3 text-right">Costo</th>
                    <th className="px-4 py-3 text-right">Stock</th>
                    <th className="px-4 py-3 text-right">Mínimo</th>
                    <th className="px-4 py-3">Estado</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {items.map((p) => (
                    <tr key={p.id} className="transition-colors hover:bg-indigo-50/40">
                      <td className="px-4 py-3 font-mono text-xs text-slate-500">
                        {p.sku}
                      </td>
                      <td className="px-4 py-3 font-medium text-slate-900">
                        {p.name}
                      </td>
                      <td className="px-4 py-3 text-slate-600">{p.category}</td>
                      <td className="px-4 py-3 text-right font-medium text-slate-900">
                        {formatPrice(p.price)}
                      </td>
                      <td className="px-4 py-3 text-right text-slate-500">
                        {formatPrice(p.cost)}
                      </td>
                      <td className="px-4 py-3 text-right font-semibold">
                        <span
                          className={
                            p.stock === 0
                              ? "text-red-600"
                              : p.stock <= p.stockMin
                                ? "text-amber-600"
                                : "text-slate-900"
                          }
                        >
                          {p.stock}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-right text-slate-500">
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
          </div>
          <Pagination page={page} totalPages={totalPages} buildHref={paginationLink} />
        </>
      ) : (
        <EmptyState message="No se encontraron productos con esos filtros." />
      )}
    </div>
  );
}
