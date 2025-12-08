export function esEmailValido(email: string): boolean {
  if (typeof email !== "string") return false;

  // Regex simple (no la compleja del RFC)
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
}
