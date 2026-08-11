import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { getInventory } from "@/lib/products";
import { parseInventoryParams } from "@/lib/params";
import { toCsv, csvHeaders } from "@/lib/csv";

export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  const searchParams = Object.fromEntries(
    new URL(req.url).searchParams,
  );
  const query = parseInventoryParams(searchParams);
  const { items } = await getInventory({ ...query, limit: 1000 });

  const rows: (string | number)[][] = [
    ["SKU", "Producto", "Categoría", "Precio", "Costo", "Stock", "Mínimo"],
    ...items.map((p) => [
      p.sku,
      p.name,
      p.category,
      p.price,
      p.cost,
      p.stock,
      p.stockMin,
    ]),
  ];

  return new Response(toCsv(rows), {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": csvHeaders({ filename: "inventario.csv" }),
    },
  });
}