// @ts-nocheck
import { db } from "../../lib/db.js";
import { getBorrowStatusText } from "../../utils/converter.js";
import { handler } from "../../utils/handler.js";

const ALLOWED_SORT_FIELDS = ["borrowDate", "dueDate", "createdAt", "status"];
const ALLOWED_SORT_ORDERS = ["ASC", "DESC"];

export const list = handler(async (req, res) => {
    const pageRaw = parseInt(String(req.query.page), 10);
    const limitRaw = parseInt(String(req.query.limit), 10);

    const page = Number.isInteger(pageRaw) && pageRaw > 0 ? pageRaw : 1;
    const limit = Number.isInteger(limitRaw) && limitRaw > 0 ? limitRaw : 10;

    const offset = (page - 1) * limit;

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

    const [rows] = await db.execute(
        `
  SELECT 
      b.id,
      b.assetCode,
      b.assetName,
      b.serialNo,
      b.borrowerName,
      b.status,
      b.borrowDate,
      b.dueDate,
      b.returnDate,
      b.createdAt

  FROM Borrows b
  LEFT JOIN Users u ON u.id = b.userId
  LEFT JOIN Assets a ON a.id = b.assetId

  ORDER BY ${sortBy} ${sortOrder}
  LIMIT ${limit} OFFSET ${offset}
  `,
    );
    const [[{ total }]] = await db.execute(
        `SELECT COUNT(*) as total FROM Borrows`
    );

    res.json({
        data: rows.map((x)=>({...x,status:getBorrowStatusText(x.status)})),
        pagination: {
            page,
            limit,
            total,
            totalPages: Math.ceil(total / limit),
        },
    });
});