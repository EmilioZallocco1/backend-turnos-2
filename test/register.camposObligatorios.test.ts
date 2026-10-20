import type { Request } from "express";
import { crearMockResponse } from "./helpers/mockResponse";

let emMock: any;

// --- Mock del ORM ---
jest.mock("../src/shared/db/orm.js", () => {
  emMock = {
    findOne: jest.fn(),
    create: jest.fn(),
    persistAndFlush: jest.fn(),
  };

  return {
    orm: {
      em: emMock, // el servicio usa orm.em directamente (resuelto por request)
    },
  };
});

// --- Mock de bcrypt (módulo nativo, no disponible en sandbox de tests) ---
jest.mock("bcrypt", () => ({
  compare: jest.fn(),
  hash: jest.fn(),
}));

// --- Mock de auth utils ---
jest.mock("../src/auth/auth.utils.js", () => ({
  signSessionToken: jest.fn().mockReturnValue("fake-token"),
  setSessionCookie: jest.fn(),
  clearSessionCookie: jest.fn(),
  verifySessionToken: jest.fn(),
}));

// Importar DESPUÉS del mock
import { register } from "../src/paciente/paciente.controler.js";

describe("register - validación de campos obligatorios", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("debería llamar a next con error si falta al menos un campo obligatorio", async () => {
    // Falta 'apellido'
    const req = {
      body: {
        nombre: "Juan",
        email: "juan@test.com",
        password: "Test1234",
        obraSocialId: 1,
      },
    } as unknown as Request;

    const res = crearMockResponse();
    const next = jest.fn();

    // Ejecutar
    await register(req, res, next);

    // Validar: el error debe llegar a next (no al res directamente)
    expect(next).toHaveBeenCalledWith(
      expect.objectContaining({
        message: "Nombre, apellido, email, contrasena y obra social son obligatorios.",
      })
    );
    expect(res.status).not.toHaveBeenCalled();
  });
});
