import express from "express";
import { verifyToken } from "../../interfaces/gateways/jwt.js";
import {
  getOrder,
  intent,
  confirm,
  getOrderWithId,
  cancelWalletAmount,
  acceptOrder,
  submitWork
} from "../controllers/order.controller.js";

const router = express.Router();

router.get("/", verifyToken, getOrder);
router.get("/:id", verifyToken, getOrderWithId);
router.post("/create-payment-intent/:id", verifyToken, intent);
router.put("/", verifyToken, confirm);
router.get("/wallet/:id", verifyToken, cancelWalletAmount)
router.get("/accept/:id", verifyToken, acceptOrder)
router.get("/submission/:id", verifyToken, submitWork)

export default router;
