import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { db } from "@/lib/db";

export const metadata: Metadata = {
  title: "Usuarios | Dashboard",
  description: "Administración de usuarios del sistema.",
};

export const dynamic = "force-dynamic";

export default async function AdminPage() {
  const session = await auth();
  if (session?.user?.role !== "ADMIN") redirect("/inicio");

  const users = await db.user.findMany({
    orderBy: { createdAt: "desc" },
    select: { id: true, name: true, email: true, role: true, createdAt: true },
  });

  return (
    <div>
      <h1 className="text-xl font-semibold text-neutral-900">Usuarios</h1>
      <p className="mt-1 text-sm text-zinc-500">
        Solo administradores pueden ver esta página.
      </p>

      <div className="mt-4 overflow-x-auto rounded-xl border border-zinc-200 bg-white">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-zinc-200 text-left text-xs uppercase tracking-wide text-zinc-400">
              <th className="px-4 py-3 font-medium">Nombre</th>
              <th className="px-4 py-3 font-medium">Correo</th>
              <th className="px-4 py-3 font-medium">Rol</th>
              <th className="px-4 py-3 font-medium">Creado</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-100">
            {users.map((u) => (
              <tr key={u.id} className="hover:bg-zinc-50">
                <td className="px-4 py-3 font-medium text-neutral-900">
                  {u.name}
                </td>
                <td className="px-4 py-3 text-zinc-600">{u.email}</td>
                <td className="px-4 py-3">
                  <span
                    className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${
                      u.role === "ADMIN"
                        ? "bg-zinc-900 text-white"
                        : "bg-zinc-100 text-zinc-700"
                    }`}
                  >
                    {u.role}
                  </span>
                </td>
                <td className="px-4 py-3 text-zinc-500">
                  {new Intl.DateTimeFormat("es-CL", {
                    dateStyle: "medium",
                  }).format(u.createdAt)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}