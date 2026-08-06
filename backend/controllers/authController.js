import User, { USER_ROLES } from "../models/User.js";
import generateToken from "../utils/generateToken.js";

const cookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "lax",
  maxAge: 7 * 24 * 60 * 60 * 1000,
};

const clearCookieOptions = {
  httpOnly: cookieOptions.httpOnly,
  secure: cookieOptions.secure,
  sameSite: cookieOptions.sameSite,
};

// @route POST /api/auth/register
export const register = async (req, res, next) => {
  try {
    const { name, email, password, role, phone } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ success: false, message: "Name, email and password are required" });
    }

    if (role && !USER_ROLES.includes(role)) {
      return res.status(400).json({ success: false, message: "Invalid role" });
    }

    // Admin accounts should not be self-registered through the public form
    if (role === "admin") {
      return res.status(403).json({ success: false, message: "Admin accounts cannot be self-registered" });
    }

    const existing = await User.findOne({ email: email.toLowerCase() });
    if (existing) {
      return res.status(409).json({ success: false, message: "An account with this email already exists" });
    }

    const user = await User.create({
      name,
      email: email.toLowerCase(),
      password,
      role: role || "student",
      phone: phone || "",
    });

    const token = generateToken(user._id, user.role);
    res.cookie("token", token, cookieOptions);

    res.status(201).json({ success: true, token, user: user.toSafeObject() });
  } catch (err) {
    next(err);
  }
};

// @route POST /api/auth/login
export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ success: false, message: "Email and password are required" });
    }

    const user = await User.findOne({ email: email.toLowerCase() }).select("+password");
    if (!user || !(await user.comparePassword(password))) {
      return res.status(401).json({ success: false, message: "Invalid email or password" });
    }

    if (!user.isActive) {
      return res.status(403).json({ success: false, message: "This account has been suspended" });
    }

    const token = generateToken(user._id, user.role);
    res.cookie("token", token, cookieOptions);

    res.status(200).json({ success: true, token, user: user.toSafeObject() });
  } catch (err) {
    next(err);
  }
};

// @route POST /api/auth/logout
export const logout = async (req, res) => {
  res.clearCookie("token", clearCookieOptions);
  res.status(200).json({ success: true, message: "Logged out successfully" });
};

// @route GET /api/auth/me
export const getMe = async (req, res, next) => {
  try {
    res.status(200).json({ success: true, user: req.user.toSafeObject() });
  } catch (err) {
    next(err);
  }
};

// @route PUT /api/auth/change-password
export const changePassword = async (req, res, next) => {
  try {
    const { currentPassword, newPassword } = req.body;
    if (!currentPassword || !newPassword) {
      return res.status(400).json({ success: false, message: "Current and new password are required" });
    }

    const user = await User.findById(req.user._id).select("+password");
    if (!(await user.comparePassword(currentPassword))) {
      return res.status(401).json({ success: false, message: "Current password is incorrect" });
    }

    user.password = newPassword;
    await user.save();

    res.status(200).json({ success: true, message: "Password updated successfully" });
  } catch (err) {
    next(err);
  }
};
