import Link from "next/link";
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { LogoutButton } from "@/components/LogoutButton";
import { NavLink } from "@/components/NavLink";
import { ReadOnlyBanner } from "@/components/ReadOnlyBanner";
import { SparkIcon } from "@/components/icons";

const links = [
  { href: "/inicio", label: "Inicio", icon: "home" },
  { href: "/inventario", label: "Inventario", icon: "box" },
  { href: "/ventas", label: "Ventas", icon: "cart" },
  { href: "/cuenta", label: "Mi cuenta", icon: "user" },
];

export default async function PortalLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();
  if (!session?.user) redirect("/login");

  return (
    <div className="flex min-h-screen bg-slate-50">
      <aside className="fixed inset-y-0 left-0 z-20 flex w-64 shrink-0 flex-col bg-slate-900">
        <div className="flex items-center gap-3 px-5 py-5">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 to-violet-600 text-white shadow-lg shadow-indigo-900/40">
            <SparkIcon />
          </div>
          <div>
            <p className="text-sm font-semibold tracking-tight text-white">
              Panel de gestión
            </p>
            <p className="text-xs text-slate-400">Inventario y ventas</p>
          </div>
        </div>

        <nav className="mt-2 flex flex-col gap-1 px-3">
          <p className="px-3 pb-1 pt-2 text-[11px] font-semibold uppercase tracking-wider text-slate-500">
            Menú
          </p>
          {links.map((link) => (
            <NavLink key={link.href} href={link.href} icon={link.icon}>
              {link.label}
            </NavLink>
          ))}
          {session.user.role === "ADMIN" ? (
            <>
              <p className="px-3 pb-1 pt-4 text-[11px] font-semibold uppercase tracking-wider text-slate-500">
                Administración
              </p>
              <NavLink href="/admin" icon="users">
                Usuarios
              </NavLink>
            </>
          ) : null}
        </nav>

        <div className="mt-auto border-t border-slate-800 p-4">
          <div className="flex items-center gap-3 rounded-xl bg-slate-800/60 p-3">
            <div
              className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-xs font-bold text-white ${
                session.user.role === "ADMIN"
                  ? "bg-gradient-to-br from-indigo-500 to-violet-600"
                  : "bg-gradient-to-br from-sky-500 to-emerald-500"
              }`}
            >
              {(session.user.name ?? "U").slice(0, 1).toUpperCase()}
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-medium text-white">
                {session.user.name}
              </p>
              <p className="truncate text-xs text-slate-400">
                {session.user.email}
              </p>
            </div>
          </div>
          <div className="mt-3">
            <LogoutButton />
          </div>
        </div>
      </aside>

      <main className="ml-64 flex flex-1 flex-col">
        <header className="sticky top-0 z-10 border-b border-slate-200 bg-white/80 backdrop-blur">
          <div className="flex items-center justify-between px-8 py-4">
            <div>
              <p className="text-xs text-slate-400">Panel / Sistema de gestión</p>
              <Link
                href="/inicio"
                className="text-sm font-medium text-slate-700 hover:text-slate-900"
              >
                Dashboard
              </Link>
            </div>
            <span
              className={`rounded-full px-3 py-1 text-xs font-semibold ${
                session.user.role === "ADMIN"
                  ? "bg-indigo-50 text-indigo-700 ring-1 ring-inset ring-indigo-200"
                  : "bg-emerald-50 text-emerald-700 ring-1 ring-inset ring-emerald-200"
              }`}
            >
              {session.user.role === "ADMIN" ? "Administrador" : "Solo lectura"}
            </span>
          </div>
        </header>

        <div className="flex-1 p-8">
          {session.user.role === "VIEWER" ? <ReadOnlyBanner /> : null}
          {children}
        </div>
      </main>
    </div>
  );
}
