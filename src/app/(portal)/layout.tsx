import Link from "next/link";
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { LogoutButton } from "@/components/LogoutButton";
import { NavLink } from "@/components/NavLink";

const links = [
  { href: "/inicio", label: "Inicio", icon: "🏠" },
  { href: "/inventario", label: "Inventario", icon: "📦" },
  { href: "/ventas", label: "Ventas", icon: "🛒" },
  { href: "/cuenta", label: "Mi cuenta", icon: "👤" },
];

export default async function PortalLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();
  if (!session?.user) redirect("/login");

  return (
    <div className="flex min-h-screen">
      <aside className="flex w-60 shrink-0 flex-col border-r border-zinc-200 bg-white">
        <div className="border-b border-zinc-200 px-5 py-4">
          <p className="font-semibold text-neutral-900">Panel de gestión</p>
          <p className="text-xs text-zinc-400">Inventario y ventas</p>
        </div>
        <nav className="flex flex-col gap-1 p-3">
          {links.map((link) => (
            <NavLink key={link.href} href={link.href}>
              <span className="text-sm">{link.icon}</span>
              {link.label}
            </NavLink>
          ))}
        </nav>
        <div className="mt-auto flex flex-col gap-3 border-t border-zinc-200 p-4">
          <div className="flex items-center justify-between text-sm">
            <span className="truncate text-zinc-500">
              {session.user.name}
            </span>
            <span
              className={`rounded-full px-2 py-0.5 text-xs font-medium ${
                session.user.role === "ADMIN"
                  ? "bg-zinc-900 text-white"
                  : "bg-zinc-100 text-zinc-700"
              }`}
            >
              {session.user.role === "ADMIN" ? "ADMIN" : "VIEWER"}
            </span>
          </div>
          <LogoutButton />
        </div>
      </aside>
      <main className="flex flex-1 flex-col">
        <header className="border-b border-zinc-200 bg-white px-8 py-4">
          <Link href="/inicio" className="text-sm font-medium text-zinc-700">
            Dashboard / Sistema de gestión
          </Link>
        </header>
        <div className="flex-1 p-8">{children}</div>
      </main>
    </div>
  );
}