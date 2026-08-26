import "dotenv/config";
import cors from "cors";
import express from "express";
import { databaseStatus } from "./database/dbConnection.js";
import cropRouter from "./routes/cropRouter.js";
import messageRouter from "./routes/messageRouter.js";
import schemeRouter from "./routes/schemeRouter.js";

const app = express();
app.disable("x-powered-by");
app.set("trust proxy", 1);

const allowedOrigins = (process.env.ALLOWED_ORIGINS || "https://agriproplus.vercel.app,http://localhost:5173")
  .split(",")
  .map((origin) => origin.trim());

app.use(
  cors({
    origin(origin, callback) {
      if (!origin || allowedOrigins.includes(origin) || process.env.NODE_ENV !== "production") return callback(null, true);
      return callback(new Error("Origin is not allowed by CORS."));
    },
  })
);
app.use(express.json({ limit: "32kb" }));
app.use(express.urlencoded({ extended: false, limit: "32kb" }));

app.get("/", (_req, res) => {
  res.json({ service: "AgriPro+ Platform API", status: "ready", version: "2.0.0" });
});
app.get("/api/health", (_req, res) => {
  res.json({ status: "healthy", database: databaseStatus(), uptime: Math.round(process.uptime()) });
});

app.use("/api/crops", cropRouter);
app.use("/api/schemes", schemeRouter);
app.use("/api/message", messageRouter);

app.use((req, res) => res.status(404).json({ message: `No route for ${req.method} ${req.path}.` }));
app.use((error, _req, res, _next) => {
  console.error(error);
  const validation = error.name === "ValidationError";
  res.status(validation ? 422 : 500).json({
    success: false,
    message: validation ? Object.values(error.errors).map((item) => item.message).join(" ") : "The service could not complete this request.",
  });
});

export default app;
