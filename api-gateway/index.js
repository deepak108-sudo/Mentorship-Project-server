import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { createProxyMiddleware } from "http-proxy-middleware";

dotenv.config();

const app = express();

// 1. HARDCODED CORS FIX: Allowing your Vercel client and localhost
const ALLOWED_ORIGINS = [
  "https://client-944o.vercel.app", // Your Vercel frontend
  "http://localhost:5173", // Your local dev environment
];

app.use(
  cors({
    origin: ALLOWED_ORIGINS,
    credentials: true,
  })
);

// 2. GET / FIX: Simple health check for the root path
app.get("/", (req, res) => {
  res.status(200).json({
    status: "Gateway Service Operational",
    message: "Access proxy routes at /api/gateway",
    time: new Date().toISOString(),
  });
});

// Health check route (optional)
app.get("/api/ping", express.json(), (req, res) => {
  res.send("Gateway is live ");
});

// Log incoming requests (for debugging)
app.use((req, res, next) => {
  console.log(`[Gateway] ${req.method} ${req.originalUrl}`);
  next();
});

// ---STUDENT SERVICE PROXY---
app.use(
  "/api/student",
  createProxyMiddleware({
    // ✅ FIX: Use the public, fully qualified URL for the Student Service.
    target:
      "https://mentorship-project-server-1.onrender.com/api/student" ||
      "http://localhost:5000/api/student",
    changeOrigin: true,
    timeout: 15000, // Increased timeout slightly for better waking tolerance
    proxyTimeout: 15000,

    onError: (err, req, res) => {
      console.error(`[Gateway] Proxy error:`, err);
      if (!res.headersSent) {
        res.status(502).json({
          error: "Gateway proxy error",
          message: err.message,
          details:
            "Cannot connect to student service. Check public URL and ensure service is awake.",
        });
      }
    },
  })
);

// ---MENTOR SERVICE PROXY---
app.use(
  "/api/mentor",
  createProxyMiddleware({
    // Target: Internal Render service name - Placeholder still needs replacement
    target: "http://<your-mentor-service-name>:5003",
    changeOrigin: true,
    // Note: This pathRewrite seems incorrect and should probably be stripped like the student one.
    // Assuming your mentor service expects paths without '/api/mentor'
    pathRewrite: {
      "^/api/mentor": "",
    },
  })
);

// Start Gateway
const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
  console.log(`API Gateway running on port ${PORT}`);
});
