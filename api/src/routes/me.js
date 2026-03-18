import { Router } from "express";
import { meControllers } from "../controllers/me/index.js";

const router = Router();

router.get("/", meControllers.info);

export default router;
