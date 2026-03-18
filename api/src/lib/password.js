import { argon2id, hash, verify } from "argon2";

// ต้องแปลงเป็น Hex ก่อน เนื่องจากตัว argon2 มันต้องการ Hex ไม่ใช้ String
const secret = Buffer.from(process.env.ARGON2_SECRET_KEY);

/**
 * @param {string} password
 * @return {Promise<string>}
 */
export async function hashPassword(password) {
  return await hash(password, { secret, type: argon2id });
}

/**
 * @param {string} password
 * @param {string} hashedPassword
 * @returns {Promise<boolean>}
 */
export async function verifyPassword(password, hashedPassword) {
  return await verify(hashedPassword, password, {
    secret,
  });
}
