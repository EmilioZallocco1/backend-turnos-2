import type { Request, Response } from "express";

// la vamos a rellenar dentro del mock
let emMock: { findOneOrFail: jest.Mock };

// --- MOCK DEL ORM  ---
jest.mock("../src/shared/db/orm.js", () => {
  emMock = {
    findOneOrFail: jest.fn(),
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

// importa findById DESPUÉS del mock
import { findById } from "../src/paciente/paciente.controler.js";
import { Paciente } from "../src/paciente/paciente.entity.js";

describe("findById", () => {
  test("devuelve 200 y el paciente cuando existe", async () => {
    // Arrange
    const pacienteFake = { id: 10, nombre: "María" };
    emMock.findOneOrFail.mockResolvedValue(pacienteFake);

    const req = {
      params: { id: "10" },
    } as unknown as Request;

    const json = jest.fn();
    const status = jest.fn(() => ({ json }));
    const res = { status, json } as unknown as Response;
    const next = jest.fn();

    // Act
    await findById(req, res, next);

    // Assert
    expect(emMock.findOneOrFail).toHaveBeenCalledWith(
      Paciente,
      { id: 10 },
      { populate: ["turnos", "obraSocial"] }
    );
    expect(status).toHaveBeenCalledWith(200);
    expect(json).toHaveBeenCalledWith({ message: "ok", data: pacienteFake });
  });

  test("llama a next con el error cuando findOneOrFail falla", async () => {
    const error = new Error("No encontrado");
    emMock.findOneOrFail.mockRejectedValue(error);

    const req = {
      params: { id: "999" },
    } as unknown as Request;

    const json = jest.fn();
    const status = jest.fn(() => ({ json }));
    const res = { status, json } as unknown as Response;
    const next = jest.fn();

    await findById(req, res, next);

    expect(next).toHaveBeenCalledWith(error);
    expect(status).not.toHaveBeenCalled();
  });
});
