import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import authRoutes from "./routes/authRoutes.js";
import serviceRoutes from "./routes/serviceRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";
import reportRoutes from "./routes/reportRoutes.js";
import { notFound, errorHandler } from "./middleware/errorMiddleware.js";

dotenv.config();

const app = express();

app.use(
  cors({
    origin: [
      "http://localhost:5173",                    // Local development
      "https://health-finder-zeta.vercel.app",   // Your Vercel frontend
      "https://*.vercel.app"                      // All Vercel subdomains
    ],
    credentials: true,
    optionsSuccessStatus: 200
  })
);

app.use(express.json());

// disclaimer and safety message endpoint (optional)
app.get("/api/disclaimer", (req, res) => {
  res.json({
    message:
      "We are not medical advisors. This platform lists community-submitted health service centers. Always consult qualified medical professionals before making health decisions."
  });
});

// routes
app.use("/api/auth", authRoutes);
app.use("/api/services", serviceRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/reports", reportRoutes);

app.use(notFound);
app.use(errorHandler);

export default app;
