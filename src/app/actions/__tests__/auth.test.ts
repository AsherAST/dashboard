import { describe, expect, it, vi, beforeEach } from "vitest";

const mockDb = vi.hoisted(() => ({
  user: {
    findUnique: vi.fn(),
    create: vi.fn(),
  },
}));

const MockAuthError = vi.hoisted(
  () =>
    class MockAuthError extends Error {
      override name = "AuthError";
    },
);

const mockSignIn = vi.hoisted(() => vi.fn());
const mockSignOut = vi.hoisted(() => vi.fn());

vi.mock("@/lib/db", () => ({ db: mockDb }));
vi.mock("next-auth", () => ({ AuthError: MockAuthError }));
vi.mock("@/auth", () => ({
  signIn: mockSignIn,
  signOut: mockSignOut,
}));

import { login, logout, register } from "@/app/actions/auth";

function form(data: Record<string, string>) {
  const f = new FormData();
  for (const [k, v] of Object.entries(data)) f.set(k, v);
  return f;
}

describe("register", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("rechaza datos inválidos", async () => {
    const result = await register(
      undefined,
      form({ name: "A", email: "x", password: "123" }),
    );
    expect(result?.error).toBeTruthy();
    expect(mockDb.user.create).not.toHaveBeenCalled();
  });

  it("rechaza correo ya registrado", async () => {
    mockDb.user.findUnique.mockResolvedValue({ id: "u1" });
    const result = await register(
      undefined,
      form({ name: "Ana", email: "ana@dashboard.cl", password: "secreta123" }),
    );
    expect(result?.error).toBe("Ya existe una cuenta con ese correo.");
  });

  it("crea el usuario y llama signIn", async () => {
    mockDb.user.findUnique.mockResolvedValue(null);
    mockDb.user.create.mockResolvedValue({ id: "u1" });
    mockSignIn.mockImplementation(() => {
      throw new Error("NEXT_REDIRECT");
    });
    await expect(
      register(
        undefined,
        form({ name: "Ana", email: "ana@dashboard.cl", password: "secreta123" }),
      ),
    ).rejects.toThrow("NEXT_REDIRECT");
    expect(mockDb.user.create).toHaveBeenCalledTimes(1);
    expect(mockSignIn).toHaveBeenCalledWith(
      "credentials",
      expect.objectContaining({ redirectTo: "/inicio" }),
    );
  });
});

describe("login", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("devuelve error de credenciales con AuthError", async () => {
    mockSignIn.mockRejectedValue(new MockAuthError("creds"));
    const result = await login(
      undefined,
      form({ email: "a@b.cl", password: "x" }),
    );
    expect(result?.error).toBe("Credenciales incorrectas.");
  });
});

describe("logout", () => {
  it("cierra sesión redirigiendo a /login", async () => {
    await logout();
    expect(mockSignOut).toHaveBeenCalledWith({ redirectTo: "/login" });
  });
});