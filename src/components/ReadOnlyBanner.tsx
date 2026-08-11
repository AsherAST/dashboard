export function ReadOnlyBanner() {
  return (
    <div className="mb-6 rounded-lg border border-sky-200 bg-sky-50 px-4 py-3 text-sm text-sky-700">
      Estás en modo <strong>solo lectura</strong>. Las acciones de
      administración están deshabilitadas para este rol.
    </div>
  );
}