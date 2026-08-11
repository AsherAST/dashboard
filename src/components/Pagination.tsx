import Link from "next/link";

export function Pagination({
  page,
  totalPages,
  buildHref,
}: {
  page: number;
  totalPages: number;
  buildHref: (page: number) => string;
}) {
  if (totalPages <= 1) return null;

  return (
    <nav className="mt-6 flex items-center justify-center gap-4">
      {page > 1 ? (
        <Link
          href={buildHref(page - 1)}
          className="rounded-lg border border-zinc-300 bg-white px-4 py-2 text-sm transition-colors hover:border-zinc-500"
        >
          ← Anterior
        </Link>
      ) : null}
      <span className="text-sm text-zinc-500">
        Página {page} de {totalPages}
      </span>
      {page < totalPages ? (
        <Link
          href={buildHref(page + 1)}
          className="rounded-lg border border-zinc-300 bg-white px-4 py-2 text-sm transition-colors hover:border-zinc-500"
        >
          Siguiente →
        </Link>
      ) : null}
    </nav>
  );
}