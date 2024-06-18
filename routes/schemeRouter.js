// routes/schemeRouter.js
import express from 'express';
import { getAllSchemes, getSchemeById, createScheme } from '../controllers/schemeController.js';

const router = express.Router();

// Get all schemes
router.get('/', getAllSchemes);

// // Get a specific scheme
// router.get('/:id', getSchemeById);

// Create a new scheme
router.post('/', createScheme);

export default router;
