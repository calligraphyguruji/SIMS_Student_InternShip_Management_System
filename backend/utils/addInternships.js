import dotenv from "dotenv";
import connectDB from "../config/db.js";
import Internship from "../models/Internship.js";
import User from "../models/User.js";

dotenv.config();

const internships = [
  {
    title: "Full Stack Developer Intern",
    companyName: "TechCorp Solutions",
    description: "Build React and Node.js features for a production internship management product.",
    location: "Bengaluru",
    mode: "hybrid",
    stipend: 18000,
    duration: "10 weeks",
    skillsRequired: ["React", "Node.js", "MongoDB"],
    eligibility: "CS/IT students with JavaScript project experience",
    openings: 4,
  },
  {
    title: "Data Analytics Intern",
    companyName: "InsightGrid Labs",
    description: "Analyze operational datasets, prepare dashboards, and present weekly business insights.",
    location: "Pune",
    mode: "onsite",
    stipend: 14000,
    duration: "8 weeks",
    skillsRequired: ["Python", "SQL", "Power BI"],
    eligibility: "Students comfortable with spreadsheets, SQL, and basic statistics",
    openings: 3,
  },
  {
    title: "UI/UX Design Intern",
    companyName: "PixelBloom Studio",
    description: "Design wireframes, user flows, and polished interface mockups for web and mobile screens.",
    location: "Remote",
    mode: "remote",
    stipend: 12000,
    duration: "6 weeks",
    skillsRequired: ["Figma", "User Research", "Prototyping"],
    eligibility: "Portfolio with at least two UI/UX case studies",
    openings: 2,
  },
  {
    title: "Backend API Intern",
    companyName: "CloudNest Systems",
    description: "Create secure REST APIs, database models, and integration tests for cloud applications.",
    location: "Hyderabad",
    mode: "hybrid",
    stipend: 16000,
    duration: "12 weeks",
    skillsRequired: ["Express", "MongoDB", "REST APIs"],
    eligibility: "Good understanding of backend development and databases",
    openings: 5,
  },
  {
    title: "Machine Learning Intern",
    companyName: "AstraAI Research",
    description: "Prototype ML models, clean datasets, and evaluate model performance for applied AI tasks.",
    location: "Chennai",
    mode: "onsite",
    stipend: 20000,
    duration: "12 weeks",
    skillsRequired: ["Python", "scikit-learn", "Pandas"],
    eligibility: "Completed coursework or projects in machine learning",
    openings: 3,
  },
  {
    title: "Cybersecurity Intern",
    companyName: "ShieldByte Security",
    description: "Assist with vulnerability checks, security documentation, and basic web app hardening.",
    location: "Noida",
    mode: "onsite",
    stipend: 15000,
    duration: "8 weeks",
    skillsRequired: ["Networking", "OWASP", "Linux"],
    eligibility: "Interest in application security and ethical hacking",
    openings: 2,
  },
  {
    title: "Mobile App Developer Intern",
    companyName: "AppForge Labs",
    description: "Develop cross-platform mobile screens and integrate APIs for a customer-facing app.",
    location: "Mumbai",
    mode: "hybrid",
    stipend: 17000,
    duration: "10 weeks",
    skillsRequired: ["React Native", "JavaScript", "API Integration"],
    eligibility: "Experience building at least one mobile app project",
    openings: 4,
  },
  {
    title: "DevOps Intern",
    companyName: "DeployMate Technologies",
    description: "Support CI/CD pipelines, deployment automation, and monitoring for development teams.",
    location: "Remote",
    mode: "remote",
    stipend: 16000,
    duration: "8 weeks",
    skillsRequired: ["GitHub Actions", "Docker", "Linux"],
    eligibility: "Basic command-line and Git workflow knowledge",
    openings: 3,
  },
  {
    title: "Digital Marketing Intern",
    companyName: "GrowthLane Media",
    description: "Plan campaigns, write content briefs, track analytics, and optimize social media funnels.",
    location: "Delhi",
    mode: "hybrid",
    stipend: 10000,
    duration: "6 weeks",
    skillsRequired: ["SEO", "Content Writing", "Analytics"],
    eligibility: "Strong written communication and interest in marketing",
    openings: 6,
  },
  {
    title: "QA Automation Intern",
    companyName: "TestPilot Software",
    description: "Write automated test cases and manually verify core web application workflows.",
    location: "Ahmedabad",
    mode: "onsite",
    stipend: 13000,
    duration: "8 weeks",
    skillsRequired: ["Testing", "JavaScript", "Playwright"],
    eligibility: "Basic programming skills and attention to product quality",
    openings: 4,
  },
];

const run = async () => {
  await connectDB();

  const poster = await User.findOne({ role: "company" }) || await User.findOne({ role: "admin" });
  if (!poster) {
    throw new Error("No company or admin user found to post internships.");
  }

  const deadlineBase = Date.now() + 30 * 24 * 60 * 60 * 1000;
  const operations = internships.map((internship, index) => ({
    updateOne: {
      filter: { title: internship.title, companyName: internship.companyName },
      update: {
        $set: {
          ...internship,
          postedBy: poster._id,
          status: "open",
          deadline: new Date(deadlineBase + index * 24 * 60 * 60 * 1000),
        },
      },
      upsert: true,
    },
  }));

  const result = await Internship.bulkWrite(operations);
  const total = await Internship.countDocuments({});

  console.log(`Internships added/updated: ${result.upsertedCount + result.modifiedCount}`);
  console.log(`Total internships in database: ${total}`);
  process.exit(0);
};

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
