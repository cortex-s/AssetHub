// @ts-nocheck
import { db } from "../../lib/db.js";
import { getAssetStatusText } from "../../utils/converter.js";
import { handler } from "../../utils/handler.js";

const ALLOWED_SORT_FIELDS = ["name", "createdAt"];
const ALLOWED_SORT_ORDERS = ["ASC", "DESC"];

export const list = handler(async (req, res) => {
  const bypass = String(req.query.bypass || "").toLowerCase() === "yes";

  let page = 1;
  let limit = 10;
  let offset = 0;

  if (!bypass) {
    const pageRaw = parseInt(String(req.query.page), 10);
    const limitRaw = parseInt(String(req.query.limit), 10);

    page = Number.isInteger(pageRaw) && pageRaw > 0 ? pageRaw : 1;
    limit = Number.isInteger(limitRaw) && limitRaw > 0 ? limitRaw : 10;

    offset = (page - 1) * limit;
  }

  // sort
  const sortBy = ALLOWED_SORT_FIELDS.includes(
    String(req.query.sortBy || "createdAt"),
  )
    ? String(req.query.sortBy || "createdAt")
    : "createdAt";

  const sortOrder = ALLOWED_SORT_ORDERS.includes(
    String(req.query.sortOrder || "ASC").toUpperCase(),
  )
    ? String(req.query.sortOrder || "ASC").toUpperCase()
    : "ASC";

  // query data
  const [rows] = await db.execute(
    bypass
      ? `
      SELECT 
        a.id,
        a.assetCode,
        a.serialNo,
        a.name,
        a.categoryId,
        c.name AS categoryName,
        a.status,
        a.createdAt
      FROM Assets a
      LEFT JOIN Categories c ON c.id = a.categoryId
      WHERE a.deletedAt IS NULL
      ORDER BY ${sortBy} ${sortOrder}
    `
      : `
      SELECT 
        a.id,
        a.assetCode,
        a.serialNo,
        a.name,
        a.categoryId,
        c.name AS categoryName,
        a.status,
        a.createdAt
      FROM Assets a
      LEFT JOIN Categories c ON c.id = a.categoryId
      WHERE a.deletedAt IS NULL
      ORDER BY ${sortBy} ${sortOrder}
      LIMIT ${limit} OFFSET ${offset}
    `,
  );

  // bypass mode ไม่ต้องมี pagination
  if (bypass) {
    return res.json({
      data: rows.map((x) => ({
        ...x,
        status: getAssetStatusText(x.status),
      })),
    });
  }

  // normal mode → มี pagination
  const [[{ total }]] = await db.execute(
    `SELECT COUNT(*) as total FROM Assets WHERE deletedAt IS NULL`,
  );

  res.json({
    data: rows.map((x) => ({
      ...x,
      status: getAssetStatusText(x.status),
    })),
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
  });
});