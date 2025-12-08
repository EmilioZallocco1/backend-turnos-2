import type { Request } from "express";
import { crearMockResponse } from "../test/helpers/mockResponse.js";

// mock del ORM
let emMock: any;

jest.mock("../src/shared/db/orm.js", () => {
  emMock = {
    findOne: jest.fn(),       // ← necesitamos esto
    create: jest.fn(),
    persistAndFlush: jest.fn(),
  };

  return {
    orm: {
      em: {
        fork: () => emMock,   // ← así register obtiene emMock
      },
    },
  };
});

// importar el controller *después* del mock
import { register } from "../src/paciente/paciente.controler.js";
import { Paciente } from "../src/paciente/paciente.entity.js";

describe("register - Email duplicado", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("debería devolver 400 si el email ya está en uso", async () => {
    // Arrange
    const req = {
      body: {
        nombre: "Juan",
        apellido: "Pérez",
        email: "existe@test.com",
        password: "123456",
        obraSocialId: 1,
      },
    } as unknown as Request;

    const res = crearMockResponse();

    // Simulamos que el email YA está en uso
    emMock.findOne.mockResolvedValueOnce({ id: 123 });

    // Act
    await register(req, res);

    // Assert
    expect(emMock.findOne).toHaveBeenCalledWith(Paciente, {
      email: "existe@test.com",
    });

    expect(res.status).toHaveBeenCalledWith(400);

    expect(res.json).toHaveBeenCalledWith({
      message: "El email ya está en uso.",
    });
  });
});
