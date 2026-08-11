import { db } from "@/lib/db";
import { Prisma } from "@/generated/prisma/client";

export const INVENTORY_PAGE_SIZE = 10;

export type InventorySort = "recent" | "name-asc" | "price-desc" | "stock-asc";
export type StockState = "bajo" | "agotado";

export type InventoryQuery = {
  search?: string;
  category?: string;
  stockState?: StockState;
  sort?: InventorySort;
  page?: number;
  limit?: number;
};

export async function getInventory(query: InventoryQuery = {}) {
  const where: Prisma.ProductWhereInput = {
    ...(query.search
      ? {
          OR: [
            { name: { contains: query.search, mode: "insensitive" } },
            { sku: { contains: query.search, mode: "insensitive" } },
          ],
        }
      : {}),
    ...(query.category ? { category: query.category } : {}),
    ...(query.stockState === "bajo"
      ? { stock: { lte: db.product.fields.stockMin } }
      : {}),
    ...(query.stockState === "agotado" ? { stock: 0 } : {}),
  };

  let orderBy: Prisma.ProductOrderByWithRelationInput = { createdAt: "desc" };
  switch (query.sort) {
    case "name-asc":
      orderBy = { name: "asc" };
      break;
    case "price-desc":
      orderBy = { price: "desc" };
      break;
    case "stock-asc":
      orderBy = { stock: "asc" };
      break;
  }

  const page = Math.max(query.page ?? 1, 1);

  const [items, total, lowStockCount] = await Promise.all([
    db.product.findMany({
      where,
      orderBy,
      skip: (page - 1) * INVENTORY_PAGE_SIZE,
      take: query.limit ?? INVENTORY_PAGE_SIZE,
    }),
    db.product.count({ where }),
    db.product.count({ where: { stock: { lte: db.product.fields.stockMin } } }),
  ]);

  return {
    items,
    total,
    page,
    totalPages: Math.max(Math.ceil(total / INVENTORY_PAGE_SIZE), 1),
    lowStockCount,
  };
}

export async function getCategories() {
  const rows = await db.product.findMany({
    select: { category: true },
    distinct: ["category"],
    orderBy: { category: "asc" },
  });
  return rows.map((r) => r.category);
}