import express from "express";
import {deleteUser} from "../controllers/user.controller.js"
import { verifyToken } from "../../interfaces/gateways/jwt.js";

const router = express.Router();

router.get("/:id",verifyToken, deleteUser)

export default router;