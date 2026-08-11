import Link from "next/link";
import { LoginForm } from "@/components/auth/LoginForm";
import { SparkIcon } from "@/components/icons";

export default function LoginPage() {
  return (
    <main className="flex flex-1 items-center justify-center px-6 py-12">
      <div className="w-full max-w-md">
        <div className="mb-8 flex flex-col items-center text-center">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-500 to-violet-600 text-white shadow-lg shadow-indigo-500/30">
            <SparkIcon />
          </div>
          <h1 className="mt-4 text-2xl font-bold tracking-tight text-slate-900">
            Iniciar sesión
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            Accede al panel de gestión.
          </p>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm shadow-slate-200/60">
          <div className="mb-5 rounded-xl border border-slate-200 bg-slate-50 p-4 text-xs leading-relaxed text-slate-600">
            <p className="mb-1 font-semibold uppercase tracking-wide text-slate-400">
              Cuentas demo
            </p>
            <p>
              Admin: <code className="font-mono font-medium">admin@dashboard.cl</code> /{" "}
              <code className="font-mono font-medium">admin1234</code>
            </p>
            <p>
              Viewer: <code className="font-mono font-medium">viewer@dashboard.cl</code> /{" "}
              <code className="font-mono font-medium">viewer1234</code>
            </p>
          </div>
          <LoginForm />
        </div>

        <p className="mt-6 text-center text-sm text-slate-500">
          ¿No tienes cuenta?{" "}
          <Link
            href="/registro"
            className="font-semibold text-indigo-600 hover:text-indigo-500"
          >
            Regístrate
          </Link>
        </p>
      </div>
    </main>
  );
}
