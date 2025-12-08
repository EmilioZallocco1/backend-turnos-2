import { esEmailValido } from '../src/utils/validarEmail';

describe('esEmailValido', () => {

  test('debería devolver true para emails válidos', () => {
    expect(esEmailValido("test@example.com")).toBe(true);
    expect(esEmailValido("juan.perez@dominio.net")).toBe(true);
    expect(esEmailValido("user123@correo.com")).toBe(true);
  });

  test('debería devolver false para emails inválidos', () => {
    expect(esEmailValido("test@.com")).toBe(false);
    expect(esEmailValido("test@com")).toBe(false);
    expect(esEmailValido("@example.com")).toBe(false);
    expect(esEmailValido("user@example")).toBe(false);
    expect(esEmailValido("userexample.com")).toBe(false);
    expect(esEmailValido(" ")).toBe(false);
    expect(esEmailValido("test@@example.com")).toBe(false);
  });

  

describe("esEmailValido - prueba rápida", () => {
  test("pepito3 debe ser inválido", () => {
    expect(esEmailValido("pepito3")).toBe(false);
  });

  test("pepito3@gmail.com debe ser válido", () => {
    expect(esEmailValido("pepito3@gmail.com")).toBe(true);
  });
});


});
