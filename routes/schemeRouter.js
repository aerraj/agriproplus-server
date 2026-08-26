import express from "express";
import { createScheme, getAllSchemes, getSchemeById } from "../controllers/schemeController.js";
import adminGuard from "../middleware/adminGuard.js";
import asyncHandler from "../middleware/asyncHandler.js";

const router = express.Router();
router.get("/", asyncHandler(getAllSchemes));
router.get("/:id", asyncHandler(getSchemeById));
router.post("/", adminGuard, asyncHandler(createScheme));
export default router;
