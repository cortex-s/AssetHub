import { AppError } from "../../../../shared/errors/app.error.js";
import { db } from "../../lib/db.js";
import { handler } from "../../utils/handler.js";

// เป็น interface ของ result ที่ได้จากการ query firstname, lastname, email
/**
 * @typedef {object} UserRow
 * @property {string} firstname
 * @property {string} lastname
 * @property {string} email
 */
// -----------

export const info = handler(async (req, res) => {
  const [result] = /** @type {[UserRow[], any]} */ (
    await db.query(
      `SELECT firstname, lastname, email FROM Users WHERE id = ?`,
      [req.user.userId],
    )
  );
  if (result.length === 0) {
    throw new AppError("เกิดข้อผิดพลาดระหว่างดึงข้อมูลผู้ใช้");
  }
  res.json({ message: "OK", code: "SUCCESS", data: result[0] });
});
