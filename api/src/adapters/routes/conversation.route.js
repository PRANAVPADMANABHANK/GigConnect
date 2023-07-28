import express from "express";
import {deleteConversation} from "../controllers/conversation.controller.js"

const router = express.Router();

router.get("/conversation", deleteConversation)

export default router;