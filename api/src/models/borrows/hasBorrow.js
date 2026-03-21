import { db } from "../../lib/db.js";
import { $Enums } from "../../lib/generated/prisma/index.js";
/**
 * @typedef {object} Borrow
 * @property {string} id
 * @property {string} assetId
 * @property {string} assetCode
 * @property {string} assetName
 * @property {string} serialNo
 * @property {string} borrowerName
 * @property {string | null} internalNotes
 * @property {string | null} publicReturnedNotes
 * @property {string} approvedById
 * @property {$Enums.BorrowsStatus} status
 * @property {Date} borrowDate 
 * @property {Date} dueDate
 * @property {Date | null} returnDate
 */

/**
 * @template {keyof Borrow} K
 * @param {string} id
 * @param {K[]} columns
 * @returns {Promise<Pick<Borrow, K> | null>}
 */
export async function hasBorrow(id, columns) {
    const cols = columns.join(", ");
    const [assetRows] = /** @type {[Borrow[], any]} */ (
        await db.query(
            `SELECT ${cols} FROM Borrows WHERE id = ?`,
            [id],
        )
    );

    return assetRows[0] || null;
}
