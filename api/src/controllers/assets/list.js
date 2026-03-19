/**
 * ดึงข้อมูลจากตารางทรัพย์สิน (Assets) และก็มี pagination ด้วยจะได้ประหยัดการโหลดข้อมูล
 *
 * Query Parameters:
 *   - page (default 1)
 *   - limit (default 10)
 *   - sortBy (default 'createdAt') -> 'name' | 'createdAt'
 *   - sortOrder (default 'ASC') -> 'ASC' | 'DESC'
 *
 * Response:
 *   {
 *     data: [{ id, assetCode, serialNo, name, categoryId, categoryName, status, createdAt }],
 *     pagination: { page, limit, total, totalPages }
 *   }
 */
import { db } from "../../lib/db.js";
import { handler } from "../../utils/handler.js";

const ALLOWED_SORT_FIELDS = ["name", "createdAt"];
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
    `SELECT 
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
     LIMIT ${limit} OFFSET ${offset}`,
  );

  // @ts-ignore
  const [[{ total }]] = await db.execute(
    `SELECT COUNT(*) as total FROM Assets WHERE deletedAt IS NULL`,
  );

  res.json({
    data: rows,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
  });
});
