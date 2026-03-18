import "express";
import { $Enums } from "../src/lib/generated/prisma/index.js";

declare module "express-serve-static-core" {
  interface Request {
    user?: {
      userId: string;
      role: $Enums.Role;
      fullname: string;
      iat: number;
      exp: number;
    };
  }
}
