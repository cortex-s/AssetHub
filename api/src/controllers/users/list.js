// @ts-nocheck
import { db } from "../../lib/db.js";
import { handler } from "../../utils/handler.js";

const ALLOWED_SORT_FIELDS = ["firstname", "lastname", "createdAt"];
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
        u.id,
        u.email,
        u.firstname,
        u.lastname,
        u.role,
        u.isVerified,
        u.createdAt
      FROM Users u
      WHERE u.deletedAt IS NULL
      ORDER BY ${sortBy} ${sortOrder}
    `
            : `
      SELECT 
        u.id,
        u.email,
        u.firstname,
        u.lastname,
        u.role,
        u.isVerified,
        u.createdAt
      FROM Users u
      WHERE u.deletedAt IS NULL
      ORDER BY ${sortBy} ${sortOrder}
      LIMIT ${limit} OFFSET ${offset}
    `,
    );

    // bypass mode
    if (bypass) {
        return res.json({
            data: rows,
        });
    }

    // pagination mode
    const [[{ total }]] = await db.execute(
        `SELECT COUNT(*) as total FROM Users WHERE deletedAt IS NULL`,
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