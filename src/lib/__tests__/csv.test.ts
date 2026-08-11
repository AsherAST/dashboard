import { describe, expect, it } from "vitest";
import { toCsv } from "@/lib/csv";

describe("toCsv", () => {
  it("une filas con salto de línea y celdas con coma", () => {
    const csv = toCsv([
      ["A", "B"],
      [1, 2],
    ]);
    expect(csv).toBe("A,B\n1,2");
  });

  it("protege celdas con comas, comillas y saltos de línea", () => {
    const csv = toCsv([['Hola, mundo', 'di "hola"', "línea\nnueva"]]);
    expect(csv).toBe('"Hola, mundo","di ""hola""","línea\nnueva"');
  });
});