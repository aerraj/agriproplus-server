import { dbConnection } from "../database/dbConnection.js";
import { Message } from "../models/messageSchema.js";

export async function sendMessage(req, res) {
  const { name, email, subject, message, website } = req.body ?? {};

  // Honeypot field: bots often fill every input, people never see this one.
  if (website) {
    return res.status(202).json({ success: true, message: "Message received." });
  }
  if (![name, email, subject, message].every((value) => typeof value === "string" && value.trim())) {
    return res.status(422).json({ success: false, message: "Name, email, subject and message are required." });
  }

  await dbConnection();
  if (!process.env.MONGO_URI) {
    return res.status(503).json({ success: false, message: "Message storage is not configured." });
  }
  await Message.create({ name, email, subject, message });
  return res.status(201).json({ success: true, message: "Your message has been received." });
}
