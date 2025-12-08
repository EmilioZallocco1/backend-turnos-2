import { esFechaValida } from "../src/utils/validarFecha";

describe("esFechaValida", () => {
  test("debería devolver true para fechas válidas", () => {
    expect(esFechaValida("2024-01-01")).toBe(true);
    expect(esFechaValida("2023-12-31")).toBe(true);
    expect(esFechaValida("2000-02-29")).toBe(true); // año bisiesto
  });

  test("debería devolver false para fechas con formato inválido", () => {
    expect(esFechaValida("2024/01/01")).toBe(false); // formato raro
    expect(esFechaValida("01-01-2024")).toBe(false); // formato dd-mm-yyyy
    expect(esFechaValida("2024-1-1")).toBe(false);   // sin ceros
    expect(esFechaValida("texto")).toBe(false);      // cualquier cosa
  });

  test("debería devolver false para fechas inexistentes", () => {
    expect(esFechaValida("2024-13-01")).toBe(false); // mes 13
    expect(esFechaValida("2024-00-10")).toBe(false); // mes 0
    expect(esFechaValida("2024-02-30")).toBe(false); // febrero 30
    expect(esFechaValida("2023-11-31")).toBe(false); // noviembre 31
  });
});
