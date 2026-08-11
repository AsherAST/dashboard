import { auth } from "@/auth";

export default async function CuentaPage() {
  const session = await auth();

  return (
    <div className="max-w-xl">
      <h1 className="text-xl font-semibold text-neutral-900">Mi cuenta</h1>
      <p className="mt-1 text-sm text-zinc-500">
        Datos de tu usuario y rol en el sistema.
      </p>
      <dl className="mt-6 divide-y divide-zinc-200 rounded-xl border border-zinc-200 bg-white">
        <div className="flex justify-between px-4 py-3">
          <dt className="text-sm text-zinc-500">Nombre</dt>
          <dd className="text-sm font-medium">{session?.user?.name}</dd>
        </div>
        <div className="flex justify-between px-4 py-3">
          <dt className="text-sm text-zinc-500">Correo</dt>
          <dd className="text-sm font-medium">{session?.user?.email}</dd>
        </div>
        <div className="flex justify-between px-4 py-3">
          <dt className="text-sm text-zinc-500">Rol</dt>
          <dd className="text-sm font-medium">
            {session?.user?.role === "ADMIN" ? "Administrador" : "Solo lectura"}
          </dd>
        </div>
      </dl>
    </div>
  );
}