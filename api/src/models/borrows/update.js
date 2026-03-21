import { db } from "../../lib/db.js";

/**
 * @param {string} setClause - SQL SET เช่น "name = ?, serialNo = ?"
 * @param {any[]} values - ค่า value ที่จะ bind
 * @param {number|string} id - id ของ borrow
 */
export async function update(setClause, values, id) {
    if (!setClause || values.length === 0) return;

    // ถาม ChatGPT แล้วครับ มันว่าปลอดภัยจาก SQL Injection
    await db.query(`UPDATE Borrows SET ${setClause} WHERE id = ?`, [
        ...values,
        id,
    ]);
}
