import type { Response } from "express";

export function crearMockResponse(): Response {
  const json = jest.fn();
  const status = jest.fn(() => ({ json }));
  return { status, json } as unknown as Response;
}
