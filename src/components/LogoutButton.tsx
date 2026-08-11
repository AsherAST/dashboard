"use client";

import { useTransition } from "react";
import { logout } from "@/app/actions/auth";
import { LogoutIcon } from "@/components/icons";

export function LogoutButton() {
  const [pending, startTransition] = useTransition();

  return (
    <button
      type="button"
      disabled={pending}
      onClick={() => startTransition(() => logout())}
      className="flex w-full items-center justify-center gap-2 rounded-lg border border-slate-700 px-3 py-2 text-sm font-medium text-slate-300 transition-colors hover:border-slate-500 hover:bg-slate-800 hover:text-white disabled:opacity-50"
    >
      <LogoutIcon className="h-4 w-4" />
      {pending ? "Saliendo…" : "Cerrar sesión"}
    </button>
  );
}
