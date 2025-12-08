export function esContraseniaValida(contrasenia: string): boolean {
  if (typeof contrasenia !== "string") return false;

  // Mínimo 8 caracteres
  if (contrasenia.length < 8) return false;

  // Al menos una letra y al menos un número
  const tieneLetra = /[A-Za-z]/.test(contrasenia);
  const tieneNumero = /\d/.test(contrasenia);

  return tieneLetra && tieneNumero;
}
