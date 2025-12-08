import { esTelefonoValido } from "../src/utils/validarTelefono";

describe("esTelefonoValido", () => {
  test("debería devolver true para teléfonos válidos", () => {
    expect(esTelefonoValido("3411234567")).toBe(true);
    expect(esTelefonoValido("+543411234567")).toBe(true);
    expect(esTelefonoValido("1122334455")).toBe(true);
  });

  test("debería devolver false para teléfonos inválidos", () => {
    expect(esTelefonoValido("1234567")).toBe(false);         // muy corto
    expect(esTelefonoValido("1234567890123456")).toBe(false); // muy largo
    expect(esTelefonoValido("341-1234567")).toBe(false);     // guiones
    expect(esTelefonoValido("tel123456")).toBe(false);       // letras
    expect(esTelefonoValido("")).toBe(false);                // vacío
    expect(esTelefonoValido("   ")).toBe(false);             // espacios
  });
});
