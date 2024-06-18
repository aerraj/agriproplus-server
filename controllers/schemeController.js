// controllers/schemeController.js
import Scheme from '../models/scheme.js';

// Get all schemes
export const getAllSchemes = async (req, res) => {
    try {
        const schemes = await Scheme.find();
        res.json(schemes);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// Get a specific scheme
export const getSchemeById = async (req, res) => {
    try {
        const scheme = await Scheme.findById(req.params.id);
        if (scheme == null) {
            return res.status(404).json({ message: 'Cannot find scheme' });
        }
        res.json(scheme);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// Create a new scheme
export const createScheme = async (req, res) => {
    const scheme = new Scheme({
        title: req.body.title,
        description: req.body.description,
        ministry: req.body.ministry,
        tags: req.body.tags
    });

    try {
        const newScheme = await scheme.save();
        res.status(201).json(newScheme);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};
