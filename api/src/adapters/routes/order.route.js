import express from "express";
import { verifyToken } from "../../interfaces/gateways/jwt.js";
import { createOrder, getOrder } from "../controllers/order.controller.js";

const router = express.Router();

router.post("/:gigId", verifyToken, createOrder);
router.get("/", verifyToken, getOrder);

export default router;