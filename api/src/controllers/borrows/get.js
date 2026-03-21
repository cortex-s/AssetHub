import { AppError } from "../../../../shared/errors/app.error.js";
import { borrowModel } from "../../models/borrows/index.js";
import { handler } from "../../utils/handler.js";

export const get = handler(async (req, res) => {
    const { id } = req.params
    if (typeof id !== "string" || !id.trim()) {
        throw new AppError("required id!", "VALIDATION_ERROR", 400)
    }
    const borrow = await borrowModel.hasBorrow(id, ["id", "approvedById", "assetCode", "assetName", "borrowDate",
        "borrowerName", "dueDate", "internalNotes", "returnDate", "serialNo", "status"])
    if (!borrow) {
        throw new AppError("ไม่พบข้อมูลการยืม", "BORROW_DATA_NOTFOUND")
    }
    return res.json({ message: "OK", code: "SUCCESS", data: borrow })
})