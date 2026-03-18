import { Router } from "express";
import { categoryControllers } from "../controllers/categories/index.js";

const router = Router();

router.get("/", categoryControllers.getAll);
router.post("/add", categoryControllers.add);
router.patch("/edit", categoryControllers.edit);

export default router;
