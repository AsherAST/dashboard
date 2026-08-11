import { NextResponse } from "next/server";
import { PDFDocument, StandardFonts, rgb } from "pdf-lib";
import { auth } from "@/auth";
import { getInventory } from "@/lib/products";
import { formatPrice, formatShortId } from "@/lib/format";
import { csvHeaders } from "@/lib/csv";
import { getOrders } from "@/lib/orders";

export const dynamic = "force-dynamic";

const HEADER_COLUMNS = [
  { label: "SKU", x: 40, width: 70 },
  { label: "Producto", x: 120, width: 180 },
  { label: "Categoría", x: 310, width: 110 },
  { label: "Stock", x: 430, width: 50 },
  { label: "Precio", x: 490, width: 80 },
];

export async function GET() {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  const [inventory, orders] = await Promise.all([
    getInventory({ limit: 1000 }),
    getOrders({ limit: 1000 }),
  ]);

  const doc = await PDFDocument.create();
  const font = await doc.embedFont(StandardFonts.Helvetica);
  const bold = await doc.embedFont(StandardFonts.HelveticaBold);

  let page = doc.addPage([612, 792]);

  page.drawText("Reporte de gestión", {
    x: 40,
    y: 760,
    size: 20,
    font: bold,
    color: rgb(0.1, 0.1, 0.1),
  });
  page.drawText(`Generado: ${new Date().toLocaleString("es-CL")}`, {
    x: 40,
    y: 738,
    size: 10,
    font,
    color: rgb(0.45, 0.45, 0.45),
  });

  let y = 700;

  y = drawSectionHeader(page, bold, y, "Resumen");
  const summaryLines = [
    `Productos: ${inventory.total}`,
    `Con stock bajo: ${inventory.lowStockCount}`,
    `Pedidos: ${orders.total}`,
  ];
  y -= 16;
  for (const line of summaryLines) {
    page.drawText(line, { x: 40, y, size: 10, font, color: rgb(0.25, 0.25, 0.25) });
    y -= 14;
  }

  y -= 12;
  y = drawSectionHeader(page, bold, y, "Inventario");
  y -= 6;
  y = drawTableHeader(page, font, bold, y);
  for (const p of inventory.items) {
    if (y < 48) {
      page = doc.addPage([612, 792]);
      y = 750;
      y = drawTableHeader(page, font, bold, y);
    }
    y -= 16;
    page.drawText(p.sku, { x: 40, y, size: 9, font });
    page.drawText(truncate(p.name, 28), { x: 120, y, size: 9, font });
    page.drawText(truncate(p.category, 16), { x: 310, y, size: 9, font });
    page.drawText(String(p.stock), { x: 430, y, size: 9, font });
    page.drawText(formatPrice(p.price), { x: 490, y, size: 9, font });
  }

  y -= 28;
  y = drawSectionHeader(page, bold, y, "Últimos pedidos");
  y -= 6;
  y = drawOrdersHeader(page, font, bold, y);
  for (const o of orders.items.slice(0, 30)) {
    if (y < 48) {
      page = doc.addPage([612, 792]);
      y = 750;
      y = drawOrdersHeader(page, font, bold, y);
    }
    y -= 16;
    page.drawText(formatShortId(o.id), { x: 40, y, size: 9, font });
    page.drawText(truncate(o.customer, 24), { x: 110, y, size: 9, font });
    page.drawText(o.status, { x: 300, y, size: 9, font });
    page.drawText(formatPrice(o.total), { x: 460, y, size: 9, font });
  }

  const pdfBytes = await doc.save();
  return new Response(Buffer.from(pdfBytes), {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": csvHeaders({ filename: "reporte-dashboard.pdf" }),
    },
  });
}

function drawSectionHeader(
  page: import("pdf-lib").PDFPage,
  bold: import("pdf-lib").PDFFont,
  y: number,
  text: string,
) {
  const result = y - 18;
  page.drawText(text, {
    x: 40,
    y: result,
    size: 13,
    font: bold,
    color: rgb(0.1, 0.1, 0.1),
  });
  return result;
}

function drawTableHeader(
  page: import("pdf-lib").PDFPage,
  font: import("pdf-lib").PDFFont,
  bold: import("pdf-lib").PDFFont,
  y: number,
) {
  const result = y - 14;
  for (const col of HEADER_COLUMNS) {
    page.drawText(col.label, { x: col.x, y: result, size: 9, font: bold });
  }
  void font;
  return result;
}

function drawOrdersHeader(
  page: import("pdf-lib").PDFPage,
  font: import("pdf-lib").PDFFont,
  bold: import("pdf-lib").PDFFont,
  y: number,
) {
  const result = y - 14;
  for (const [label, x] of [
    ["Pedido", 40],
    ["Cliente", 110],
    ["Estado", 300],
    ["Total", 460],
  ] as const) {
    page.drawText(label, { x, y: result, size: 9, font: bold });
  }
  void font;
  return result;
}

function truncate(value: string, max: number): string {
  return value.length > max ? `${value.slice(0, max - 1)}…` : value;
}