import type { Metadata } from "next";
import { getOrders } from "@/lib/orders";
import { parseOrdersParams, buildOrdersUrl, buildExportUrl } from "@/lib/params";
import { formatPrice, formatDate, formatShortId } from "@/lib/format";
import { OrdersFilters } from "@/components/OrdersFilters";
import { OrderStatusBadge } from "@/components/OrderStatusBadge";
import { Pagination } from "@/components/Pagination";
import { PageHeader, ExportButton } from "@/components/PageHeader";
import { EmptyState } from "@/components/EmptyState";
import { DownloadIcon } from "@/components/icons";

export const metadata: Metadata = {
  title: "Ventas | Dashboard",
  description: "Tabla de pedidos con búsqueda y filtros por estado.",
};

export const dynamic = "force-dynamic";

export default async function VentasPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const query = parseOrdersParams(await searchParams);
  const page = query.page ?? 1;
  const { items, total, totalPages } = await getOrders(query);

  const paginationLink = (p: number) =>
    buildOrdersUrl({
      q: query.search,
      estado: query.status,
      orden: query.sort,
      pagina: p > 1 ? String(p) : undefined,
    });

  const exportFilters = {
    q: query.search,
    estado: query.status,
  };

  return (
    <div>
      <PageHeader title="Ventas" description="Pedidos y su estado.">
        <ExportButton href={buildExportUrl("/api/export/ventas", exportFilters)}>
          <DownloadIcon className="h-4 w-4 text-slate-400" />
          Exportar CSV
        </ExportButton>
      </PageHeader>

      <div className="mt-6">
        <OrdersFilters search={query.search} status={query.status} sort={query.sort} />
      </div>

      {items.length > 0 ? (
        <>
          <p className="mt-5 text-sm text-slate-500">
            <span className="font-semibold text-slate-700">{total}</span>{" "}
            pedido{total !== 1 ? "s" : ""}
          </p>
          <div className="mt-3 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm shadow-slate-200/60">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-slate-200 bg-slate-50 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                    <th className="px-4 py-3">Pedido</th>
                    <th className="px-4 py-3">Cliente</th>
                    <th className="px-4 py-3">Estado</th>
                    <th className="px-4 py-3 text-right">Ítems</th>
                    <th className="px-4 py-3 text-right">Total</th>
                    <th className="px-4 py-3">Fecha</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {items.map((o) => (
                    <tr key={o.id} className="transition-colors hover:bg-indigo-50/40">
                      <td className="px-4 py-3 font-mono text-xs text-slate-500">
                        {formatShortId(o.id)}
                      </td>
                      <td className="px-4 py-3">
                        <p className="font-medium text-slate-900">{o.customer}</p>
                        <p className="text-xs text-slate-500">{o.email}</p>
                      </td>
                      <td className="px-4 py-3">
                        <OrderStatusBadge status={o.status} />
                      </td>
                      <td className="px-4 py-3 text-right text-slate-600">
                        {o._count.items}
                      </td>
                      <td className="px-4 py-3 text-right font-semibold text-slate-900">
                        {formatPrice(o.total)}
                      </td>
                      <td className="px-4 py-3 text-slate-500">
                        {formatDate(o.createdAt)}
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
        <EmptyState message="No se encontraron pedidos con esos filtros." />
      )}
    </div>
  );
}
