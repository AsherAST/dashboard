import { z } from "zod";
import { OrderStatus } from "@/generated/prisma/enums";
import type { InventoryQuery, InventorySort } from "@/lib/products";
import type { OrdersQuery, OrdersSort } from "@/lib/orders";

function toSingle(
  searchParams: Record<string, string | string[] | undefined>,
): Record<string, string | undefined> {
  return Object.fromEntries(
    Object.entries(searchParams).map(([k, v]) => [
      k,
      Array.isArray(v) ? v[0] : v,
    ]),
  );
}

const inventoryParamsSchema = z.object({
  q: z.string().trim().max(80).optional(),
  categoria: z.string().trim().max(50).optional(),
  stock: z.enum(["bajo", "agotado"]).optional(),
  orden: z.enum(["recent", "name-asc", "price-desc", "stock-asc"]).optional(),
  pagina: z.string().trim().max(5).optional(),
});

const ORDERS_PARAM_SORTS: Record<string, OrdersSort> = {
  recent: "recent",
  oldest: "oldest",
  "total-desc": "total-desc",
  "total-asc": "total-asc",
};

const ordersParamsSchema = z.object({
  q: z.string().trim().max(80).optional(),
  estado: z.nativeEnum(OrderStatus).optional(),
  orden: z.enum(["recent", "oldest", "total-desc", "total-asc"]).optional(),
  pagina: z.string().trim().max(5).optional(),
});

export function parseInventoryParams(
  searchParams: Record<string, string | string[] | undefined>,
): InventoryQuery {
  const parsed = inventoryParamsSchema.safeParse(toSingle(searchParams));
  if (!parsed.success) return {};

  const { q, categoria, stock, orden, pagina } = parsed.data;
  const page = pagina ? Number.parseInt(pagina, 10) : undefined;

  return {
    search: q || undefined,
    category: categoria || undefined,
    stockState: stock,
    sort: orden,
    page: page && page > 0 ? page : undefined,
  };
}

export function buildInventoryUrl(params: Record<string, string | undefined>) {
  const url = new URLSearchParams();
  for (const [key, value] of Object.entries(params)) {
    if (value) url.set(key, value);
  }
  const qs = url.toString();
  return qs ? `/inventario?${qs}` : "/inventario";
}

export function parseOrdersParams(
  searchParams: Record<string, string | string[] | undefined>,
): OrdersQuery {
  const parsed = ordersParamsSchema.safeParse(toSingle(searchParams));
  if (!parsed.success) return {};

  const { q, estado, orden, pagina } = parsed.data;
  const page = pagina ? Number.parseInt(pagina, 10) : undefined;

  return {
    search: q || undefined,
    status: estado,
    sort: orden ? ORDERS_PARAM_SORTS[orden] : undefined,
    page: page && page > 0 ? page : undefined,
  };
}

export function buildOrdersUrl(params: Record<string, string | undefined>) {
  const url = new URLSearchParams();
  for (const [key, value] of Object.entries(params)) {
    if (value) url.set(key, value);
  }
  const qs = url.toString();
  return qs ? `/ventas?${qs}` : "/ventas";
}

export type { InventorySort, OrdersSort };