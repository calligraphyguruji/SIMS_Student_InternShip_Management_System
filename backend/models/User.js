import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const ROLES = ["student", "faculty", "coordinator", "company", "admin"];

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    password: { type: String, required: true, minlength: 6, select: false },
    role: { type: String, enum: ROLES, required: true, default: "student" },
    phone: { type: String, default: "" },
    avatarUrl: { type: String, default: "" },
    isActive: { type: Boolean, default: true },

    // Student-specific profile
    studentProfile: {
      department: { type: String, default: "" },
      year: { type: String, default: "" },
      cgpa: { type: Number, min: 0, max: 10 },
      skills: [{ type: String }],
      resumeUrl: { type: String, default: "" },
      linkedin: { type: String, default: "" },
      github: { type: String, default: "" },
      portfolio: { type: String, default: "" },
      mentor: { type: mongoose.Schema.Types.ObjectId, ref: "User", default: null },
    },

    // Faculty-specific profile
    facultyProfile: {
      department: { type: String, default: "" },
      designation: { type: String, default: "" },
    },

    // Company HR-specific profile
    companyProfile: {
      companyName: { type: String, default: "" },
      industry: { type: String, default: "" },
      website: { type: String, default: "" },
      isVerified: { type: Boolean, default: false },
    },
  },
  { timestamps: true }
);

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

userSchema.methods.comparePassword = async function (candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

userSchema.methods.toSafeObject = function () {
  const obj = this.toObject();
  delete obj.password;
  return obj;
};

export const USER_ROLES = ROLES;
export default mongoose.model("User", userSchema);
