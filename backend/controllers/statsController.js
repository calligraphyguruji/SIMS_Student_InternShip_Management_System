import Application from "../models/Application.js";
import Internship from "../models/Internship.js";
import User from "../models/User.js";

// @route GET /api/stats/dashboard
// Returns role-appropriate summary numbers for the logged-in user's dashboard
export const getDashboardStats = async (req, res, next) => {
  try {
    const { user } = req;

    if (user.role === "student") {
      const applications = await Application.find({ student: user._id }).populate("internship");
      const byStatus = {};
      for (const app of applications) {
        byStatus[app.status] = (byStatus[app.status] || 0) + 1;
      }
      return res.status(200).json({
        success: true,
        stats: {
          totalApplications: applications.length,
          byStatus,
          recentApplications: applications.slice(0, 5),
        },
      });
    }

    if (user.role === "faculty") {
      const mentees = await User.find({ "studentProfile.mentor": user._id });
      const menteeIds = mentees.map((m) => m._id);
      const applications = await Application.find({ student: { $in: menteeIds } });
      const pendingReview = applications.filter((a) => a.mentorApproval.approved === null).length;

      return res.status(200).json({
        success: true,
        stats: {
          totalMentees: mentees.length,
          totalApplications: applications.length,
          pendingReview,
        },
      });
    }

    if (user.role === "company") {
      const internships = await Internship.find({ postedBy: user._id });
      const internshipIds = internships.map((i) => i._id);
      const applications = await Application.find({ internship: { $in: internshipIds } });
      const byStatus = {};
      for (const app of applications) {
        byStatus[app.status] = (byStatus[app.status] || 0) + 1;
      }

      return res.status(200).json({
        success: true,
        stats: {
          totalInternshipsPosted: internships.length,
          openInternships: internships.filter((i) => i.status === "open").length,
          totalApplications: applications.length,
          byStatus,
        },
      });
    }

    if (user.role === "coordinator" || user.role === "admin") {
      const [totalStudents, totalFaculty, totalCompanies, totalInternships, totalApplications] = await Promise.all([
        User.countDocuments({ role: "student" }),
        User.countDocuments({ role: "faculty" }),
        User.countDocuments({ role: "company" }),
        Internship.countDocuments({}),
        Application.countDocuments({}),
      ]);

      const applications = await Application.find({});
      const byStatus = {};
      for (const app of applications) {
        byStatus[app.status] = (byStatus[app.status] || 0) + 1;
      }

      const unassignedStudents = await User.countDocuments({
        role: "student",
        "studentProfile.mentor": null,
      });

      return res.status(200).json({
        success: true,
        stats: {
          totalStudents,
          totalFaculty,
          totalCompanies,
          totalInternships,
          totalApplications,
          unassignedStudents,
          byStatus,
        },
      });
    }

    res.status(200).json({ success: true, stats: {} });
  } catch (err) {
    next(err);
  }
};
