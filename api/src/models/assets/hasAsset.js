import { db } from "../../lib/db.js";
import { $Enums, Prisma } from "../../lib/generated/prisma/index.js";

/**
 * @typedef {object} Asset
 * @property {string} id
 * @property {string} assetCode
 * @property {string} serialNo
 * @property {string} name
 * @property {string | null} notes
 * @property {string | null} categoryId
 * @property {$Enums.AssetsStatus} status
 * @property {Date} createdAt
 * @property {Date | null} deletedAt
 */

/**
 * @template {keyof Asset} K
 * @param {string} id
 * @param {K[]} columns
 * @returns {Promise<Pick<Asset, K> | null>}
 */
export async function hasAsset(id, columns) {
  const cols = columns.join(", ");
  const [assetRows] = /** @type {[Asset[], any]} */ (
    await db.query(
      `SELECT ${cols} FROM Assets WHERE id = ? AND deletedAt IS NULL`,
      [id],
    )
  );

  return assetRows[0] || null;
}
