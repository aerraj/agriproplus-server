import express from "express";
import { recommendCrop } from "../controllers/cropController.js";
import asyncHandler from "../middleware/asyncHandler.js";

const router = express.Router();
router.post("/recommend", asyncHandler(recommendCrop));
export default router;
