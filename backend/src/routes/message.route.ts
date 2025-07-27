import express from "express";

import { getUsersForSidebar } from "../controllers/message.controller.ts";
import { protectRoute } from "../middlewares/auth.middleware.ts";

const router = express.Router();

router.get("/users", protectRoute, getUsersForSidebar);

export default router;
