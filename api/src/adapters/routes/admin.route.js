import express from "express";
import {
  userList,
  adminRegister,
  adminLogin,
  adminLogout,
  getOrders,
  userBlocked,
  workReceived,
} from "../controllers/admin.controller.js";
import { verifyAdminToken } from "../../interfaces/gateways/jwt.js";
const router = express.Router();

router.get("/", verifyAdminToken, userList);
router.post("/register", adminRegister);
router.post("/login", adminLogin);
router.post("/logout", adminLogout);
router.get("/orders", verifyAdminToken, getOrders);
router.put("/toggleUserBlocked/:id", verifyAdminToken, userBlocked);
router.put("/received/:id", verifyAdminToken, workReceived);

export default router;
