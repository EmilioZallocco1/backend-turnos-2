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
      em: {
        fork: () => emMock, // esto es lo que usa tu controller
      },
    },
  };
});

// importa findOne DESPUÉS del mock
import { findOne } from "../src/paciente/paciente.controler.js";
import { Paciente } from "../src/paciente/paciente.entity.js";

describe("findOne", () => {
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

    // Act
    await findOne(req, res);

    // Assert
    expect(emMock.findOneOrFail).toHaveBeenCalledWith(
      Paciente,
      { id: 10 },
      { populate: ["turnos", "obraSocial"] }
    );
    expect(status).toHaveBeenCalledWith(200);
    expect(json).toHaveBeenCalledWith({ message: "ok", data: pacienteFake });
  });

  test("devuelve 500 cuando findOneOrFail tira error", async () => {
    emMock.findOneOrFail.mockRejectedValue(new Error("No encontrado"));

    const req = {
      params: { id: "999" },
    } as unknown as Request;

    const json = jest.fn();
    const status = jest.fn(() => ({ json }));
    const res = { status, json } as unknown as Response;

    await findOne(req, res);

    expect(status).toHaveBeenCalledWith(500);
    expect(json).toHaveBeenCalledWith({ message: "No encontrado" });
  });
});
