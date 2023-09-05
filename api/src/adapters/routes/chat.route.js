import express from "express";
import { verifyToken } from "../../interfaces/gateways/jwt.js";
import { accessChat, fetchChats, createGroupChat } from "../controllers/chat.controller.js";

const router = express.Router();

router.post("/", verifyToken, accessChat)
router.get("/",verifyToken, fetchChats);
router.post("/group", verifyToken, createGroupChat);
// router.put("/rename", renameGroup);
// router.put("/groupremove", removeFromGroup);
// router.put("/groupadd", addToGroup);

export default router;
