import { db } from "../../lib/db.js";

// Asset Interface
/**
 * @typedef {object} asset
 * @property {string} assetCode
 * @property {string} serialNo
 * @property {string} name
 * @property {string | null} notes
 * @property {string | null} categoryId
 */

/**
 * @param {asset} data
 */
export async function insert(data) {
  await db.execute(
    `INSERT INTO Assets (id, assetCode, serialNo, name, notes, categoryId) VALUES (UUID(), ?, ?, ?, ?, ?)`,
    [data.assetCode, data.serialNo, data.name, data.notes, data.categoryId],
  ); // ไม่ใส่ status เพราะก่อนจะให้ยืมก็ต้องมีของในระบบก่อน ดังนั้น status จะต้องเป็น available ก่อนเท่านั้น
}
