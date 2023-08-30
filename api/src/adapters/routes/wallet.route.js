import express from "express";
import { verifyToken } from "../../interfaces/gateways/jwt.js";
import { getWalletAmount } from "../controllers/wallet.controller.js";


const router = express.Router();

router.get("/wallet/:id", verifyToken, getWalletAmount)

export default router;