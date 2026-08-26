import mongoose from "mongoose";

let connectionPromise;

export function databaseStatus() {
  const states = ["disconnected", "connected", "connecting", "disconnecting"];
  return process.env.MONGO_URI ? states[mongoose.connection.readyState] ?? "unknown" : "not_configured";
}

export async function dbConnection() {
  if (!process.env.MONGO_URI) {
    return null;
  }
  if (mongoose.connection.readyState === 1) {
    return mongoose.connection;
  }
  if (!connectionPromise) {
    connectionPromise = mongoose
      .connect(process.env.MONGO_URI, {
        dbName: process.env.MONGO_DB_NAME || "agripro",
        serverSelectionTimeoutMS: 5000,
        maxPoolSize: 10,
      })
      .catch((error) => {
        connectionPromise = undefined;
        throw error;
      });
  }
  await connectionPromise;
  return mongoose.connection;
}
