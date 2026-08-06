import User from "../models/User.js";
import fs from "fs/promises";
import path from "path";

// @route PUT /api/users/me
// Updates the logged-in user's own profile (role-appropriate fields only)
export const updateMyProfile = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);
    const { name, phone, avatarUrl, studentProfile, facultyProfile, companyProfile } = req.body;

    if (name) user.name = name;
    if (phone !== undefined) user.phone = phone;
    if (avatarUrl !== undefined) user.avatarUrl = avatarUrl;

    if (user.role === "student" && studentProfile) {
      user.studentProfile = { ...user.studentProfile.toObject(), ...studentProfile };
    }
    if (user.role === "faculty" && facultyProfile) {
      user.facultyProfile = { ...user.facultyProfile.toObject(), ...facultyProfile };
    }
    if (user.role === "company" && companyProfile) {
      user.companyProfile = { ...user.companyProfile.toObject(), ...companyProfile };
    }

    await user.save();
    res.status(200).json({ success: true, user: user.toSafeObject() });
  } catch (err) {
    next(err);
  }
};

// @route POST /api/users/me/resume
// Stores a student's resume and saves the public URL on their profile.
export const uploadMyResume = async (req, res, next) => {
  try {
    if (req.user.role !== "student") {
      return res.status(403).json({ success: false, message: "Only students can upload resumes" });
    }

    const { fileName, mimeType, data } = req.body;
    if (!fileName || !mimeType || !data) {
      return res.status(400).json({ success: false, message: "fileName, mimeType and data are required" });
    }

    const allowedTypes = {
      "application/pdf": ".pdf",
      "application/msword": ".doc",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document": ".docx",
    };
    const extension = allowedTypes[mimeType];
    if (!extension) {
      return res.status(400).json({ success: false, message: "Upload a PDF, DOC, or DOCX resume" });
    }

    const buffer = Buffer.from(data, "base64");
    const maxBytes = 5 * 1024 * 1024;
    if (!buffer.length || buffer.length > maxBytes) {
      return res.status(400).json({ success: false, message: "Resume must be smaller than 5 MB" });
    }

    const uploadDir = path.resolve("uploads", "resumes");
    await fs.mkdir(uploadDir, { recursive: true });

    const safeBase = path
      .basename(fileName, path.extname(fileName))
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "")
      .slice(0, 40) || "resume";
    const storedName = `${req.user._id}-${Date.now()}-${safeBase}${extension}`;
    const storedPath = path.join(uploadDir, storedName);
    await fs.writeFile(storedPath, buffer);

    const resumeUrl = `${req.protocol}://${req.get("host")}/uploads/resumes/${storedName}`;
    const user = await User.findById(req.user._id);
    user.studentProfile = { ...user.studentProfile.toObject(), resumeUrl };
    await user.save();

    res.status(200).json({ success: true, resumeUrl, user: user.toSafeObject() });
  } catch (err) {
    next(err);
  }
};

// @route GET /api/users?role=student&search=&page=&limit=
// Admin/Coordinator: list users, optionally filtered by role
export const listUsers = async (req, res, next) => {
  try {
    const { role, search, page = 1, limit = 20 } = req.query;
    const query = {};
    if (role) query.role = role;
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: "i" } },
        { email: { $regex: search, $options: "i" } },
      ];
    }

    const skip = (Number(page) - 1) * Number(limit);
    const [users, total] = await Promise.all([
      User.find(query).skip(skip).limit(Number(limit)).sort({ createdAt: -1 }),
      User.countDocuments(query),
    ]);

    res.status(200).json({
      success: true,
      users: users.map((u) => u.toSafeObject()),
      total,
      page: Number(page),
      pages: Math.ceil(total / Number(limit)),
    });
  } catch (err) {
    next(err);
  }
};

// @route GET /api/users/:id
export const getUserById = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ success: false, message: "User not found" });
    res.status(200).json({ success: true, user: user.toSafeObject() });
  } catch (err) {
    next(err);
  }
};

// @route PUT /api/users/:id/status
// Admin: activate/suspend a user
export const setUserStatus = async (req, res, next) => {
  try {
    const { isActive } = req.body;
    const user = await User.findByIdAndUpdate(req.params.id, { isActive }, { new: true });
    if (!user) return res.status(404).json({ success: false, message: "User not found" });
    res.status(200).json({ success: true, user: user.toSafeObject() });
  } catch (err) {
    next(err);
  }
};

// @route PUT /api/users/:id/mentor
// Coordinator/Admin: assign a faculty mentor to a student
export const assignMentor = async (req, res, next) => {
  try {
    const { mentorId } = req.body;
    const student = await User.findById(req.params.id);
    if (!student || student.role !== "student") {
      return res.status(404).json({ success: false, message: "Student not found" });
    }

    if (mentorId) {
      const mentor = await User.findById(mentorId);
      if (!mentor || mentor.role !== "faculty") {
        return res.status(400).json({ success: false, message: "Selected mentor is not a valid faculty account" });
      }
    }

    student.studentProfile.mentor = mentorId || null;
    await student.save();

    res.status(200).json({ success: true, user: student.toSafeObject() });
  } catch (err) {
    next(err);
  }
};

// @route DELETE /api/users/:id
// Admin: delete a user account
export const deleteUser = async (req, res, next) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) return res.status(404).json({ success: false, message: "User not found" });
    res.status(200).json({ success: true, message: "User deleted" });
  } catch (err) {
    next(err);
  }
};
