import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { getOrders } from "@/lib/orders";
import { parseOrdersParams } from "@/lib/params";
import { toCsv, csvHeaders } from "@/lib/csv";
import { formatShortId } from "@/lib/format";

export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  const searchParams = Object.fromEntries(
    new URL(req.url).searchParams,
  );
  const query = parseOrdersParams(searchParams);
  const { items } = await getOrders({ ...query, limit: 1000 });

  const rows: (string | number)[][] = [
    ["Pedido", "Cliente", "Email", "Estado", "Ítems", "Total"],
    ...items.map((o) => [
      formatShortId(o.id),
      o.customer,
      o.email ?? "",
      o.status,
      o._count.items,
      o.total,
    ]),
  ];

  return new Response(toCsv(rows), {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": csvHeaders({ filename: "ventas.csv" }),
    },
  });
}