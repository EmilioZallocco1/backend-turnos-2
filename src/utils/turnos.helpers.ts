// utils/turnos.helpers.ts
export function combineDateAndTime(fecha: Date | string, horaHHmm: string): Date {
  const d = new Date(fecha);
  const [hh, mm] = horaHHmm.split(':').map(Number);
  const res = new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate(), hh, mm, 0));
  return res; // UTC para evitar problemas de TZ
}

export function addMinutes(dt: Date, minutes: number): Date {
  return new Date(dt.getTime() + minutes * 60_000);
}

export function startOfDayUTC(dt: Date): Date {
  return new Date(Date.UTC(dt.getUTCFullYear(), dt.getUTCMonth(), dt.getUTCDate(), 0, 0, 0));
}

export function endOfDayUTC(dt: Date): Date {
  return new Date(Date.UTC(dt.getUTCFullYear(), dt.getUTCMonth(), dt.getUTCDate(), 23, 59, 59, 999));
}

// A=[iniA, finA) y B=[iniB, finB) se solapan si:
export function intervalsOverlap(iniA: Date, finA: Date, iniB: Date, finB: Date): boolean {
  return iniA < finB && finA > iniB;
}
