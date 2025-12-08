import type { Request } from "express";
import { crearMockResponse } from "./helpers/mockResponse";

// --- MOCK DEL ORM ---
let emMock: any;

jest.mock("../src/shared/db/orm.js", () => {
  emMock = {
    findOne: jest.fn(), // ← necesario
  };

  return {
    orm: {
      em: {
        fork: () => emMock,
      },
    },
  };
});

// --- MOCK DE BCRYPT ---
jest.mock("bcrypt", () => ({
  compare: jest.fn(),
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
    };

    // 1️⃣ em.findOne devuelve un usuario
    emMock.findOne.mockResolvedValueOnce(usuarioFake);

    // 2️⃣ compare devuelve true (contraseña válida)
    compareMock.mockResolvedValueOnce(true);

    const req = {
      body: {
        email: "user@test.com",
        password: "correcta123",
      },
    } as unknown as Request;

    const res = crearMockResponse();

    // Act
    await login(req, res);

    // Assert
    expect(emMock.findOne).toHaveBeenCalledWith(Paciente, {
      email: "user@test.com",
    });

    expect(compareMock).toHaveBeenCalledWith(
      "correcta123",
      "hashedPassword"
    );

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      message: "Login exitoso",
      data: usuarioFake,
    });
  });
});
