import express from "express";
import { deleteMessage } from "../controllers/message.controller.js";

const router = express.Router();

router.get("/message", deleteMessage);

export default router;
