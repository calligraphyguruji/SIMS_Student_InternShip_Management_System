import mongoose from "mongoose";

export const APPLICATION_STATUSES = [
  "pending",
  "shortlisted",
  "interview_scheduled",
  "approved",
  "rejected",
  "offer_received",
  "completed",
];

const applicationSchema = new mongoose.Schema(
  {
    student: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    internship: { type: mongoose.Schema.Types.ObjectId, ref: "Internship", required: true },
    status: { type: String, enum: APPLICATION_STATUSES, default: "pending" },
    coverLetter: { type: String, default: "" },
    resumeUrl: { type: String, default: "" },

    mentorApproval: {
      approved: { type: Boolean, default: null },
      comment: { type: String, default: "" },
      by: { type: mongoose.Schema.Types.ObjectId, ref: "User", default: null },
      at: { type: Date, default: null },
    },

    history: [
      {
        status: { type: String, enum: APPLICATION_STATUSES },
        note: { type: String, default: "" },
        by: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
        at: { type: Date, default: Date.now },
      },
    ],
  },
  { timestamps: true }
);

// A student cannot apply to the same internship twice
applicationSchema.index({ student: 1, internship: 1 }, { unique: true });

export default mongoose.model("Application", applicationSchema);
