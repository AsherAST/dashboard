import "dotenv/config";
import bcrypt from "bcryptjs";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../src/generated/prisma/client";
import { OrderStatus, Role } from "../src/generated/prisma/enums";

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL,
});
const db = new PrismaClient({ adapter });

function mulberry32(seed: number) {
  let a = seed;
  return () => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const rand = mulberry32(20260809);
const between = (min: number, max: number) =>
  Math.floor(rand() * (max - min + 1)) + min;
const pick = <T>(arr: T[]): T => arr[Math.floor(rand() * arr.length)];

const products = [
  { name: "Notebook Gamer X", sku: "NB-001", category: "Computación", price: 899900, cost: 620000, stock: 12, stockMin: 5, description: "Notebook con GPU dedicada para gaming y edición." },
  { name: "Teclado Mecánico RGB", sku: "TC-001", category: "Periféricos", price: 45990, cost: 25000, stock: 8, stockMin: 10, description: "Switch mecánico, retroiluminación RGB programable." },
  { name: "Mouse Inalámbrico", sku: "MO-001", category: "Periféricos", price: 29990, cost: 15000, stock: 3, stockMin: 10, description: "Sensor óptico 1600 DPI, conexión 2.4 GHz." },
  { name: "Monitor 27\" 4K", sku: "MO-002", category: "Periféricos", price: 349990, cost: 240000, stock: 6, stockMin: 3, description: "Panel IPS 4K UHD, 100% sRGB." },
  { name: "Auriculares Bluetooth", sku: "AU-001", category: "Audio", price: 49990, cost: 30000, stock: 2, stockMin: 6, description: "Cancelación de ruido y 30 h de batería." },
  { name: "Silla Gamer Pro", sku: "SG-001", category: "Mobiliario", price: 189990, cost: 120000, stock: 5, stockMin: 4, description: "Ergonómica, reclinable y con soporte lumbar." },
  { name: "Webcam HD", sku: "WE-001", category: "Periféricos", price: 24990, cost: 12000, stock: 14, stockMin: 5, description: "1080p con micrófono integrado y corrección de luz." },
  { name: "Micrófono USB", sku: "MI-001", category: "Audio", price: 59990, cost: 35000, stock: 7, stockMin: 4, description: "Cardioide, ideal para streaming y podcasts." },
  { name: "SSD NVMe 1TB", sku: "AL-001", category: "Componentes", price: 89990, cost: 55000, stock: 0, stockMin: 8, description: "Lectura 7000 MB/s, compatible PS5." },
  { name: "Memoria RAM 16GB DDR5", sku: "RA-001", category: "Componentes", price: 64990, cost: 40000, stock: 15, stockMin: 6, description: "6000 MHz CL30 con perfil XMP." },
  { name: "Router WiFi 6", sku: "RO-001", category: "Redes", price: 79990, cost: 48000, stock: 4, stockMin: 5, description: "Dual band AX3000 con puertos gigabit." },
  { name: "Tablet 10\"", sku: "TA-001", category: "Computación", price: 199990, cost: 135000, stock: 9, stockMin: 4, description: "Pantalla 2K, 64 GB y lápiz compatible." },
  { name: "Impresora Multifunción", sku: "IM-001", category: "Oficina", price: 149990, cost: 95000, stock: 6, stockMin: 3, description: "Escáner y copiadora, WiFi y doble cara." },
  { name: "Smartwatch Serie 5", sku: "SM-001", category: "Accesorios", price: 129990, cost: 85000, stock: 11, stockMin: 6, description: "GPS, monitor de ritmo y 7 días de batería." },
];

const customers = [
  "María González", "Carlos Pérez", "Ana Rodríguez", "Luis Fernández",
  "Valentina Soto", "Jorge Rojas", "Francisca Díaz", "Diego Morales",
  "Catalina Muñoz", "Andrés Herrera", "Javiera Castro", "Felipe Vargas",
  "Camila Torres", "Rodrigo Fuentes", "Constanza Reyes", "Matías Navarro",
];

const statusesByAge = [
  { untilDays: 3, statuses: [OrderStatus.PENDING, OrderStatus.PAID, OrderStatus.SHIPPED] },
  { untilDays: 10, statuses: [OrderStatus.PAID, OrderStatus.SHIPPED, OrderStatus.DELIVERED] },
  { untilDays: 9999, statuses: [OrderStatus.SHIPPED, OrderStatus.DELIVERED, OrderStatus.CANCELLED] },
];

async function main() {
  await db.user.upsert({
    where: { email: "admin@dashboard.cl" },
    update: {},
    create: {
      name: "Damian Admin",
      email: "admin@dashboard.cl",
      passwordHash: bcrypt.hashSync("admin1234", 10),
      role: Role.ADMIN,
    },
  });
  await db.user.upsert({
    where: { email: "viewer@dashboard.cl" },
    update: {},
    create: {
      name: "Damian Viewer",
      email: "viewer@dashboard.cl",
      passwordHash: bcrypt.hashSync("viewer1234", 10),
      role: Role.VIEWER,
    },
  });

  for (const p of products) {
    await db.product.upsert({
      where: { sku: p.sku },
      update: {
        name: p.name,
        category: p.category,
        price: p.price,
        cost: p.cost,
        stock: p.stock,
        stockMin: p.stockMin,
        description: p.description,
      },
      create: { ...p },
    });
  }

  await db.order.deleteMany();

  const now = Date.now();
  const orderCount = 180;
  for (let i = 0; i < orderCount; i++) {
    const daysAgo = between(0, 89);
    const date = new Date(now - daysAgo * 86_400_000);
    date.setHours(between(9, 19), between(0, 59), 0, 0);

    const statusRow = statusesByAge.find((s) => daysAgo <= s.untilDays)!;
    const status = pick(statusRow.statuses);

    const items = [] as { productId: string; quantity: number; price: number }[];
    const itemCount = between(1, 4);
    const used = new Set<number>();
    for (let j = 0; j < itemCount; j++) {
      let idx = between(0, products.length - 1);
      while (used.has(idx)) idx = between(0, products.length - 1);
      used.add(idx);
      const product = products[idx];
      const productRow = await db.product.findUnique({
        where: { sku: product.sku },
        select: { id: true },
      });
      if (!productRow) continue;
      const quantity = pick([1, 1, 1, 2, 2]);
      items.push({ productId: productRow.id, quantity, price: product.price });
    }

    const total = items.reduce((sum, it) => sum + it.price * it.quantity, 0);

    await db.order.create({
      data: {
        status,
        total,
        customer: pick(customers),
        email: `cliente${i}@ejemplo.cl`,
        createdAt: date,
        items: { create: items },
      },
    });
  }

  console.log("Seed completado.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await db.$disconnect();
  });