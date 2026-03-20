import "dotenv/config";
import express from "express";
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import cors from "cors";
// Middleware
import { errorMiddleware } from "./middlewares/error.js";
import { authMiddleware } from "./middlewares/auth.js";

const port = process.env.PORT;

const app = express();
app.use(
  cors({
    origin: "http://localhost:5000",
    credentials: true,
  }),
);
app.use(bodyParser.json());
app.use(cookieParser());
app.get("/api/gg", (req, res) => {
  return res.send("Hello, World");
});

// Routes
import authRoutes from "./routes/auths.js";
import meRoutes from "./routes/me.js";
import categoryRoutes from "./routes/categories.js";
import assetRoutes from "./routes/assets.js";
import borrowRoutes from "./routes/borrows.js";

// Manage Routes
app.use("/api/auth", authRoutes);
app.use(authMiddleware);
app.use("/api/@me", meRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/api/assets", assetRoutes);
app.use("/api/borrows", borrowRoutes);
app.use(errorMiddleware);

app.listen(port, () => console.log("Running at port:", port));
