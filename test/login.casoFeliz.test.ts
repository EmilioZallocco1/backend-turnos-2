import type { Request } from "express";
import { crearMockResponse } from "./helpers/mockResponse";

// --- MOCK DEL ORM ---
let emMock: any;

jest.mock("../src/shared/db/orm.js", () => {
  emMock = {
    findOne: jest.fn(),
  };

  return {
    orm: {
      em: emMock, // el servicio usa orm.em directamente (resuelto por request)
    },
  };
});

// --- MOCK DE BCRYPT ---
jest.mock("bcrypt", () => ({
  compare: jest.fn(),
}));

// --- MOCK DE AUTH UTILS (evita que signSessionToken necesite JWT_SECRET) ---
jest.mock("../src/auth/auth.utils.js", () => ({
  signSessionToken: jest.fn().mockReturnValue("fake-token"),
  setSessionCookie: jest.fn(),
  clearSessionCookie: jest.fn(),
  verifySessionToken: jest.fn(),
}));

import { login } from "../src/paciente/paciente.controler.js";
import bcrypt from "bcrypt";
import { Paciente } from "../src/paciente/paciente.entity.js";

const compareMock = bcrypt.compare as unknown as jest.Mock;

describe("login - caso feliz", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("debería devolver 200 cuando usuario existe y la contraseña coincide", async () => {
    // Arrange
    const usuarioFake = {
      id: 1,
      email: "user@test.com",
      passwordHash: "hashedPassword",
      nombre: "Juan",
      apellido: "Pérez",
      role: "paciente",
    };

    emMock.findOne.mockResolvedValueOnce(usuarioFake);
    compareMock.mockResolvedValueOnce(true);

    const req = {
      body: {
        email: "user@test.com",
        password: "correcta123",
      },
    } as unknown as Request;

    const res = crearMockResponse();
    const next = jest.fn();

    // Act
    await login(req, res, next);

    // Assert
    expect(next).not.toHaveBeenCalled();
    expect(emMock.findOne).toHaveBeenCalledWith(Paciente, {
      email: "user@test.com",
    }, { populate: ["obraSocial"] });
    expect(compareMock).toHaveBeenCalledWith("correcta123", "hashedPassword");
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      message: "Login exitoso",
      data: {
        id: 1,
        nombre: "Juan",
        apellido: "Pérez",
        email: "user@test.com",
        role: "paciente",
      },
    });
  });
});
