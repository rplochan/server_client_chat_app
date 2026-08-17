import express from "express";
import { sendMessage, getChatHistory } from "../controllers/messageController.js";
import { authenticationToken } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/send", authenticationToken, sendMessage);
router.get("/:userId", authenticationToken, getChatHistory);

export default router;