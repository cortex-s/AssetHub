import { ValidationError } from "../../../../shared/errors/validation.error.js";
import { assetSchema } from "../../../../shared/validators/src/assets.js";
import { handler } from "../../utils/handler.js";
import odiff from "odiff";
import { mySqlErrorHandler } from "../../utils/mysql-error.js";
import { AppError } from "../../../../shared/errors/app.error.js";
import { assetModel } from "../../models/assets/index.js";
import { buildUpdateFromDiff } from "../../utils/diff.js";


export const edit = handler(async (req, res) => {
  try {
    const parsed = assetSchema.edit.safeParse(req.body);
    if (!parsed.success) {
      throw new ValidationError(parsed.error.flatten().fieldErrors);
    }
    const { data } = parsed;

    const asset = await assetModel.hasAsset(data.id, [
      "id",
      "name",
      "notes",
      "categoryId",
      "status"
    ]);
    if (!asset) {
      throw new AppError("ไม่พบทรัพย์สินดังกล่าว", "ASSET_NOTFOUND", 404);
    }
    const borrowingData = await assetModel.borrowing(data.id)

    if (borrowingData && data.status !== asset.status) {
      throw new AppError("มีผู้ยืมอยู่ ไม่สามารถแก้สถานะได้", "NOT_MODIFIES", 400)
    }

    const diffList = odiff(asset, { 'id': data.id, name: data.name, notes: data.notes, categoryId: data.categoryId, status: data.status });
    const { setClause, values } = buildUpdateFromDiff(diffList);

    if (values.length === 0) {
      throw new AppError("แก้ไขข้อมูลทรัพย์สินสำเร็จ", "NOT_MODIFIES", 200);
    }
    await assetModel.update(setClause, values, data.id);

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
