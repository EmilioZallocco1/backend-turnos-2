import type { Request } from "express";
import { crearMockResponse } from "../test/helpers/mockResponse.js";

// mock del ORM
let emMock: any;

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

// importar el controller *después* del mock
import { register } from "../src/paciente/paciente.controler.js";
import { Paciente } from "../src/paciente/paciente.entity.js";

describe("register - Email duplicado", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("debería llamar a next con error si el email ya está en uso", async () => {
    // Arrange
    const req = {
      body: {
        nombre: "Juan",
        apellido: "Pérez",
        email: "existe@test.com",
        password: "Test1234",   // contraseña válida: 8+ chars, letras y números
        obraSocialId: 1,
      },
    } as unknown as Request;

    const res = crearMockResponse();
    const next = jest.fn();

    // Simulamos que el email YA está en uso
    emMock.findOne.mockResolvedValueOnce({ id: 123 });

    // Act
    await register(req, res, next);

    // Assert
    expect(emMock.findOne).toHaveBeenCalledWith(Paciente, {
      email: "existe@test.com",
    });
    expect(next).toHaveBeenCalledWith(
      expect.objectContaining({
        message: "El email ya esta en uso.",
      })
    );
    expect(res.status).not.toHaveBeenCalled();
  });
});
