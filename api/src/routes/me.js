import { Router } from "express";
import { meControllers } from "../controllers/me/index.js";

const router = Router();

router.get("/", meControllers.info);
// borrows - show anything that I borrowed
export default router;
