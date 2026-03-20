import { db } from "../../lib/db.js";
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

  // Validate sort params
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

  // ดึงข้อมูล
  const [rows] = await db.execute(
    bypass
      ? `SELECT id, name, description, createdAt FROM Categories ORDER BY ${sortBy} ${sortOrder}`
      : `SELECT id, name, description, createdAt
         FROM Categories
         ORDER BY ${sortBy} ${sortOrder}
         LIMIT ${limit} OFFSET ${offset}`,
  );

  if (bypass) {
    res.json({
      data: rows,
    });
  } else {
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
  }
});
