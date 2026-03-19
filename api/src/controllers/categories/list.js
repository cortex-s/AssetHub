/**
 * Get all Categories with pagination and sorting
 *
 * Query Parameters:
 *   - page (default 1)
 *   - limit (default 10)
 *   - sortBy (default 'createdAt') -> 'name' | 'createdAt'
 *   - sortOrder (default 'ASC') -> 'ASC' | 'DESC'
 *
 * Response:
 *   {
 *     data: [{ id, name, description, createdAt }],
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

  // Validate sort params
  const sortBy = ALLOWED_SORT_FIELDS.includes(
    String(req.query.sortBy || "createdAt"),
  );

  const sortOrder = ALLOWED_SORT_ORDERS.includes(
    String(req.query.sortOrder).toUpperCase(),
  )
    ? String(req.query.sortOrder).toUpperCase()
    : "ASC";

  // ดึงข้อมูล
  const [rows] = await db.execute(
    `SELECT id, name, description, createdAt
     FROM Categories
     ORDER BY ${sortBy} ${sortOrder}
     LIMIT ${limit} OFFSET ${offset}`,
  );

  // @ts-ignore
  const [[{ total }]] = await db.execute(
    `SELECT COUNT(*) as total FROM Categories`,
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
