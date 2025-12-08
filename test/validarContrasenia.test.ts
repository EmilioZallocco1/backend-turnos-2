import { esContraseniaValida } from "../src/utils/validarContrasenia";

describe("esContraseniaValida", () => {
  test("debería devolver true para contraseñas válidas", () => {
    expect(esContraseniaValida("abc12345")).toBe(true);
    expect(esContraseniaValida("Password1")).toBe(true);
    expect(esContraseniaValida("miPass2024")).toBe(true);
  });

  test("debería devolver false para contraseñas inválidas", () => {
    expect(esContraseniaValida("1234567")).toBe(false);       // muy corta
    expect(esContraseniaValida("abcdefgh")).toBe(false);      // solo letras
    expect(esContraseniaValida("12345678")).toBe(false);      // solo números
    expect(esContraseniaValida("")).toBe(false);              // vacía
    expect(esContraseniaValida("   ")).toBe(false);           // espacios
  });
});
