import { ValidationError } from "../../../../shared/errors/validation.error.js";
import { borrowSchema } from "../../../../shared/validators/src/borrows.js";
import { handler } from "../../utils/handler.js";
import { AppError } from "../../../../shared/errors/app.error.js";
import { userModel } from "../../models/users/index.js";
import { assetModel } from "../../models/assets/index.js";
import { borrowModel } from "../../models/borrows/index.js";
import { getFullName } from "../../utils/string.js";

const schema = borrowSchema.borrow.transform((x) => ({
  ...x,
  returnDate: x.returnDate || null,
  internalNotes: x.internalNotes || null,
}));

export const borrow = handler(async (req, res) => {
  const parsed = schema.safeParse(req.body);
  if (!parsed.success) {
    throw new ValidationError(parsed.error.flatten().fieldErrors);
  }
  const { data } = parsed;

  const asset = await assetModel.hasAsset(data.assetId, [
    "assetCode",
    "status",
    "name",
    "notes",
    "serialNo",
    "id",
  ]);
  if (!asset) {
    throw new AppError("ไม่พบทรัพย์สินที่ต้องการยืม", "ASSET_NOT_FOUND");
  }
  if (asset.status !== "available") {
    throw new AppError(
      "ทรัพย์สินไม่พร้อมให้ยืมได้ในขณะนี้",
      "ASSET_NOT_AVAILABLE_FOR_BORROW",
    );
  }

  const borrower = await userModel.hasUser(data.userId);
  if (!borrower) {
    throw new AppError("ไม่พบบัญชีผู้ยืม", "BORROWER_NOTFOUND", 404);
  }

  await borrowModel.borrow(
    asset,
    { ...data, borrowerName: getFullName(borrower.firstname, borrower.lastname) },
    req.user.userId,
  );

  return res
    .status(201)
    .json({ message: "บันทึกข้อมูลการยืมสำเร็จ", code: "SUCCESS" });
});
