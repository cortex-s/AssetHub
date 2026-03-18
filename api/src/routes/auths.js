import { Router } from "express";
import { authControllers } from "../controllers/auth/index.js";

const authRoute = Router();

authRoute.post("/register", authControllers.register);
authRoute.get("/emailVerify", authControllers.verify);
authRoute.post("/login", authControllers.login);

export default authRoute;
