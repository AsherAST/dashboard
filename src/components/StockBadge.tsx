export function StockBadge({ stock, stockMin }: { stock: number; stockMin: number }) {
  if (stock <= 0) {
    return (
      <span className="rounded-full bg-red-100 px-2.5 py-0.5 text-xs font-medium text-red-700">
        Agotado
      </span>
    );
  }
  if (stock <= stockMin) {
    return (
      <span className="rounded-full bg-amber-100 px-2.5 py-0.5 text-xs font-medium text-amber-700">
        Stock bajo
      </span>
    );
  }
  return (
    <span className="rounded-full bg-emerald-100 px-2.5 py-0.5 text-xs font-medium text-emerald-700">
      Disponible
    </span>
  );
}