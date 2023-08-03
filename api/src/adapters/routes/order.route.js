import express from "express";
import { verifyToken } from "../../interfaces/gateways/jwt.js";
import { getOrder, intent, confirm } from "../controllers/order.controller.js";

const router = express.Router();


router.get("/", verifyToken, getOrder);
router.post("/create-payment-intent/:id", verifyToken, intent)
router.put("/", verifyToken, confirm);

export default router;