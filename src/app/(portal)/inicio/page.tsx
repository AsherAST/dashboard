import type { Metadata } from "next";
import Link from "next/link";
import { getDashboardStats } from "@/lib/stats";
import { formatPrice } from "@/lib/format";
import { StatCard } from "@/components/StatCard";
import { ChartCard } from "@/components/ChartCard";
import { PageHeader } from "@/components/PageHeader";
import { SalesAreaChart } from "@/components/charts/SalesAreaChart";
import { CategoryBarChart } from "@/components/charts/CategoryBarChart";
import { TopProductsBarChart } from "@/components/charts/TopProductsBarChart";
import { OrdersPieChart } from "@/components/charts/OrdersPieChart";
import { AlertIcon, BoxIcon, ReceiptIcon, TrendIcon, DollarIcon } from "@/components/icons";

export const metadata: Metadata = {
  title: "Inicio | Dashboard",
  description: "KPIs y gráficas de ventas del sistema de gestión.",
};

export const dynamic = "force-dynamic";

export default async function InicioPage() {
  const stats = await getDashboardStats();

  return (
    <div>
      <PageHeader
        title="Inicio"
        description="Resumen de inventario y ventas."
      />

      {stats.lowStockProducts > 0 && (
        <div className="mt-6 flex items-start gap-3 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
          <AlertIcon className="mt-0.5 h-4 w-4 shrink-0 text-amber-600" />
          <p>
            {stats.lowStockProducts}{" "}
            {stats.lowStockProducts === 1 ? "producto tiene" : "productos tienen"}{" "}
            stock bajo ({stats.outOfStock} agotado
            {stats.outOfStock !== 1 ? "s" : ""}).{" "}
            <Link
              href="/inventario?stock=bajo"
              className="font-semibold text-amber-700 underline underline-offset-2 hover:text-amber-900"
            >
              Ver inventario
            </Link>
          </p>
        </div>
      )}

      <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          label="Ingresos (30 días)"
          value={formatPrice(stats.revenue)}
          hint="Pedidos activos (sin cancelados)"
          icon={DollarIcon}
          accent="emerald"
        />
        <StatCard
          label="Pedidos"
          value={String(stats.ordersTotal)}
          hint={`${stats.pendingOrders} pendiente${stats.pendingOrders !== 1 ? "s" : ""}`}
          icon={ReceiptIcon}
          accent="indigo"
        />
        <StatCard
          label="Ticket promedio"
          value={formatPrice(stats.avgTicket)}
          hint={`${stats.unitsSold} unidades vendidas`}
          icon={TrendIcon}
          accent="violet"
        />
        <StatCard
          label="Productos"
          value={String(stats.productsTotal)}
          hint={`${stats.lowStockProducts} con stock bajo · ${stats.outOfStock} agotados`}
          icon={BoxIcon}
          accent="amber"
        />
      </div>

      <div className="mt-8 grid grid-cols-1 gap-6 xl:grid-cols-3">
        <div className="xl:col-span-2">
          <ChartCard title="Ventas por día" subtitle="Últimos 30 días">
            <SalesAreaChart data={stats.salesByDay} />
          </ChartCard>
        </div>
        <ChartCard title="Pedidos por estado" subtitle="Distribución">
          <OrdersPieChart data={stats.ordersByStatus} />
        </ChartCard>
      </div>

      <div className="mt-6 grid grid-cols-1 gap-6 xl:grid-cols-2">
        <ChartCard title="Ventas por categoría" subtitle="Ingresos">
          <CategoryBarChart data={stats.salesByCategory} />
        </ChartCard>
        <ChartCard title="Top productos" subtitle="Unidades vendidas">
          <TopProductsBarChart data={stats.topProducts} />
        </ChartCard>
      </div>
    </div>
  );
}
