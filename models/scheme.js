import mongoose from "mongoose";

const schemeSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true, maxLength: 180 },
    description: { type: String, required: true, trim: true, maxLength: 4000 },
    ministry: { type: String, required: true, trim: true, maxLength: 180 },
    tags: { type: [String], default: [], index: true },
    states: { type: [String], default: ["All India"], index: true },
    applicationUrl: { type: String, default: "https://www.myscheme.gov.in/search/category/Agriculture,Rural%20&%20Environment" },
    featured: { type: Boolean, default: false, index: true },
  },
  { timestamps: true }
);

schemeSchema.index({ title: "text", description: "text", ministry: "text" });

const Scheme = mongoose.models.Scheme || mongoose.model("Scheme", schemeSchema);
export default Scheme;
