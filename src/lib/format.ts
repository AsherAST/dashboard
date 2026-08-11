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
  className: string;
} {
  switch (status) {
    case "PENDING":
      return { label: "Pendiente", className: "bg-amber-100 text-amber-700" };
    case "PAID":
      return { label: "Pagado", className: "bg-sky-100 text-sky-700" };
    case "SHIPPED":
      return { label: "Enviado", className: "bg-indigo-100 text-indigo-700" };
    case "DELIVERED":
      return { label: "Entregado", className: "bg-emerald-100 text-emerald-700" };
    case "CANCELLED":
      return { label: "Cancelado", className: "bg-red-100 text-red-700" };
    default:
      return { label: status, className: "bg-zinc-100 text-zinc-700" };
  }
}