import express from "express";
import dotenv from "dotenv";

import authRoutes from "./routes/auth.route.ts";
import { connectDb } from "./lib/db.ts";

dotenv.config();

const PORT = process.env.PORT || 3000;

const app = express();

app.use("/api/auth", authRoutes);

app.listen(3000, () => {
  console.log(`Server is running on port ${PORT}`);
  connectDb();
});
