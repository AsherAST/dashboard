import Link from "next/link";
import { ChevronLeftIcon, ChevronRightIcon } from "@/components/icons";

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

  const linkClass =
    "inline-flex items-center gap-1.5 rounded-lg border border-slate-300 bg-white px-3.5 py-2 text-sm font-medium text-slate-700 shadow-sm transition-colors hover:border-slate-400 hover:bg-slate-50";

  return (
    <nav className="mt-6 flex items-center justify-center gap-4">
      {page > 1 ? (
        <Link href={buildHref(page - 1)} className={linkClass}>
          <ChevronLeftIcon className="h-4 w-4" />
          Anterior
        </Link>
      ) : null}
      <span className="text-sm text-slate-500">
        Página <span className="font-semibold text-slate-700">{page}</span> de{" "}
        {totalPages}
      </span>
      {page < totalPages ? (
        <Link href={buildHref(page + 1)} className={linkClass}>
          Siguiente
          <ChevronRightIcon className="h-4 w-4" />
        </Link>
      ) : null}
    </nav>
  );
}
