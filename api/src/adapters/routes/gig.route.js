import express from "express";
import {deleteGig} from "../controllers/gig.controller.js"

const router = express.Router();

router.get("/gig", deleteGig)

export default router;
