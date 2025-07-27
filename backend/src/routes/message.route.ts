import express from "express";

import {
  getUsersForSidebar,
  getMessages,
} from "../controllers/message.controller.ts";
import { protectRoute } from "../middlewares/auth.middleware.ts";

const router = express.Router();

router.get("/users", protectRoute, getUsersForSidebar);
router.get("/:id", protectRoute, getMessages);

export default router;
