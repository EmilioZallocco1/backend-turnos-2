export interface AuthenticatedUser {
  id: number;
  email: string;
  nombre: string;
  apellido: string;
  role: string;
}

export interface SessionJwtPayload {
  sub: string;
  iat?: number;
  exp?: number;
}
