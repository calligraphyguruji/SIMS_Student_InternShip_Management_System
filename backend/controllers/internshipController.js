import Internship from "../models/Internship.js";

// @route POST /api/internships
// Company HR or Admin: post a new internship
export const createInternship = async (req, res, next) => {
  try {
    const {
      title,
      companyName,
      description,
      location,
      mode,
      stipend,
      duration,
      skillsRequired,
      eligibility,
      openings,
      deadline,
    } = req.body;

    if (!title || !companyName || !description || !deadline) {
      return res.status(400).json({
        success: false,
        message: "title, companyName, description and deadline are required",
      });
    }

    const internship = await Internship.create({
      title,
      companyName,
      description,
      location,
      mode,
      stipend,
      duration,
      skillsRequired,
      eligibility,
      openings,
      deadline,
      postedBy: req.user._id,
    });

    res.status(201).json({ success: true, internship });
  } catch (err) {
    next(err);
  }
};

// @route GET /api/internships?search=&mode=&location=&status=&page=&limit=
export const getInternships = async (req, res, next) => {
  try {
    const { search, mode, location, status, page = 1, limit = 10 } = req.query;
    const query = {};

    if (search) {
      query.$or = [
        { title: { $regex: search, $options: "i" } },
        { companyName: { $regex: search, $options: "i" } },
        { skillsRequired: { $regex: search, $options: "i" } },
      ];
    }
    if (mode) query.mode = mode;
    if (location) query.location = { $regex: location, $options: "i" };
    if (status) query.status = status;

    const skip = (Number(page) - 1) * Number(limit);
    const [internships, total] = await Promise.all([
      Internship.find(query).sort({ createdAt: -1 }).skip(skip).limit(Number(limit)),
      Internship.countDocuments(query),
    ]);

    res.status(200).json({
      success: true,
      internships,
      total,
      page: Number(page),
      pages: Math.ceil(total / Number(limit)),
    });
  } catch (err) {
    next(err);
  }
};

// @route GET /api/internships/:id
export const getInternshipById = async (req, res, next) => {
  try {
    const internship = await Internship.findById(req.params.id).populate("postedBy", "name companyProfile email");
    if (!internship) return res.status(404).json({ success: false, message: "Internship not found" });
    res.status(200).json({ success: true, internship });
  } catch (err) {
    next(err);
  }
};

// @route PUT /api/internships/:id
export const updateInternship = async (req, res, next) => {
  try {
    const internship = await Internship.findById(req.params.id);
    if (!internship) return res.status(404).json({ success: false, message: "Internship not found" });

    const isOwner = internship.postedBy.toString() === req.user._id.toString();
    if (!isOwner && !["admin", "coordinator"].includes(req.user.role)) {
      return res.status(403).json({ success: false, message: "You do not have permission to edit this internship" });
    }

    Object.assign(internship, req.body);
    await internship.save();

    res.status(200).json({ success: true, internship });
  } catch (err) {
    next(err);
  }
};

// @route DELETE /api/internships/:id
export const deleteInternship = async (req, res, next) => {
  try {
    const internship = await Internship.findById(req.params.id);
    if (!internship) return res.status(404).json({ success: false, message: "Internship not found" });

    const isOwner = internship.postedBy.toString() === req.user._id.toString();
    if (!isOwner && !["admin", "coordinator"].includes(req.user.role)) {
      return res.status(403).json({ success: false, message: "You do not have permission to delete this internship" });
    }

    await internship.deleteOne();
    res.status(200).json({ success: true, message: "Internship deleted" });
  } catch (err) {
    next(err);
  }
};
