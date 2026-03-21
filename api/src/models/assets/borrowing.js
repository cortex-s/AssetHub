// @ts-nocheck
import { db } from "../../lib/db.js";

export async function borrowing(assetId) {
    const [rows] = await db.query(
        `SELECT id 
     FROM Borrows 
     WHERE assetId = ? 
       AND status = ?`,
        [assetId, "borrowed"]
    );

    return rows[0];
}