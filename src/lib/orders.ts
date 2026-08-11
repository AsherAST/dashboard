import { db } from "@/lib/db";
import { Prisma } from "@/generated/prisma/client";
import { OrderStatus } from "@/generated/prisma/enums";

export const ORDERS_PAGE_SIZE = 10;

export type OrdersSort = "recent" | "oldest" | "total-desc" | "total-asc";

export type OrdersQuery = {
  search?: string;
  status?: OrderStatus;
  sort?: OrdersSort;
  page?: number;
  limit?: number;
};

export async function getOrders(query: OrdersQuery = {}) {
  const where: Prisma.OrderWhereInput = {
    ...(query.search
      ? {
          OR: [
            { customer: { contains: query.search, mode: "insensitive" } },
            { email: { contains: query.search, mode: "insensitive" } },
            { id: { contains: query.search, mode: "insensitive" } },
          ],
        }
      : {}),
    ...(query.status ? { status: query.status } : {}),
  };

  let orderBy: Prisma.OrderOrderByWithRelationInput = { createdAt: "desc" };
  switch (query.sort) {
    case "oldest":
      orderBy = { createdAt: "asc" };
      break;
    case "total-desc":
      orderBy = { total: "desc" };
      break;
    case "total-asc":
      orderBy = { total: "asc" };
      break;
  }

  const page = Math.max(query.page ?? 1, 1);

  const [items, total] = await Promise.all([
    db.order.findMany({
      where,
      orderBy,
      include: { _count: { select: { items: true } } },
      skip: (page - 1) * ORDERS_PAGE_SIZE,
      take: query.limit ?? ORDERS_PAGE_SIZE,
    }),
    db.order.count({ where }),
  ]);

  return {
    items,
    total,
    page,
    totalPages: Math.max(Math.ceil(total / ORDERS_PAGE_SIZE), 1),
  };
}