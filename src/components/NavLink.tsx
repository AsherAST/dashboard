"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  BoxIcon,
  CartIcon,
  HomeIcon,
  ShieldIcon,
  UserIcon,
  UsersIcon,
} from "@/components/icons";

const ICONS: Record<string, React.ComponentType<{ className?: string }>> = {
  home: HomeIcon,
  box: BoxIcon,
  cart: CartIcon,
  user: UserIcon,
  users: UsersIcon,
  shield: ShieldIcon,
};

export function NavLink({
  href,
  icon,
  children,
}: {
  href: string;
  icon: keyof typeof ICONS;
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const active = pathname === href || pathname.startsWith(`${href}/`);
  const Icon = ICONS[icon] ?? HomeIcon;

  return (
    <Link
      href={href}
      className={`group flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-all ${
        active
          ? "bg-white/10 text-white shadow-sm ring-1 ring-inset ring-white/10"
          : "text-slate-400 hover:bg-white/5 hover:text-white"
      }`}
    >
      <span
        className={`flex h-6 w-6 items-center justify-center transition-colors ${
          active
            ? "text-indigo-400"
            : "text-slate-500 group-hover:text-slate-300"
        }`}
      >
        <Icon className="h-[18px] w-[18px]" />
      </span>
      {children}
    </Link>
  );
}
