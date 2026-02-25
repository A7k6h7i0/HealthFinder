import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.resolve(__dirname, "../.env") });

// Routes
import authRoutes from "./routes/authRoutes.js";
import diseaseRoutes from "./routes/diseaseRoutes.js";
import centerRoutes from "./routes/centerRoutes.js";
import otpRoutes from "./routes/otpRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";
import reportRoutes from "./routes/reportRoutes.js";

// Middleware
import { notFound, errorHandler } from "./middleware/errorMiddleware.js";

const app = express();

const allowedOrigins = new Set([
  "http://localhost:5173",
  process.env.CLIENT_URL
].filter(Boolean));

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin) return callback(null, true);
      if (allowedOrigins.has(origin)) return callback(null, true);
      if (/^https:\/\/[a-z0-9-]+\.vercel\.app$/i.test(origin)) return callback(null, true);
      return callback(new Error("Not allowed by CORS"));
    },
    credentials: true,
    optionsSuccessStatus: 200
  })
);

app.use(express.json());
app.use("/uploads", express.static(path.join(process.cwd(), "uploads")));

app.get("/api/disclaimer", (req, res) => {
  res.json({
    message:
      "We are not medical advisors. This platform lists community-submitted health service centers. Always consult qualified medical professionals before making health decisions."
  });
});

app.use("/api/auth", authRoutes);
app.use("/api/diseases", diseaseRoutes);
app.use("/api/centers", centerRoutes);

app.use("/api/services", centerRoutes);

app.use("/api/otp", otpRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/reports", reportRoutes);

app.get("/api/health", (req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

app.use(notFound);
app.use(errorHandler);

export default app;
