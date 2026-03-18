import { ValidationError } from "../../../../shared/errors/validation.error.js";
import { assetSchema } from "../../../../shared/validators/src/assets.js";
import { db } from "../../lib/db.js";
import { handler } from "../../utils/handler.js";
import odiff from "odiff";
import { mySqlErrorHandler } from "../../utils/mysql-error.js";
import { AppError } from "../../../../shared/errors/app.error.js";

// เป็น interface สำหรับการ query หา assetCode, serialNo, name, notes, categoryId, status จาก Assets
/**
 * @typedef {object} HasAsset
 * @property {string} assetCode
 * @property {string} serialNo
 * @property {string} name
 * @property {string} [notes]
 * @property {string} categoryId
 * @property {"available"|"borrowed"|"repair"|"retired"|"lost"} status
 */
// -------------------------

const schema = assetSchema.edit.transform((x) => ({
  ...x,
  notes: x.notes || null,
  categoryId: x.categoryId || null,
}));

export const edit = handler(async (req, res) => {
  try {
    const parsed = schema.safeParse(req.body);
    if (!parsed.success) {
      throw new ValidationError(parsed.error.flatten().fieldErrors);
    }
    const { data } = parsed;
    // ดึง asset เดิมจาก DB
    const [rows] = /**@type {[HasAsset[],any]} */ (
      await db.query(
        `SELECT id, assetCode, serialNo, name, notes, categoryId, status FROM Assets WHERE id = ?`,
        [data.id],
      )
    );
    if (rows.length === 0) {
      return res
        .status(404)
        .json({ message: "ไม่พบทรัพย์สิน", code: "NOT_FOUND" });
    }

    const diffList = odiff(rows[0], data);

    // แปลงเป็น object สำหรับ update
    /** @type {Record<string, any>} */
    const updateFields = {};

    diffList.forEach((diffItem) => {
      if (diffItem.type === "set") {
        const key = String(diffItem.path[0]);
        updateFields[key] = diffItem.val;
      }
    });

    // แปลง object เป็น SQL SET string
    const setClause = Object.keys(updateFields)
      .map((key) => `${key} = ?`)
      .join(", ");
    const values = Object.values(updateFields);

    if (values.length === 0) {
      throw new AppError("แก้ไขข้อมูลทรัพย์สินสำเร็จ", "NOT_MODIFIES", 200);
    }

    // ถาม ChatGPT แล้วครับ มันว่าปลอดภัยจาก SQL Injection
    await db.query(`UPDATE Assets SET ${setClause} WHERE id = ?`, [
      ...values,
      data.id,
    ]);

    return res
      .status(200)
      .json({ message: "แก้ไขข้อมูลทรัพย์สินสำเร็จ", code: "SUCCESS" });
  } catch (error) {
    const dbError = mySqlErrorHandler(error);
    if (dbError?.errno == 1452) {
      throw new AppError("ไม่พบหมวดหมู่ที่เลือก", "CATEGORY_NOTFOUND", 404);
    }
    throw error;
  }
});
