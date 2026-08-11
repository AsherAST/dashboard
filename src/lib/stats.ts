import { db } from "@/lib/db";
import { OrderStatus } from "@/generated/prisma/enums";

export type SalesByDay = { date: string; total: number; orders: number };
export type CategorySales = { category: string; total: number };
export type TopProduct = { name: string; units: number; revenue: number };
export type StatusCount = { status: OrderStatus; count: number };

export async function getDashboardStats() {
  const [orders, products, statusGroups] = await Promise.all([
    db.order.findMany({
      select: {
        id: true,
        status: true,
        total: true,
        createdAt: true,
        items: {
          select: {
            quantity: true,
            price: true,
            product: { select: { name: true, category: true } },
          },
        },
      },
    }),
    db.product.findMany({
      select: { stock: true, stockMin: true },
    }),
    db.order.groupBy({
      by: ["status"],
      _count: { _all: true },
    }),
  ]);

  const active = orders.filter((o) => o.status !== OrderStatus.CANCELLED);

  const revenue = active.reduce((s, o) => s + o.total, 0);
  const avgTicket = active.length ? Math.round(revenue / active.length) : 0;
  const unitsSold = active.reduce(
    (s, o) => s + o.items.reduce((t, it) => t + it.quantity, 0),
    0,
  );
  const pendingOrders = orders.filter(
    (o) => o.status === OrderStatus.PENDING,
  ).length;

  const lowStockProducts = products.filter(
    (p) => p.stock <= p.stockMin,
  ).length;
  const outOfStock = products.filter((p) => p.stock === 0).length;
  const productsTotal = products.length;

  const now = new Date();
  const byDay = new Map<string, SalesByDay>();
  for (let d = 29; d >= 0; d--) {
    const date = new Date(now);
    date.setDate(now.getDate() - d);
    const key = toDayKey(date);
    byDay.set(key, { date: key, total: 0, orders: 0 });
  }
  for (const o of active) {
    const entry = byDay.get(toDayKey(o.createdAt));
    if (entry) {
      entry.total += o.total;
      entry.orders += 1;
    }
  }
  const salesByDay = [...byDay.values()];

  const byCategory = new Map<string, number>();
  for (const o of active) {
    for (const it of o.items) {
      const cat = it.product.category;
      byCategory.set(cat, (byCategory.get(cat) ?? 0) + it.quantity * it.price);
    }
  }
  const salesByCategory: CategorySales[] = [...byCategory.entries()]
    .map(([category, total]) => ({ category, total }))
    .sort((a, b) => b.total - a.total);

  const byProduct = new Map<string, { units: number; revenue: number }>();
  for (const o of active) {
    for (const it of o.items) {
      const cur = byProduct.get(it.product.name) ?? { units: 0, revenue: 0 };
      cur.units += it.quantity;
      cur.revenue += it.quantity * it.price;
      byProduct.set(it.product.name, cur);
    }
  }
  const topProducts: TopProduct[] = [...byProduct.entries()]
    .map(([name, v]) => ({ name, units: v.units, revenue: v.revenue }))
    .sort((a, b) => b.units - a.units)
    .slice(0, 5);

  const ordersByStatus: StatusCount[] = statusGroups.map((g) => ({
    status: g.status,
    count: g._count._all,
  }));

  return {
    revenue,
    ordersTotal: orders.length,
    avgTicket,
    unitsSold,
    pendingOrders,
    lowStockProducts,
    outOfStock,
    productsTotal,
    salesByDay,
    salesByCategory,
    topProducts,
    ordersByStatus,
  };
}

function toDayKey(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}