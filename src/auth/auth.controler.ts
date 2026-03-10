import jwt from "jsonwebtoken";

interface JwtPayload {
  id: number;
  role: string;
}

export function generarToken(payload: JwtPayload): string {
  const secret = process.env.JWT_SECRET || "dev-secret";

  return jwt.sign(payload, secret, { expiresIn: "1h" });
}