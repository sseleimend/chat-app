import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";

import authRoutes from "./routes/auth.route.ts";
import messageRoutes from "./routes/message.route.ts";
import { connectDb } from "./lib/db.ts";

dotenv.config();

const PORT = process.env.PORT || 3000;

const app = express();

app.use(express.json());
app.use(cookieParser());

app.use("/api/auth", authRoutes);
app.use("/api/message", messageRoutes);

app.listen(3000, () => {
  console.log(`Server is running on port ${PORT}`);
  connectDb();
});
