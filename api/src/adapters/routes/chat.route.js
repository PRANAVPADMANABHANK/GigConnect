import express from "express";
import { verifyToken } from "../../interfaces/gateways/jwt.js";
import { accessChat, fetchChats, createGroupChat, renameGroup, addToGroup, removeFromGroup } from "../controllers/chat.controller.js";

const router = express.Router();

router.post("/", verifyToken, accessChat)
router.get("/",verifyToken, fetchChats);
router.post("/group", verifyToken, createGroupChat);
router.put("/rename",verifyToken, renameGroup);
router.put("/groupadd",verifyToken, addToGroup); 
router.put("/groupremove",verifyToken, removeFromGroup);

export default router;
