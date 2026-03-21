import { AppError } from "../../../../shared/errors/app.error.js";
import { ValidationError } from "../../../../shared/errors/validation.error.js";
import { assetSchema } from "../../../../shared/validators/src/assets.js";
import { assetModel } from "../../models/assets/index.js";
import { handler } from "../../utils/handler.js";

export const del = handler(async (req, res) => {
  const parsed = assetSchema.del.safeParse(req.query);
  if (!parsed.success) {
    throw new ValidationError(parsed.error.flatten().fieldErrors);
  }
  const { id } = parsed.data;

  const result = await assetModel.del(id);
  if (result.affectedRows === 0) {
    throw new AppError("ไม่พบรายการที่ต้องการลบ", "ASSET_NOTFOUND", 404);
  }

  return res
    .status(200)
    .json({ message: "ลบข้อมูลทรัพย์สินสำเร็จ", code: "SUCCESS" });
});
