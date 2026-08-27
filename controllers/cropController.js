import { readFileSync } from "node:fs";

const MODEL = JSON.parse(readFileSync(new URL("../data/crop_model.json", import.meta.url), "utf8"));
const FEATURES = ["N", "P", "K", "temperature", "humidity", "pH", "rainfall"];
const RANGES = {
  N: [0, 200], P: [0, 200], K: [0, 250], temperature: [-10, 60],
  humidity: [0, 100], pH: [0, 14], rainfall: [0, 500],
};

function parseConditions(body) {
  const payload = body && typeof body === "object" ? { ...body } : {};
  if (payload.pH === undefined && payload.ph !== undefined) payload.pH = payload.ph;
  const fields = {};
  const values = FEATURES.map((feature) => {
    const value = Number(payload[feature]);
    const [minimum, maximum] = RANGES[feature];
    if (payload[feature] === "" || payload[feature] === null || !Number.isFinite(value)) {
      fields[feature] = "A finite number is required.";
    } else if (value < minimum || value > maximum) {
      fields[feature] = `Expected a value from ${minimum} to ${maximum}.`;
    }
    return value;
  });
  return { values, fields };
}

function treeVote(tree, values) {
  let nodeIndex = 0;
  while (tree[nodeIndex][0] !== -1) {
    const node = tree[nodeIndex];
    nodeIndex = values[node[0]] <= node[1] ? node[3] : node[4];
  }
  return tree[nodeIndex][1];
}

function rankedPredictions(values) {
  const votes = Array(MODEL.labels.length).fill(0);
  for (const tree of MODEL.trees) votes[treeVote(tree, values)] += 1;
  return votes
    .map((vote, index) => ({ crop: MODEL.labels[index], confidence: Number((vote / MODEL.trees.length).toFixed(4)) }))
    .sort((left, right) => right.confidence - left.confidence)
    .slice(0, 3);
}

export function getCropApiInfo(_req, res) {
  return res.json({
    service: "AgriPro+ Crop Intelligence API",
    status: "ready",
    model_version: MODEL.version,
    accuracy: MODEL.validation.accuracy,
    crops: MODEL.labels.length,
    trees: MODEL.trees.length,
    predict: {
      method: "POST",
      endpoint: "/api/crops/recommend",
      fields: Object.fromEntries(FEATURES.map((feature) => [feature, { minimum: RANGES[feature][0], maximum: RANGES[feature][1] }])),
    },
  });
}

export async function recommendCrop(req, res) {
  const started = performance.now();
  const { values, fields } = parseConditions(req.body);
  if (Object.keys(fields).length) {
    return res.status(422).json({ error: "Invalid field readings.", fields });
  }

  const recommendations = rankedPredictions(values);
  return res.json({
    recommended_crop: recommendations[0].crop,
    confidence: recommendations[0].confidence,
    alternatives: recommendations.slice(1),
    model_version: MODEL.version,
    latency_ms: Number((performance.now() - started).toFixed(2)),
    disclaimer: "Use this recommendation with local soil testing and agronomic advice.",
  });
}
