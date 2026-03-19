import { AppError } from "../../../../shared/errors/app.error.js";
import { ValidationError } from "../../../../shared/errors/validation.error.js";
import { registerSchema } from "../../../../shared/validators/src/user.js";
import { db } from "../../lib/db.js";
import { signJwtToken, tokenExpiredSecond } from "../../lib/jwt.js";
import { sendMail } from "../../lib/mail.js";
import { hashPassword } from "../../lib/password.js";
import { handler } from "../../utils/handler.js";
import { mySqlErrorHandler } from "../../utils/mysql-error.js";
import { randomUUID } from "crypto";

export const register = handler(async (req, res) => {
  const parsed = registerSchema.safeParse(req.body);

  if (!parsed.success) {
    throw new ValidationError(parsed.error.flatten().fieldErrors);
  }

  const { data } = parsed;

  try {
    const password = await hashPassword(data.password);
    const userId = randomUUID();
    await db.execute(
      `INSERT INTO Users 
      (id, email, hashedPassword, firstname, lastname) 
      VALUES (?, ?, ?, ?, ?)`,
      [userId, data.email, password, data.firstname, data.lastname],
    );

    const verifyId = randomUUID();
    const token = signJwtToken({ userId, verifyId });
    const expiresAt = new Date(Date.now() + tokenExpiredSecond * 1000);

    await db.execute(
      `INSERT INTO UserVerify (id, userId, token, expiresAt) VALUES (?, ?, ?, ?)`,
      [verifyId, userId, token, expiresAt],
    );

    await sendMail(
      data.email,
      "[Verification] การยืนยันตัวตนระบบ KU Asset Hub",
      `<div style="font-family: Arial, sans-serif; padding: 20px; color: #333;">
  <h2>ยืนยันการสมัครใช้งาน</h2>

  <p>
    คุณได้สมัครใช้งานระบบจัดการทรัพย์สิน/ครุภัณฑ์เรียบร้อยแล้ว  
    กรุณายืนยันอีเมลเพื่อเริ่มใช้งานระบบ
  </p>

  <p style="margin: 20px 0;">
    <a href="localhost:8888/api/auth/emailVerify?token=${token}"
       style="padding: 10px 16px; background: #1e88e5; color: #fff; text-decoration: none; border-radius: 4px;">
      ยืนยันตัวตน
    </a>
  </p>

  <p style="font-size: 12px; color: #777;">
    หากไม่ได้เป็นผู้สมัคร สามารถละเว้นอีเมลนี้ได้
  </p>

  <p>*หากมีข้อสงสัย โปรดอย่าตอบกลับอีเมลนี้ เนื่องจากเป็นระบบอัตโนมัติ โปรดติดต่อที่อีเมล test@example.com</p>
</div>`,
    );

    return res.status(201).json({
      message: "ลงทะเบียนสำเร็จ",
      description: "โปรดตรวจสอบอีเมลเพื่อยืนยันตัวตนก่อนเข้าใช้งาน",
      code: "SUCCESS",
    });
  } catch (error) {
    const dbError = mySqlErrorHandler(error);
    if (dbError?.errno == 1062) {
      throw new AppError("Email นี้ถูกใช้ไปแล้ว", "EMAIL_EXISTS", 400);
    }
    throw error;
  }
});
