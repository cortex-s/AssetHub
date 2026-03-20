import { db } from "../../lib/db.js";

/**
 * Soft-delete an asset by setting deletedAt
 * @param {string} id - Asset ID
 * @returns {Promise<{affectedRows: number}>} Result object containing affectedRows
 */
export async function del(id) {
  const [result] = await db.execute(
    `UPDATE Assets SET deletedAt = NOW() 
     WHERE id = ? AND deletedAt IS NULL;`,
    [id],
  );
  return /** @type {{affectedRows:number}} */ (result);
}
