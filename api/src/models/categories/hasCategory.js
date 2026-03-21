import { db } from "../../lib/db.js";
import { Prisma } from "../../lib/generated/prisma/index.js";

/**
 * @typedef {object} Category
 * @property {string} id
 * @property {string} name
 * @property {string | null} description
 */

/**
 * @template {keyof Omit<Prisma.CategoriesSelect, "_count">} K
 * @param {string} id
 * @param {K[]} columns
 * @returns {Promise<Pick<Category, K> | null>}
 */
export async function hasCategory(id, columns) {
  const cols = columns.join(", ");
  const [rows] = /** @type {[Category[], any]} */ (
    await db.query(
      `SELECT ${cols} FROM Categories WHERE id = ? AND deletedAt IS NULL`,
      [id],
    )
  );
  return rows[0] || null;
}
