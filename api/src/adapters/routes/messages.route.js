import express from "express";
import { verifyToken } from "../../interfaces/gateways/jwt.js";
import { allMessages, sendMessage } from "../controllers/messages.controller.js";


const router = express.Router();

router.route("/:chatId").get(verifyToken, allMessages);
router.route("/").post(verifyToken, sendMessage);

export default router;