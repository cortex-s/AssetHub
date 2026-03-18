import jwt from "jsonwebtoken";

/**
 * @param {Error | unknown} error
 */
export function jwtHandlerError(error) {
  if (error instanceof jwt.TokenExpiredError) {
    return {
      message: "Token ยืนยันตัวตนหมดอายุ",
      code: "TOKEN_EXPIRED",
      statusCode: 401,
    };
  }

  if (error instanceof jwt.JsonWebTokenError) {
    return {
      message: "Token ไม่ถูกต้อง",
      code: "INVALID_TOKEN",
      statusCode: 401,
    };
  }

  return {
    message: "เกิดข้อผิดพลาดเกี่ยวกับ token",
    code: "TOKEN_ERROR",
    statusCode: 401,
  };
}
