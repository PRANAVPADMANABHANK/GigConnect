import express from "express";
import {deleteOrder} from "../controllers/order.controller.js"

const router = express.Router();

router.get("/order", deleteOrder)

export default router;