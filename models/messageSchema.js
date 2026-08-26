import mongoose from "mongoose";
import validator from "validator";

const messageSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true, minLength: 2, maxLength: 80 },
    email: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
      maxLength: 160,
      validate: [validator.isEmail, "Please provide a valid email."],
    },
    subject: { type: String, required: true, trim: true, minLength: 3, maxLength: 140 },
    message: { type: String, required: true, trim: true, minLength: 10, maxLength: 3000 },
    status: { type: String, enum: ["new", "in_progress", "resolved"], default: "new" },
  },
  { timestamps: true }
);

export const Message = mongoose.models.Message || mongoose.model("Message", messageSchema);
