import { EyeIcon } from "@/components/icons";

export function ReadOnlyBanner() {
  return (
    <div className="mb-6 flex items-start gap-3 rounded-xl border border-sky-200 bg-sky-50 px-4 py-3 text-sm text-sky-800">
      <EyeIcon className="mt-0.5 h-4 w-4 shrink-0 text-sky-600" />
      <p>
        Estás en modo <strong>solo lectura</strong>. Las acciones de
        administración están deshabilitadas para este rol.
      </p>
    </div>
  );
}
