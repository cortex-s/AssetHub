import "dotenv/config";
import jwt from "jsonwebtoken";

export const tokenExpiredSecond = 60 * 60;
const secret = process.env.JWT_SECRET;

/**
 * @template {object} T
 * @param {T} payload
 * @param {number} [expiresIn=60*60]
 */
export function signJwtToken(payload, expiresIn = tokenExpiredSecond) {
  return jwt.sign(payload, secret, {
    algorithm: "HS256",
    expiresIn,
  });
}
/**
 * @template T
 * @param {string} token
 * @returns {T & import("jsonwebtoken").JwtPayload}
 */
export function verifyJwtToken(token) {
  return /** @type {T & import("jsonwebtoken").JwtPayload} */ (
    jwt.verify(token, secret)
  );
}
