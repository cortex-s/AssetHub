import { AppError } from "../../../../shared/errors/app.error.js";
import { ValidationError } from "../../../../shared/errors/validation.error.js";
import { assetSchema } from "../../../../shared/validators/src/assets.js";
import { assetModel } from "../../models/assets/index.js";
import { categoryModel } from "../../models/categories/index.js";
import { handler } from "../../utils/handler.js";
import { mySqlErrorHandler } from "../../utils/mysql-error.js";

const schema = assetSchema.add.transform((x) => ({
  ...x,
  notes: x.notes || null,
  categoryId: x.categoryId || null,
}));

export const add = handler(async (req, res) => {
  try {
    const parsed = schema.safeParse(req.body);
    if (!parsed.success) {
      throw new ValidationError(parsed.error.flatten().fieldErrors);
    }
    const { data } = parsed;

    if (data.categoryId) {
      // เช็คก่อนว่ามีหมวดหมู่ในตารางไหม ไม่งั้นพังตอน insert แน่นอน
      // แต่ถ้าเกิด race condition (มั้ง) ก็ไม่เป็นไรเพราะเราไม่ได้ลบข้อมูลจริงๆ แค่ soft delete และก็ค่อยไล่ cleanup ทีหลัง
      const hasCategory = await categoryModel.hasCategory(data.categoryId, [
        "name",
      ]);
      if (!hasCategory) {
        data.categoryId = null;
      }
    }

    await assetModel.insert(data);
    return res
      .status(201)
      .json({ message: "ลงข้อมูลทรัพย์สินสำเร็จ", code: "SUCCESS" });
  } catch (error) {
    const e = mySqlErrorHandler(error)
    if (e?.errno === 1062) {
      throw new AppError("รหัสย่อ หรือ S/N ซ้ำกับในระบบ")
    }
    throw error
  }
});
