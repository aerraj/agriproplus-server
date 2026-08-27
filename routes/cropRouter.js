import express from "express";
import { getCropApiInfo, recommendCrop } from "../controllers/cropController.js";
import asyncHandler from "../middleware/asyncHandler.js";

const router = express.Router();
router.get("/", getCropApiInfo);
router.get("/recommend", getCropApiInfo);
router.post("/recommend", asyncHandler(recommendCrop));
export default router;
