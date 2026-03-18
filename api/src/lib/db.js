import { createPool } from "mysql2/promise";

/** @type {globalThis & { db?: import("mysql2/promise").Pool }} */
const globalForDb = globalThis;

export const db = globalForDb.db ?? createPool(process.env.DATABASE_URL);
if (process.env.NODE_ENV !== "production") {
  globalForDb.db = db;
}
