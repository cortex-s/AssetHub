import "dotenv/config";
import { Redis } from "ioredis";

/**
 * @typedef {globalThis & { redis?: Redis }} GlobalRedis
 */

/** @type {GlobalRedis} */
const globalForRedis = globalThis;

/** @type {string | undefined} */
const redisUrl = process.env.REDIS_URI;

if (!redisUrl) {
  throw new Error("REDIS_URI is not defined");
}

/** @type {Redis} */
export const redis = globalForRedis.redis ?? new Redis(redisUrl);

if (process.env.NODE_ENV !== "production") {
  globalForRedis.redis = redis;
}
