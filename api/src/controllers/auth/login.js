import { signedCookie } from "cookie-parser";
import { AppError } from "../../../../shared/errors/app.error.js";
import { ValidationError } from "../../../../shared/errors/validation.error.js";
import { loginSchema } from "../../../../shared/validators/src/user.js";
import { db } from "../../lib/db.js";
import { $Enums } from "../../lib/generated/prisma/index.js";
import { signJwtToken, tokenExpiredSecond } from "../../lib/jwt.js";
import { verifyPassword } from "../../lib/password.js";
import { handler } from "../../utils/handler.js";

/**
 * @typedef {object} UserRow
 * @property {string} id
 * @property {string} hashedPassword
 * @property {$Enums['Role']} role
 * @property {string} firstname
 * @property {string} lastname
 */
// ------------------

export const login = handler(async (req, res) => {
  const parsed = loginSchema.safeParse(req.body);
  if (!parsed.success) {
    throw new ValidationError(parsed.error.flatten().fieldErrors);
  }
  const { email, password } = parsed.data;

  const [result] = /** @type {[UserRow[], any]} */ (
    await db.query(
      `SELECT id, role, hashedPassword, firstname, lastname FROM Users WHERE email = ? AND isVerified = 1 AND deletedAt is NULL`,
      [email],
    )
  );
  if (result.length === 0) {
    throw new AppError("ไม่พบบัญชีผู้ใช้", "USER_NOTFOUND", 404);
  }

  const { id: userId, hashedPassword, role, firstname, lastname } = result[0];

  const isValidPassword = await verifyPassword(password, hashedPassword);
  if (!isValidPassword) {
    throw new AppError("รหัสผ่านไม่ถูกต้อง", "INVALID_PASSWORD", 401);
  }

  const token = signJwtToken({
    userId,
    role,
    fullname: firstname.concat(" ", lastname),
  });
  const extraRoutes = []
  // @ts-ignore
  if (role === "ADMIN" || role === "STAFF") {
    if (role === "ADMIN") {
      extraRoutes.push(
        { id: "hq-user", label: "จัดการบัญชีผู้ใช้", href: "/hq/users", requireLogin: true },
      )
    }
    extraRoutes.push({ id: "hq-asset", label: "จัดการทรัพย์สิน", href: "/hq/assets", requireLogin: true },
      { id: "hq-category", label: "จัดการหมวดหมู่", href: "/hq/categories", requireLogin: true },
      { id: "hq-borrow", label: "จัดการการยืม", href: "/hq/borrows", requireLogin: true }
    )
  }

  return res
    .status(200)
    .cookie("accessToken", token, {
      httpOnly: false,
      secure: false,
      sameSite: "lax",
      maxAge: 1000 * tokenExpiredSecond, // ms
    })
    .json({
      message: "เข้าสู่ระบบสำเร็จ",
      code: "SUCCESS",
      path: extraRoutes
    });
});
