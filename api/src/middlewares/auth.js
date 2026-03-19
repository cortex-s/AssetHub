import { verifyJwtToken } from "../lib/jwt.js";
import { AppError } from "../../../shared/errors/app.error.js";
import { handler } from "../utils/handler.js";

// path config for rbac
const rolesConfig = {
  "/api/@me": ["ANY"], // ทุก role เข้าได้
  "/api/users": ["ADMIN", "STAFF"],
  "/api/categories": ["ADMIN", "STAFF"],
  "/api/assets": ["ADMIN", "STAFF"],
};

export const authMiddleware = handler((req, res, next) => {
  const token = req.cookies?.accessToken;

  if (!token) {
    throw new AppError("โปรดเข้าสู่ระบบ", "UNAUTHORIZED", 401);
  }

  const payload = verifyJwtToken(token);

  const requestPath = req.originalUrl.split("?")[0]; // เอาเฉพาะ path ไม่เอา query

  // role-based check
  let matched = false;
  for (const [pathPrefix, allowedRoles] of Object.entries(rolesConfig)) {
    // match exact หรือ prefix
    if (
      requestPath === pathPrefix ||
      requestPath.startsWith(pathPrefix + "/")
    ) {
      matched = true;
      // "ANY" = ไม่ต้องเช็ค role
      if (
        !allowedRoles.includes("ANY") &&
        !allowedRoles.includes(payload.role?.toUpperCase())
      ) {
        throw new AppError("คุณไม่มีสิทธิ์เข้าถึง", "FORBIDDEN", 403);
      }
      break; // เจอ path แล้วหยุดเช็ค
    }
  }

  // ถ้า path ไม่ match ใน config → default บล็อกก็ได้ หรือ allow ตามต้องการ
  if (!matched) {
    throw new AppError("คุณไม่มีสิทธิ์เข้าถึง", "FORBIDDEN", 403);
  }

  // แนบ user ไปกับ request
  req["user"] = payload;

  next();
});
