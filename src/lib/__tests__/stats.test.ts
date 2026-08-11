import { describe, expect, it, vi, beforeEach } from "vitest";
import { OrderStatus } from "@/generated/prisma/enums";

const mockDb = vi.hoisted(() => ({
  order: {
    findMany: vi.fn(),
    groupBy: vi.fn(),
  },
  product: {
    findMany: vi.fn(),
  },
}));

vi.mock("@/lib/db", () => ({ db: mockDb }));

import { getDashboardStats } from "@/lib/stats";

function isoDaysAgo(days: number): Date {
  const d = new Date();
  d.setDate(d.getDate() - days);
  return d;
}

const today = isoDaysAgo(0);
const yesterday = isoDaysAgo(1);

const sampleOrders = [
  {
    id: "o1",
    status: OrderStatus.DELIVERED,
    total: 100000,
    createdAt: today,
    items: [
      {
        quantity: 1,
        price: 60000,
        product: { name: "Teclado", category: "Periféricos" },
      },
      {
        quantity: 1,
        price: 40000,
        product: { name: "Mouse", category: "Periféricos" },
      },
    ],
  },
  {
    id: "o2",
    status: OrderStatus.PENDING,
    total: 20000,
    createdAt: yesterday,
    items: [
      {
        quantity: 2,
        price: 10000,
        product: { name: "Mouse", category: "Periféricos" },
      },
    ],
  },
  {
    id: "o3",
    status: OrderStatus.CANCELLED,
    total: 999999,
    createdAt: today,
    items: [
      {
        quantity: 10,
        price: 99999,
        product: { name: "Cancelado", category: "Basura" },
      },
    ],
  },
];

describe("getDashboardStats", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockDb.order.findMany.mockResolvedValue(sampleOrders);
    mockDb.order.groupBy.mockResolvedValue([
      { status: OrderStatus.DELIVERED, _count: { _all: 1 } },
      { status: OrderStatus.PENDING, _count: { _all: 1 } },
      { status: OrderStatus.CANCELLED, _count: { _all: 1 } },
    ]);
    mockDb.product.findMany.mockResolvedValue([
      { stock: 0, stockMin: 5 },
      { stock: 3, stockMin: 10 },
      { stock: 20, stockMin: 5 },
    ]);
  });

  it("excluye pedidos cancelados del ingreso", async () => {
    const stats = await getDashboardStats();
    expect(stats.revenue).toBe(120000);
    expect(stats.ordersTotal).toBe(3);
  });

  it("calcula ticket promedio y unidades vendidas", async () => {
    const stats = await getDashboardStats();
    expect(stats.avgTicket).toBe(60000);
    expect(stats.unitsSold).toBe(4);
  });

  it("genera 30 días de ventas con bucket de hoy y ayer", async () => {
    const stats = await getDashboardStats();
    expect(stats.salesByDay).toHaveLength(30);
    const last = stats.salesByDay[stats.salesByDay.length - 1];
    expect(last.total).toBeGreaterThan(0);
    expect(last.orders).toBe(1);
  });

  it("agrupa ventas por categoría ordenadas desc", async () => {
    const stats = await getDashboardStats();
    const categorias = stats.salesByCategory;
    expect(categorias[0].category).toBe("Periféricos");
    expect(categorias[0].total).toBe(120000);
  });

  it("calcula top productos por unidades", async () => {
    const stats = await getDashboardStats();
    expect(stats.topProducts[0].name).toBe("Mouse");
    expect(stats.topProducts[0].units).toBe(3);
  });

  it("cuenta stock bajo y agotados", async () => {
    const stats = await getDashboardStats();
    expect(stats.productsTotal).toBe(3);
    expect(stats.lowStockProducts).toBe(2);
    expect(stats.outOfStock).toBe(1);
  });
});