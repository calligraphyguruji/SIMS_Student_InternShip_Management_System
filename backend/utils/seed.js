// Populates the database with one account per role plus a sample internship
// and application, so the app has real data to demo immediately.
//
// Run with: npm run seed

import dotenv from "dotenv";
import connectDB from "../config/db.js";
import User from "../models/User.js";
import Internship from "../models/Internship.js";
import Application from "../models/Application.js";

dotenv.config();

const run = async () => {
  await connectDB();

  console.log("Clearing existing data...");
  await Promise.all([User.deleteMany({}), Internship.deleteMany({}), Application.deleteMany({})]);

  console.log("Creating users...");
  const admin = await User.create({
    name: "Admin User",
    email: "admin@sims.edu",
    password: "password123",
    role: "admin",
  });

  const coordinator = await User.create({
    name: "Dr. Priya Sharma",
    email: "coordinator@sims.edu",
    password: "password123",
    role: "coordinator",
  });

  const faculty = await User.create({
    name: "Dr. Rakesh Verma",
    email: "faculty@sims.edu",
    password: "password123",
    role: "faculty",
    facultyProfile: { department: "Computer Science", designation: "Associate Professor" },
  });

  const company = await User.create({
    name: "Neha Kapoor",
    email: "hr@techcorp.com",
    password: "password123",
    role: "company",
    companyProfile: { companyName: "TechCorp Solutions", industry: "Software", isVerified: true },
  });

  const student = await User.create({
    name: "Aman Singh",
    email: "student@sims.edu",
    password: "password123",
    role: "student",
    studentProfile: {
      department: "Computer Science",
      year: "3rd Year",
      cgpa: 8.4,
      skills: ["React", "Node.js", "MongoDB"],
      mentor: faculty._id,
    },
  });

  console.log("Creating a sample internship...");
  const internship = await Internship.create({
    title: "Frontend Developer Intern",
    companyName: "TechCorp Solutions",
    postedBy: company._id,
    description: "Work on our React-based customer dashboard alongside the product engineering team.",
    location: "Bengaluru",
    mode: "hybrid",
    stipend: 15000,
    duration: "8 weeks",
    skillsRequired: ["React", "JavaScript", "CSS"],
    eligibility: "3rd/4th year, CS/IT branch",
    openings: 3,
    deadline: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
  });

  console.log("Creating a sample application...");
  await Application.create({
    student: student._id,
    internship: internship._id,
    status: "pending",
    coverLetter: "I am excited to apply my React skills to a real product team.",
    history: [{ status: "pending", note: "Application submitted", by: student._id }],
  });

  console.log("\nSeed complete. Sample logins (password: password123):");
  console.log("  Admin:       admin@sims.edu");
  console.log("  Coordinator: coordinator@sims.edu");
  console.log("  Faculty:     faculty@sims.edu");
  console.log("  Company HR:  hr@techcorp.com");
  console.log("  Student:     student@sims.edu");

  process.exit(0);
};

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
