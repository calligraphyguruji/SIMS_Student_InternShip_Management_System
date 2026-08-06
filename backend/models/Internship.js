import mongoose from "mongoose";

const internshipSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    companyName: { type: String, required: true, trim: true },
    postedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    description: { type: String, required: true },
    location: { type: String, default: "" },
    mode: { type: String, enum: ["remote", "hybrid", "onsite"], default: "onsite" },
    stipend: { type: Number, default: 0 },
    duration: { type: String, default: "" }, // e.g. "8 weeks"
    skillsRequired: [{ type: String }],
    eligibility: { type: String, default: "" },
    openings: { type: Number, default: 1 },
    deadline: { type: Date, required: true },
    status: { type: String, enum: ["open", "closed"], default: "open" },
  },
  { timestamps: true }
);

internshipSchema.index({ title: "text", companyName: "text", skillsRequired: "text" });

export default mongoose.model("Internship", internshipSchema);
