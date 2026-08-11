import { describe, expect, it } from "vitest";
import { formatPrice, formatShortId, orderStatusInfo } from "@/lib/format";

describe("formatPrice", () => {
  it("formatea en pesos chilenos", () => {
    expect(formatPrice(45990)).toBe("$45.990");
  });
});

describe("formatShortId", () => {
  it("muestra los primeros 8 caracteres en mayúsculas", () => {
    expect(formatShortId("abcdefgh1234")).toBe("ABCDEFGH");
  });
});

describe("orderStatusInfo", () => {
  it("mapea cada estado a su etiqueta", () => {
    expect(orderStatusInfo("PENDING").label).toBe("Pendiente");
    expect(orderStatusInfo("PAID").label).toBe("Pagado");
    expect(orderStatusInfo("SHIPPED").label).toBe("Enviado");
    expect(orderStatusInfo("DELIVERED").label).toBe("Entregado");
    expect(orderStatusInfo("CANCELLED").label).toBe("Cancelado");
  });

  it("devuelve clases de badge", () => {
    expect(orderStatusInfo("CANCELLED").className).toContain("bg-red-100");
  });
});