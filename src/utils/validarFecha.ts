export function esFechaValida(fechaStr: string): boolean {
  if (typeof fechaStr !== "string") return false;

  // Formato básico YYYY-MM-DD
  if (!/^\d{4}-\d{2}-\d{2}$/.test(fechaStr)) return false;

  const [anioStr, mesStr, diaStr] = fechaStr.split("-");
  const anio = Number(anioStr);
  const mes = Number(mesStr);      // 1-12
  const dia = Number(diaStr);      // 1-31

  const fecha = new Date(fechaStr);

  // Comprobar que Date la interpretó bien
  if (Number.isNaN(fecha.getTime())) return false;

  // Verificar que coincida (Date puede ajustar valores inválidos)
  const mismoAnio = fecha.getUTCFullYear() === anio;
  const mismoMes = fecha.getUTCMonth() + 1 === mes; // getUTCMonth es 0-11
  const mismoDia = fecha.getUTCDate() === dia;

  return mismoAnio && mismoMes && mismoDia;
}
