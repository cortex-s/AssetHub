import odiff from "odiff";
import { AppError } from "../../../../shared/errors/app.error.js";
import { ValidationError } from "../../../../shared/errors/validation.error.js";
import { borrowSchema } from "../../../../shared/validators/src/borrows.js";
import { borrowModel } from "../../models/borrows/index.js";
import { handler } from "../../utils/handler.js";
import { buildUpdateFromDiff } from "../../utils/diff.js";
import { set } from "zod";
import { db } from "../../lib/db.js";

export const edit = handler(async (req, res) => {
    const parsed = borrowSchema.edit.safeParse(req.body)
    if (!parsed.success) {
        throw new ValidationError(parsed.error.flatten().fieldErrors)
    }
    const { data } = parsed

    const borrowItem = await borrowModel.hasBorrow(data.id, ["id", "status", "internalNotes", "publicReturnedNotes", "returnDate"])
    if (!borrowItem) {
        throw new AppError("ไม่พบข้อมูลการยืม", "BORROW_DATA_NOTFOUND")
    }

    const diffList = odiff(borrowItem, data)
    const { setClause, values } = buildUpdateFromDiff(diffList)
    await db.execute("UPDATE Borrows SET status = ?", ["returned"])
    await borrowModel.update(setClause, values, data.id)
    return res.json({ message: "แก้ไขสำเร็จ", code: "SUCCESS" })
})