import jwt from "jsonwebtoken";
import { verifyJwtToken } from "../../lib/jwt.js";
import { handler } from "../../utils/handler.js";
import { db } from "../../lib/db.js";
import { jwtHandlerError } from "../../utils/jwt-error.js";
import { AppError } from "../../../../shared/errors/app.error.js";

export const verify = handler(async (req, res) => {
  const { token } = req.query;
  if (!token) {
    return res.redirect("/"); // ให้เปลี่ยนเส้นทางไปยังหน้าที่บอกว่า "ลิ้งค์หมดอายุ โปรดลองใหม่อีกครั้ง"
  }

  try {
    const payload = verifyJwtToken(token.toString());

    const conn = await db.getConnection();

    try {
      await conn.beginTransaction();

      const [r1] = await conn.execute(
        "UPDATE UserVerify SET isVerified = 1, verifiedAt = NOW() WHERE id = ? AND userId = ? AND isVerified = 0",
        [payload.verifyId, payload.userId],
      );

      const [r2] = await conn.execute(
        "UPDATE Users SET isVerified = 1 WHERE id = ? AND isVerified = 0",
        [payload.userId],
      );

      // @ts-ignore
      if (r1.affectedRows === 0 || r2.affectedRows === 0) {
        await conn.rollback();
        throw new AppError(
          "ลิงก์ไม่ถูกต้องหรือถูกใช้งานไปแล้ว",
          "UNABLE_TO_VERIFY",
          400,
        );
      }

      await conn.commit();
      return res.send("OK");
    } catch (err) {
      await conn.rollback();
      throw err;
    } finally {
      conn.release();
    }
  } catch (error) {
    const e = jwtHandlerError(error);
    throw error;
  }
});
