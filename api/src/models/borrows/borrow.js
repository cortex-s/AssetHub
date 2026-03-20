import { db } from "../../lib/db.js";

// Asset Interface
/**
 * @typedef {object} asset
 * @property {string} id
 * @property {string} name
 */

// Data Interface
/**
 * @typedef {object} data
 * @property {string} userId
 * @property {string} borrowerName
 * @property {Date} borrowDate
 * @property {Date} dueDate
 * @property {Date | null} returnDate
 * @property {string | null} internalNotes
 */

/**
 * @param {asset} asset
 * @param {data} data
 * @param {string} approvedById
 */
export async function borrow(asset, data, approvedById) {
  await db.query(
    `INSERT INTO Borrows 
      (id, assetName, assetId, userId, borrowerName, borrowDate, dueDate, returnDate, internalNotes, approvedById, createdAt) 
     VALUES (UUID(), ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW())`,
    [
      asset.name,
      asset.id,
      data.userId,
      data.borrowerName,
      data.borrowDate,
      data.dueDate,
      data.returnDate || null,
      data.internalNotes || null,
      approvedById,
    ],
  );
  await db.query("UPDATE Assets SET status = ? WHERE id = ?", [
    "borrowed",
    asset.id,
  ]);
}
