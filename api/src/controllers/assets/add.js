import { ValidationError } from "../../../../shared/errors/validation.error.js";
import { assetSchema } from "../../../../shared/validators/src/assets.js";
import { db } from "../../lib/db.js";
import { handler } from "../../utils/handler.js";

// เป็น interface สำหรับการ query หา name จาก Categories
/**
 * @typedef {object} HasCategory
 * @property {string} name
 */
// ------------------

const schema = assetSchema.add.transform((x) => ({
  ...x,
  notes: x.notes || null,
  categoryId: x.categoryId || null,
}));

export const add = handler(async (req, res) => {
  const parsed = schema.safeParse(req.body);
  if (!parsed.success) {
    throw new ValidationError(parsed.error.flatten().fieldErrors);
  }
  const { data } = parsed;

  if (data.categoryId) {
    // เช็คก่อนว่ามีหมวดหมู่ในตารางไหม ไม่งั้นพังตอน insert แน่นอน
    // แต่ถ้าเกิด race condition (มั้ง) ก็ไม่เป็นไรเพราะเราไม่ได้ลบข้อมูลจริงๆ แค่ soft delete และก็ค่อยไล่ cleanup ทีหลัง
    const [hasCategory] = /** @type {[HasCategory[], any]} */ (
      await db.query(
        `SELECT name FROM Categories WHERE id = ? AND deletedAt is NULL`,
        [data.categoryId],
      )
    );
    if (hasCategory.length === 0) {
      data.categoryId = null;
    }
  }

  await db.execute(
    `INSERT INTO Assets (id, assetCode, serialNo, name, notes, categoryId) VALUES (UUID(), ?, ?, ?, ?, ?)`,
    [data.assetCode, data.serialNo, data.name, data.notes, data.categoryId],
  ); // ไม่ใส่ status เพราะก่อนจะให้ยืมก็ต้องมีของในระบบก่อน ดังนั้น status จะต้องเป็น available ก่อนเท่านั้น

  return res
    .status(201)
    .json({ message: "ลงข้อมูลทรัพย์สินสำเร็จ", code: "SUCCESS" });
});
