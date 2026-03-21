import { AppError } from "../../../../shared/errors/app.error.js";
import { assetModel } from "../../models/assets/index.js";
import { handler } from "../../utils/handler.js";

export const get = handler(async (req, res) => {
    const { id } = req.params
    if (typeof id !== "string" || !id.trim()) {
        throw new AppError("required id!", "VALIDATION_ERROR", 400)
    }
    const asset = await assetModel.hasAsset(id.trim(), ["assetCode", "categoryId", "id", "name", "serialNo", "status", "notes"])
    if (!asset) { throw new AppError("ไม่พบทรัพย์สินที่คุณตามหา", "ASSET_NOTFOUND", 404) }
    return res.json({ message: "OK", code: "SUCCESS", data: { ...asset, status: (asset.status) } })
})