import Application, { APPLICATION_STATUSES } from "../models/Application.js";
import Internship from "../models/Internship.js";
import User from "../models/User.js";

// @route POST /api/applications
// Student: apply to an internship
export const applyToInternship = async (req, res, next) => {
  try {
    const { internshipId, coverLetter, resumeUrl } = req.body;

    if (!internshipId) {
      return res.status(400).json({ success: false, message: "internshipId is required" });
    }

    const internship = await Internship.findById(internshipId);
    if (!internship) return res.status(404).json({ success: false, message: "Internship not found" });
    if (internship.status !== "open") {
      return res.status(400).json({ success: false, message: "This internship is no longer accepting applications" });
    }

    const existing = await Application.findOne({ student: req.user._id, internship: internshipId });
    if (existing) {
      return res.status(409).json({ success: false, message: "You have already applied to this internship" });
    }

    const application = await Application.create({
      student: req.user._id,
      internship: internshipId,
      coverLetter: coverLetter || "",
      resumeUrl: resumeUrl || req.user.studentProfile?.resumeUrl || "",
      history: [{ status: "pending", note: "Application submitted", by: req.user._id }],
    });

    res.status(201).json({ success: true, application });
  } catch (err) {
    next(err);
  }
};

// @route GET /api/applications/my
// Student: view own applications
export const getMyApplications = async (req, res, next) => {
  try {
    const applications = await Application.find({ student: req.user._id })
      .populate("internship")
      .sort({ createdAt: -1 });
    res.status(200).json({ success: true, applications });
  } catch (err) {
    next(err);
  }
};

// @route GET /api/applications?internshipId=&status=&studentId=
// Company HR / Coordinator / Admin: view applications, optionally filtered
export const getApplications = async (req, res, next) => {
  try {
    const { internshipId, status, studentId, page = 1, limit = 20 } = req.query;
    const query = {};
    if (internshipId) query.internship = internshipId;
    if (status) query.status = status;
    if (studentId) query.student = studentId;

    // Company HR can only see applications for internships they posted
    if (req.user.role === "company") {
      const myInternships = await Internship.find({ postedBy: req.user._id }).select("_id");
      const myIds = myInternships.map((i) => i._id);
      query.internship = query.internship ? query.internship : { $in: myIds };
    }

    const skip = (Number(page) - 1) * Number(limit);
    const [applications, total] = await Promise.all([
      Application.find(query)
        .populate("student", "name email studentProfile phone")
        .populate("internship", "title companyName")
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(Number(limit)),
      Application.countDocuments(query),
    ]);

    res.status(200).json({
      success: true,
      applications,
      total,
      page: Number(page),
      pages: Math.ceil(total / Number(limit)),
    });
  } catch (err) {
    next(err);
  }
};

// @route GET /api/applications/mentee
// Faculty: view applications belonging to their assigned mentees
export const getMenteeApplications = async (req, res, next) => {
  try {
    const mentees = await User.find({ "studentProfile.mentor": req.user._id }).select("_id");
    const menteeIds = mentees.map((m) => m._id);

    const applications = await Application.find({ student: { $in: menteeIds } })
      .populate("student", "name email studentProfile")
      .populate("internship", "title companyName")
      .sort({ createdAt: -1 });

    res.status(200).json({ success: true, applications });
  } catch (err) {
    next(err);
  }
};

// @route PUT /api/applications/:id/status
// Company HR / Coordinator / Admin: move application through the workflow
export const updateApplicationStatus = async (req, res, next) => {
  try {
    const { status, note } = req.body;
    if (!APPLICATION_STATUSES.includes(status)) {
      return res.status(400).json({ success: false, message: "Invalid status value" });
    }

    const application = await Application.findById(req.params.id).populate("internship");
    if (!application) return res.status(404).json({ success: false, message: "Application not found" });

    if (req.user.role === "company") {
      const owns = application.internship.postedBy.toString() === req.user._id.toString();
      if (!owns) {
        return res.status(403).json({ success: false, message: "You do not manage this internship" });
      }
    }

    application.status = status;
    application.history.push({ status, note: note || "", by: req.user._id });
    await application.save();

    res.status(200).json({ success: true, application });
  } catch (err) {
    next(err);
  }
};

// @route PUT /api/applications/:id/mentor-approval
// Faculty: approve/reject on behalf of their mentee
export const setMentorApproval = async (req, res, next) => {
  try {
    const { approved, comment } = req.body;
    const application = await Application.findById(req.params.id).populate("student");
    if (!application) return res.status(404).json({ success: false, message: "Application not found" });

    const mentorId = application.student.studentProfile?.mentor;
    if (!mentorId || mentorId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: "You are not the mentor for this student" });
    }

    application.mentorApproval = {
      approved: !!approved,
      comment: comment || "",
      by: req.user._id,
      at: new Date(),
    };
    application.history.push({
      status: application.status,
      note: `Mentor ${approved ? "approved" : "flagged"} this application: ${comment || ""}`,
      by: req.user._id,
    });
    await application.save();

    res.status(200).json({ success: true, application });
  } catch (err) {
    next(err);
  }
};
