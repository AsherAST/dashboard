export function formatPrice(price: number): string {
  return new Intl.NumberFormat("es-CL", {
    style: "currency",
    currency: "CLP",
    maximumFractionDigits: 0,
  }).format(price);
}

export function formatDate(date: Date): string {
  return new Intl.DateTimeFormat("es-CL", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(date);
}

export function formatShortId(id: string): string {
  return id.slice(0, 8).toUpperCase();
}

export function orderStatusInfo(status: string): {
  label: string;
  dot: string;
  className: string;
} {
  switch (status) {
    case "PENDING":
      return {
        label: "Pendiente",
        dot: "bg-amber-500",
        className: "bg-amber-50 text-amber-700 ring-amber-200",
      };
    case "PAID":
      return {
        label: "Pagado",
        dot: "bg-sky-500",
        className: "bg-sky-50 text-sky-700 ring-sky-200",
      };
    case "SHIPPED":
      return {
        label: "Enviado",
        dot: "bg-indigo-500",
        className: "bg-indigo-50 text-indigo-700 ring-indigo-200",
      };
    case "DELIVERED":
      return {
        label: "Entregado",
        dot: "bg-emerald-500",
        className: "bg-emerald-50 text-emerald-700 ring-emerald-200",
      };
    case "CANCELLED":
      return {
        label: "Cancelado",
        dot: "bg-red-500",
        className: "bg-red-50 text-red-700 ring-red-200",
      };
    default:
      return {
        label: status,
        dot: "bg-slate-500",
        className: "bg-slate-50 text-slate-700 ring-slate-200",
      };
  }
}