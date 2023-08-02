import express from "express";
import {createMessage, getMessages} from "../controllers/message.controller.js"
import { verifyToken } from "../../interfaces/gateways/jwt.js";

const router = express.Router();

router.post("/", verifyToken, createMessage);
router.get("/:id", verifyToken, getMessages);

export default router;
