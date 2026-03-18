import { Router } from "express";
import { assetControllers } from "../controllers/assets/index.js";

const assetRoutes = Router();

assetRoutes.post("/add", assetControllers.add);
assetRoutes.patch("/edit", assetControllers.edit);
assetRoutes.delete("/del", assetControllers.del);

export default assetRoutes;
