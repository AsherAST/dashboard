export function toCsv(rows: (string | number)[][]): string {
  return rows
    .map((row) =>
      row
        .map((cell) => {
          const value = String(cell ?? "");
          if (/[",\n]/.test(value)) {
            return `"${value.replace(/"/g, '""')}"`;
          }
          return value;
        })
        .join(","),
    )
    .join("\n");
}

export function csvHeaders(headers: Record<string, string>): string {
  return `attachment; filename="${headers.filename}"; filename*=UTF-8''${encodeURIComponent(headers.filename)}`;
}