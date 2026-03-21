import { Router } from "express";
import { borrowControllers } from "../controllers/borrows/index.js";

const borrowRoutes = Router();

borrowRoutes.get("/", borrowControllers.list)
borrowRoutes.get("/:id", borrowControllers.get);
borrowRoutes.post("/borrow", borrowControllers.borrow);
borrowRoutes.patch("/edit", borrowControllers.edit)

export default borrowRoutes;
