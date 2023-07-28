import express from "express";
import { deleteReview } from "../controllers/review.controller.js";

const router = express.Router();

router.get("/review", deleteReview);

export default router;