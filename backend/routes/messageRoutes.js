import express from "express";
import { sendMessage } from "../controllers/messageController.js";
import { authenticationToken } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/send", authenticationToken, sendMessage);

export default router;