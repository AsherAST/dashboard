import { describe, expect, it } from "vitest";
import {
  parseInventoryParams,
  buildInventoryUrl,
  parseOrdersParams,
  buildOrdersUrl,
} from "@/lib/params";
import { OrderStatus } from "@/generated/prisma/enums";

describe("parseInventoryParams", () => {
  it("devuelve consulta vacía sin filtros", () => {
    expect(parseInventoryParams({})).toEqual({});
  });

  it("mapea búsqueda, categoría, stock y orden", () => {
    const result = parseInventoryParams({
      q: "teclado",
      categoria: "Periféricos",
      stock: "bajo",
      orden: "stock-asc",
    });
    expect(result).toEqual({
      search: "teclado",
      category: "Periféricos",
      stockState: "bajo",
      sort: "stock-asc",
    });
  });

  it("parsea la página", () => {
    const result = parseInventoryParams({ pagina: "3" });
    expect(result).toEqual({ page: 3 });
  });

  it("descarta consultas con valores no válidos", () => {
    const result = parseInventoryParams({ stock: "malo" });
    expect(result).toEqual({});
  });

  it("usa el primer valor si llega un array", () => {
    const result = parseInventoryParams({ q: ["hola", "chao"] });
    expect(result?.search).toBe("hola");
  });
});

describe("buildInventoryUrl", () => {
  it("arma query string omitiendo valores vacíos", () => {
    expect(
      buildInventoryUrl({ q: "mouse", categoria: undefined, stock: "agotado" }),
    ).toBe("/inventario?q=mouse&stock=agotado");
  });

  it("sin junto a la base", () => {
    expect(buildInventoryUrl({})).toBe("/inventario");
  });
});

describe("parseOrdersParams", () => {
  it("mapea estado y orden", () => {
    const result = parseOrdersParams({
      estado: OrderStatus.SHIPPED,
      orden: "total-desc",
    });
    expect(result).toEqual({
      status: OrderStatus.SHIPPED,
      sort: "total-desc",
    });
  });

  it("descarta un estado inválido", () => {
    const result = parseOrdersParams({ estado: "NOEXISTE" });
    expect(result).toEqual({});
  });
});

describe("buildOrdersUrl", () => {
  it("arma la URL de ventas", () => {
    expect(buildOrdersUrl({ q: "maria", estado: "PAID" })).toBe(
      "/ventas?q=maria&estado=PAID",
    );
  });
});