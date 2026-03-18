import "dotenv/config";
import express from "express";
import bodyParser from "body-parser";
import authRoutes from "./routes/auths.js";
import meRoutes from "./routes/me.js";
import categoryRoutes from "./routes/categories.js";
import { errorMiddleware } from "./middlewares/error.js";
import cookieParser from "cookie-parser";
import { authMiddleware } from "./middlewares/auth.js";

const port = process.env.PORT;

const app = express();
app.use(bodyParser.json());
app.use(cookieParser());
app.get("/", (req, res) => {
  return res.send("Hello, World");
});
app.use("/api/auth", authRoutes);
app.use(authMiddleware);
app.use("/api/@me", meRoutes);
app.use("/api/categories", categoryRoutes);
app.use(errorMiddleware);

app.listen(port, () => console.log("Running at port:", port));
