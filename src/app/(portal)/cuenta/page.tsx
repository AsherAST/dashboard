import { auth } from "@/auth";
import { PageHeader } from "@/components/PageHeader";
import { ShieldIcon, EyeIcon } from "@/components/icons";

export default async function CuentaPage() {
  const session = await auth();
  const isAdmin = session?.user?.role === "ADMIN";

  return (
    <div className="max-w-xl">
      <PageHeader
        title="Mi cuenta"
        description="Datos de tu usuario y rol en el sistema."
      />

      <div className="mt-6 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm shadow-slate-200/60">
        <div className="flex items-center gap-4 border-b border-slate-100 bg-slate-50/60 px-6 py-5">
          <div
            className={`flex h-14 w-14 items-center justify-center rounded-2xl text-lg font-bold text-white shadow-sm ${
              isAdmin
                ? "bg-gradient-to-br from-indigo-500 to-violet-600"
                : "bg-gradient-to-br from-sky-500 to-emerald-500"
            }`}
          >
            {(session?.user?.name ?? "U").slice(0, 1).toUpperCase()}
          </div>
          <div>
            <p className="text-base font-semibold text-slate-900">
              {session?.user?.name}
            </p>
            <p className="text-sm text-slate-500">{session?.user?.email}</p>
          </div>
        </div>
        <dl className="divide-y divide-slate-100">
          <div className="flex items-center justify-between px-6 py-4">
            <dt className="text-sm text-slate-500">Nombre</dt>
            <dd className="text-sm font-medium text-slate-900">
              {session?.user?.name}
            </dd>
          </div>
          <div className="flex items-center justify-between px-6 py-4">
            <dt className="text-sm text-slate-500">Correo</dt>
            <dd className="text-sm font-medium text-slate-900">
              {session?.user?.email}
            </dd>
          </div>
          <div className="flex items-center justify-between px-6 py-4">
            <dt className="text-sm text-slate-500">Rol</dt>
            <dd>
              <span
                className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold ring-1 ring-inset ${
                  isAdmin
                    ? "bg-indigo-50 text-indigo-700 ring-indigo-200"
                    : "bg-emerald-50 text-emerald-700 ring-emerald-200"
                }`}
              >
                {isAdmin ? (
                  <ShieldIcon className="h-3.5 w-3.5" />
                ) : (
                  <EyeIcon className="h-3.5 w-3.5" />
                )}
                {isAdmin ? "Administrador" : "Solo lectura"}
              </span>
            </dd>
          </div>
        </dl>
      </div>
    </div>
  );
}
