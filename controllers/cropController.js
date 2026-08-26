const MODEL_URL = process.env.CROP_MODEL_URL || "https://crop-predict-api.vercel.app";

export async function recommendCrop(req, res) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 12000);
  try {
    const response = await fetch(`${MODEL_URL.replace(/\/$/, "")}/predict`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(req.body),
      signal: controller.signal,
    });
    const payload = await response.json().catch(() => ({ error: "Model returned an invalid response." }));
    return res.status(response.status).json(payload);
  } catch (error) {
    const timedOut = error.name === "AbortError";
    return res.status(503).json({
      error: timedOut ? "Crop intelligence timed out. Please retry." : "Crop intelligence is temporarily unavailable.",
    });
  } finally {
    clearTimeout(timeout);
  }
}
