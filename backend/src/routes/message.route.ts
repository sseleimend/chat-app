import express from "express";

import {
  getUsersForSidebar,
  getMessages,
  sendMessage,
} from "../controllers/message.controller";
import { protectRoute } from "../middlewares/auth.middleware";

const router = express.Router();

router.get("/users", protectRoute, getUsersForSidebar);
router.get("/:id", protectRoute, getMessages);
router.post("/send/:id", protectRoute, sendMessage);

export default router;
