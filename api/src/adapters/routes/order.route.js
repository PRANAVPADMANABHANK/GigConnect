import express from "express";
import { verifyToken } from "../../interfaces/gateways/jwt.js";
import {
  getOrder,
  intent,
  confirm,
  getOrderWithId,
} from "../controllers/order.controller.js";

const router = express.Router();

router.get("/", verifyToken, getOrder);
router.get("/:id", verifyToken, getOrderWithId);
router.post("/create-payment-intent/:id", verifyToken, intent);
router.put("/", verifyToken, confirm);

export default router;
