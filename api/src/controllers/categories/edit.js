import { AppError } from "../../../../shared/errors/app.error.js";
import { ValidationError } from "../../../../shared/errors/validation.error.js";
import { categorySchema } from "../../../../shared/validators/src/categories.js";
import { db } from "../../lib/db.js";
import { handler } from "../../utils/handler.js";

const schema = categorySchema.edit.transform((x) => ({
  ...x,
  description: x.description || null,
}));

export const edit = handler(async (req, res) => {
  const parsed = schema.safeParse(req.body);

  if (!parsed.success) {
    throw new ValidationError(parsed.error.flatten().fieldErrors);
  }

  const { data } = parsed; // { id, name, description }

  const [result] = await db.execute(
    `UPDATE Categories 
     SET name = ?, description = ?
     WHERE id = ?`,
    [data.name, data.description, data.id],
  );

  // @ts-ignore
  if (result.affectedRows === 0) {
    throw new AppError(
      "ไม่พบหมวดหมู่ที่ต้องการแก้ไข",
      "CATEGORY_NOTFOUND",
      404,
    );
  }

  return res.json({
    message: "แก้ไขหมวดหมู่สำเร็จ",
    code: "SUCCESS",
  });
});
