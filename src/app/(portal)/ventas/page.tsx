import type { Metadata } from "next";
import { getOrders } from "@/lib/orders";
import { parseOrdersParams, buildOrdersUrl } from "@/lib/params";
import { formatPrice, formatDate, formatShortId } from "@/lib/format";
import { OrdersFilters } from "@/components/OrdersFilters";
import { OrderStatusBadge } from "@/components/OrderStatusBadge";
import { Pagination } from "@/components/Pagination";

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

  return (
    <div>
      <h1 className="text-xl font-semibold text-neutral-900">Ventas</h1>
      <p className="mt-1 text-sm text-zinc-500">
        Pedidos y su estado.
      </p>

      <div className="mt-4">
        <OrdersFilters search={query.search} status={query.status} sort={query.sort} />
      </div>

      {items.length > 0 ? (
        <>
          <p className="mt-5 text-sm text-zinc-500">
            {total} pedido{total !== 1 ? "s" : ""}
          </p>
          <div className="mt-3 overflow-x-auto rounded-xl border border-zinc-200 bg-white">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-zinc-200 text-left text-xs uppercase tracking-wide text-zinc-400">
                  <th className="px-4 py-3 font-medium">Pedido</th>
                  <th className="px-4 py-3 font-medium">Cliente</th>
                  <th className="px-4 py-3 font-medium">Estado</th>
                  <th className="px-4 py-3 text-right font-medium">Ítems</th>
                  <th className="px-4 py-3 text-right font-medium">Total</th>
                  <th className="px-4 py-3 font-medium">Fecha</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-100">
                {items.map((o) => (
                  <tr key={o.id} className="hover:bg-zinc-50">
                    <td className="px-4 py-3 font-mono text-xs text-zinc-500">
                      {formatShortId(o.id)}
                    </td>
                    <td className="px-4 py-3">
                      <p className="font-medium text-neutral-900">
                        {o.customer}
                      </p>
                      <p className="text-xs text-zinc-500">{o.email}</p>
                    </td>
                    <td className="px-4 py-3">
                      <OrderStatusBadge status={o.status} />
                    </td>
                    <td className="px-4 py-3 text-right text-zinc-600">
                      {o._count.items}
                    </td>
                    <td className="px-4 py-3 text-right font-medium text-zinc-900">
                      {formatPrice(o.total)}
                    </td>
                    <td className="px-4 py-3 text-zinc-500">
                      {formatDate(o.createdAt)}
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
          No se encontraron pedidos con esos filtros.
        </p>
      )}
    </div>
  );
}