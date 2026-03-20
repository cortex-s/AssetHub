import { db } from "../../lib/db.js";

/**
 *
 * @param {string} userId
 * @returns {Promise<HasUser|null>}
 *
 * @typedef {object} HasUser
 * @property {string} id
 * @property {string} email
 * @property {string} firstname
 * @property {string} lastname
 * @property {string} role
 * @property {boolean} isVerified
 */
export async function hasUser(userId) {
  const [userRows] = /** @type {[HasUser[],any]} */ (
    await db.query(
      "SELECT id, email, firstname, lastname, role, isVerified FROM Users WHERE id = ? AND deletedAt IS NULL",
      [userId],
    )
  );

  // คืนค่า user object หรือ null
  return userRows[0] || null;
}
