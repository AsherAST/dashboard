import { describe, expect, it } from "vitest";
import { loginSchema, registerSchema } from "@/lib/validators";

describe("loginSchema", () => {
  it("acepta credenciales válidas", () => {
    const result = loginSchema.safeParse({
      email: "admin@dashboard.cl",
      password: "admin1234",
    });
    expect(result.success).toBe(true);
  });

  it("rechaza correo inválido", () => {
    const result = loginSchema.safeParse({
      email: "no-es-un-correo",
      password: "admin1234",
    });
    expect(result.success).toBe(false);
  });

  it("rechaza contraseña vacía", () => {
    const result = loginSchema.safeParse({
      email: "admin@dashboard.cl",
      password: "",
    });
    expect(result.success).toBe(false);
  });
});

describe("registerSchema", () => {
  it("acepta datos válidos", () => {
    const result = registerSchema.safeParse({
      name: "Ana Pérez",
      email: "ana@dashboard.cl",
      password: "clave1234",
    });
    expect(result.success).toBe(true);
  });

  it("rechaza nombre corto y contraseña corta", () => {
    const result = registerSchema.safeParse({
      name: "A",
      email: "ana@dashboard.cl",
      password: "123",
    });
    expect(result.success).toBe(false);
  });
});