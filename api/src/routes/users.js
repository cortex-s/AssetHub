import { Router } from "express";
import { userController } from "../controllers/users/index.js";

const userRoutes = Router()

userRoutes.get("/", userController.list)

export default userRoutes