import type { Request, Response } from "express";
import jwt from "jsonwebtoken";
import {
  getAuthCookieName,
  getAuthCookieOptions,
  getClearAuthCookieOptions,
  getJwtExpiresIn,
  getJwtSecret,
} from "./auth.config.js";
import type { SessionJwtPayload } from "./auth.types.js";

function parseCookieHeader(cookieHeader?: string) {
  if (!cookieHeader) {
    return {};
  }

  return cookieHeader.split(";").reduce<Record<string, string>>((cookies, cookieEntry) => {
    const [rawName, ...rawValueParts] = cookieEntry.split("=");
    const name = rawName?.trim();

    if (!name) {
      return cookies;
    }

    cookies[name] = decodeURIComponent(rawValueParts.join("=").trim());
    return cookies;
  }, {});
}

export function signSessionToken(userId: number) {
  return jwt.sign({ sub: String(userId) }, getJwtSecret(), {
    expiresIn: getJwtExpiresIn(),
  });
}

export function verifySessionToken(token: string) {
  return jwt.verify(token, getJwtSecret()) as SessionJwtPayload;
}

export function readSessionTokenFromRequest(req: Request) {
  const cookies = parseCookieHeader(req.headers.cookie);
  return cookies[getAuthCookieName()];
}

export function setSessionCookie(res: Response, token: string) {
  res.cookie(getAuthCookieName(), token, getAuthCookieOptions());
}

export function clearSessionCookie(res: Response) {
  res.clearCookie(getAuthCookieName(), getClearAuthCookieOptions());
}
