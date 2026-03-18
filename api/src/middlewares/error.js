import jwt from "jsonwebtoken";
import { AppError } from "../../../shared/errors/app.error.js";
import { DatabaseError } from "../../../shared/errors/db.error.js";
import { ValidationError } from "../../../shared/errors/validation.error.js";
import { jwtHandlerError } from "../utils/jwt-error.js";
/**
 * @type {import("express").ErrorRequestHandler}
 */
export const errorMiddleware = (error, req, res, next) => {
  if (error instanceof ValidationError) {
    return res.status(400).json({
      message: error.message,
      code: error.code,
      fieldErrors: error.fieldErrors,
    });
  }
  if (error instanceof DatabaseError) {
    return res.status(error.statusCode).json({
      message: error.message,
      code: error.code,
    });
  }
  if (error instanceof AppError) {
    return res
      .status(error.statusCode)
      .json({ message: error.message, code: error.code });
  }
  if (error instanceof jwt.JsonWebTokenError) {
    const e = jwtHandlerError(error);
    return res.status(e.statusCode).json({ message: e.message, code: e.code });
  }
  console.error(error);
  return res.status(500).json({
    message: "เกิดข้อผิดพลาดไม่ทราบสาเหตุ",
  });
};
