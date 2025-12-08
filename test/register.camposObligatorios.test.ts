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
      em: {
        fork: () => emMock,
      },
    },
  };
});

// Importar DESPUÉS del mock
import { register } from "../src/paciente/paciente.controler.js";

describe("register - validación de campos obligatorios", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("debería devolver 400 si falta al menos un campo obligatorio", async () => {
    // Falta 'apellido'
    const req = {
      body: {
        nombre: "Juan",
        email: "juan@test.com",
        password: "123456",
        obraSocialId: 1,
      },
    } as unknown as Request;

    const res = crearMockResponse();

    // Ejecutar
    await register(req, res);

    // Validar
    expect(res.status).toHaveBeenCalledWith(400);

    expect(res.json).toHaveBeenCalledWith({
      message:
        "Nombre, apellido, email, contraseña y obra social son obligatorios.",
    });
  });
});
