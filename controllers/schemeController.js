import { dbConnection } from "../database/dbConnection.js";
import Scheme from "../models/scheme.js";

export async function getAllSchemes(req, res) {
  await dbConnection();
  if (!process.env.MONGO_URI) {
    return res.json({ items: [], total: 0, source: "unconfigured" });
  }

  const limit = Math.min(Math.max(Number(req.query.limit) || 24, 1), 100);
  const page = Math.max(Number(req.query.page) || 1, 1);
  const filter = {};
  if (req.query.search) filter.$text = { $search: String(req.query.search).slice(0, 120) };
  if (req.query.tag) filter.tags = String(req.query.tag);
  if (req.query.state) filter.states = { $in: ["All India", String(req.query.state)] };

  const [items, total] = await Promise.all([
    Scheme.find(filter).sort({ featured: -1, updatedAt: -1 }).skip((page - 1) * limit).limit(limit).lean(),
    Scheme.countDocuments(filter),
  ]);
  return res.json({ items, total, page, pages: Math.max(1, Math.ceil(total / limit)) });
}

export async function getSchemeById(req, res) {
  await dbConnection();
  if (!process.env.MONGO_URI) return res.status(503).json({ message: "Scheme storage is not configured." });
  const scheme = await Scheme.findById(req.params.id).lean();
  if (!scheme) return res.status(404).json({ message: "Scheme not found." });
  return res.json(scheme);
}

export async function createScheme(req, res) {
  await dbConnection();
  const scheme = await Scheme.create(req.body);
  return res.status(201).json(scheme);
}
