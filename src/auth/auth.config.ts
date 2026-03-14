import type { CookieOptions } from "express";
import type { SignOptions } from "jsonwebtoken";
import "../shared/config/loadEnv.js";

const DEFAULT_ALLOWED_ORIGINS = [
  "http://localhost:4200",
  "https://turnos-frontend-tau.vercel.app",
];

function requireEnv(name: string): string {
  const value = process.env[name]?.trim();

  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`);
  }

  return value;
}

function parseDurationToMs(value: string): number {
  const trimmedValue = value.trim();

  if (/^\d+$/.test(trimmedValue)) {
    return Number(trimmedValue) * 1000;
  }

  const match = trimmedValue.match(/^(\d+)(ms|s|m|h|d)$/i);
  if (!match) {
    throw new Error("JWT_EXPIRES_IN must be expressed in seconds or ms/s/m/h/d format");
  }

  const amount = Number(match[1]);
  const unit = match[2].toLowerCase();

  const multipliers: Record<string, number> = {
    ms: 1,
    s: 1000,
    m: 60_000,
    h: 3_600_000,
    d: 86_400_000,
  };

  return amount * multipliers[unit];
}

function normalizeSameSite(value: string | undefined): "lax" | "strict" | "none" {
  const normalizedValue = value?.trim().toLowerCase();

  if (normalizedValue === "strict" || normalizedValue === "none" || normalizedValue === "lax") {
    return normalizedValue;
  }

  return process.env.NODE_ENV === "production" ? "none" : "lax";
}

export function getJwtSecret() {
  return requireEnv("JWT_SECRET");
}

export function getJwtExpiresIn(): SignOptions["expiresIn"] {
  return (process.env.JWT_EXPIRES_IN?.trim() || "1h") as SignOptions["expiresIn"];
}

export function getJwtExpirationMs() {
  return parseDurationToMs(String(getJwtExpiresIn()));
}

export function getAuthCookieName() {
  return process.env.AUTH_COOKIE_NAME?.trim() || "session_token";
}

export function getAllowedOrigins() {
  const configuredOrigins = process.env.FRONTEND_ORIGINS
    ?.split(",")
    .map((origin) => origin.trim())
    .filter(Boolean);

  return configuredOrigins?.length ? configuredOrigins : DEFAULT_ALLOWED_ORIGINS;
}

export function getCookieSameSite() {
  return normalizeSameSite(process.env.AUTH_COOKIE_SAME_SITE);
}

export function isCookieSecure() {
  return process.env.NODE_ENV === "production" || getCookieSameSite() === "none";
}

export function getAuthCookieOptions(): CookieOptions {
  return {
    httpOnly: true,
    secure: isCookieSecure(),
    sameSite: getCookieSameSite(),
    path: "/",
    maxAge: getJwtExpirationMs(),
  };
}

export function getClearAuthCookieOptions(): CookieOptions {
  return {
    httpOnly: true,
    secure: isCookieSecure(),
    sameSite: getCookieSameSite(),
    path: "/",
  };
}
