import express from "express";
import { deleteUser, getUser, updateProfile, forgotPassword, resetPassword, allUsers } from "../controllers/user.controller.js";
import { verifyToken } from "../../interfaces/gateways/jwt.js";

const router = express.Router();

router.delete("/:id", verifyToken, deleteUser);
router.get("/:id",verifyToken, getUser);
router.put("/updateProfile", verifyToken, updateProfile)
router.post("/forgot-password",forgotPassword)
router.post("/reset-password/:id/:token",resetPassword)

// routes for socket.io
router.get("/",verifyToken, allUsers);


export default router;
