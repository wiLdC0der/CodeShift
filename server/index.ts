import "dotenv/config";
import cookieParser from "cookie-parser";
import cors from "cors";
import express from "express";
import { db } from "./lib/db";
import authRoutes from "./routes/auth.routes";
import assessmentRoutes from "./routes/assessment.routes";
import roadmapRoutes from "./routes/roadmap.routes";
import progressRoutes from "./routes/progress.routes";


const app = express();
const PORT = Number(process.env.PORT) || 5000;

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  }),
);

app.use(express.json());
app.use(cookieParser());

app.get("/api/health", (_req, res) => {
  res.json({
    status: "ok",
    service: "codeshift-api",
  });
});

app.get("/api/health/database", async (_req, res) => {
  try {
    const users = await db.orm.public.User.all();

    res.json({
      status: "ok",
      database: "connected",
      usersFound: users.length,
    });
  } catch (error) {
    console.error("Database health check failed:", error);

    res.status(500).json({
      status: "error",
      database: "unavailable",
    });
  }
});
app.use("/api/auth", authRoutes);
app.use("/api/assessment", assessmentRoutes);
app.use("/api/roadmap", roadmapRoutes);
app.use("/api/progress", progressRoutes);

app.listen(PORT, () => {
  console.log(`CodeShift API running on http://localhost:${PORT}`);
});