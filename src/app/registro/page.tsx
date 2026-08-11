import Link from "next/link";
import { RegisterForm } from "@/components/auth/RegisterForm";
import { SparkIcon } from "@/components/icons";

export default function RegisterPage() {
  return (
    <main className="flex flex-1 items-center justify-center px-6 py-12">
      <div className="w-full max-w-md">
        <div className="mb-8 flex flex-col items-center text-center">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-500 to-violet-600 text-white shadow-lg shadow-indigo-500/30">
            <SparkIcon />
          </div>
          <h1 className="mt-4 text-2xl font-bold tracking-tight text-slate-900">
            Crear cuenta
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            Regístrate para acceder al panel.
          </p>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm shadow-slate-200/60">
          <RegisterForm />
        </div>

        <p className="mt-6 text-center text-sm text-slate-500">
          ¿Ya tienes cuenta?{" "}
          <Link
            href="/login"
            className="font-semibold text-indigo-600 hover:text-indigo-500"
          >
            Inicia sesión
          </Link>
        </p>
      </div>
    </main>
  );
}
