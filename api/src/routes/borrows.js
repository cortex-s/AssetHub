import { Router } from "express";
import { borrowControllers } from "../controllers/borrows/index.js";

const borrowRoutes = Router();

borrowRoutes.post("/borrow", borrowControllers.borrow);

export default borrowRoutes;
