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
  res.send("Gateway is live ✅");
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
    // 3. HARDCODED TARGET FIX: Using the internal Render service name
    target: "http://mentorship-project-server-1:5000",
    changeOrigin: true,
    timeout: 10000,
    proxyTimeout: 10000, // Removed the pathRewrite function as it was likely incorrect.

    onError: (err, req, res) => {
      console.error(`[Gateway] Proxy error:`, err);
      if (!res.headersSent) {
        res.status(502).json({
          error: "Gateway proxy error",
          message: err.message,
          details:
            "Cannot connect to student service. Check Render internal service name.",
        });
      }
    },
  })
);

// ---MENTOR SERVICE PROXY---
app.use(
  "/api/mentor",
  createProxyMiddleware({
    // 4. HARDCODED TARGET FIX: Using the internal Render service name
    target: "http://<your-mentor-service-name>:5003", // NOTE: Replace <your-mentor-service-name>
    changeOrigin: true,
    pathRewrite: {
      "^/api/mentor": "/api/mentor",
    },
  })
);

// Start Gateway
const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
  console.log(`API Gateway running on port ${PORT}`);
});
