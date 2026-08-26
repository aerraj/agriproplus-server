export default function adminGuard(req, res, next) {
  const configuredKey = process.env.ADMIN_API_KEY;
  const suppliedKey = req.get("x-admin-key");
  if (!configuredKey || suppliedKey !== configuredKey) {
    return res.status(401).json({ success: false, message: "Administrator access required." });
  }
  next();
}
