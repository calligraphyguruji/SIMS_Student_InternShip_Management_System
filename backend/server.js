import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
import path from "path";
import connectDB from "./config/db.js";
import { notFound, errorHandler } from "./middleware/errorHandler.js";

import authRoutes from "./routes/authRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import internshipRoutes from "./routes/internshipRoutes.js";
import applicationRoutes from "./routes/applicationRoutes.js";
import statsRoutes from "./routes/statsRoutes.js";

dotenv.config();

const app = express();
const allowedOrigins = [
  ...(process.env.CLIENT_URL || "http://localhost:5173")
    .split(",")
    .map((origin) => origin.trim())
    .filter(Boolean),
  "http://localhost:5173",
  "http://localhost:5174",
];

app.use(
  cors({
    origin: allowedOrigins,
    credentials: true,
  })
);
app.use(express.json({ limit: "8mb" }));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use("/uploads", express.static(path.resolve("uploads")));

app.get("/api/health", (req, res) => {
  res.status(200).json({ success: true, message: "SIMS API is running" });
});

app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/internships", internshipRoutes);
app.use("/api/applications", applicationRoutes);
app.use("/api/stats", statsRoutes);

app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5001;

const startServer = async () => {
  await connectDB();

  const server = app.listen(PORT, () => {
    console.log(`SIMS backend listening on http://localhost:${PORT}`);
  });

  server.on("error", (err) => {
    if (err.code === "EADDRINUSE") {
      console.error(`Port ${PORT} is already in use. Set PORT to another value or stop the existing server.`);
      process.exit(1);
    }

    console.error(`Server error: ${err.message}`);
    process.exit(1);
  });
};

startServer().catch((err) => {
  console.error(`Failed to start server: ${err.message}`);
  process.exit(1);
});
