import express from "express";
import { deleteReview, createReview, getReviews } from "../controllers/review.controller.js";
import { verifyToken } from "../../interfaces/gateways/jwt.js";

const router = express.Router();

router.post("/", verifyToken, createReview);
router.get("/:gigId", getReviews);
router.delete("/:id", deleteReview);

export default router;