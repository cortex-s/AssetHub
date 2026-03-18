import { ValidationError } from "../../../../shared/errors/validation.error.js";
import { categorySchema } from "../../../../shared/validators/src/assets/index.js";
import { db } from "../../lib/db.js";
import { handler } from "../../utils/handler.js";

export const add = handler(async (req, res) => {
  const parsed = categorySchema.add.safeParse(req.body);
  if (!parsed.success) {
    throw new ValidationError(parsed.error.flatten().fieldErrors);
  }
  const { data } = parsed;

  await db.execute(
    "INSERT INTO Categories (id, name, description) VALUES (UUID(), ?, ?)",
    [data.name, data.description],
  );

  return res
    .status(201)
    .json({ message: "เพิ่มหมวดหมู่สำเร็จ", code: "SUCCESS" });
});
