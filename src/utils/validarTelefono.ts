export function esTelefonoValido(telefono: string): boolean {
  if (typeof telefono !== "string") return false;

  // Permitimos un + al inicio
  const limpio = telefono.trim();

  // + opcional al inicio, luego solo dígitos
  if (!/^\+?\d+$/.test(limpio)) return false;

  // cantidad de dígitos reales (sin el +)
  const soloDigitos = limpio.replace("+", "");
  const len = soloDigitos.length;

  return len >= 8 && len <= 15;
}
