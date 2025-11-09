import express from "express";
import cors from "cors";
import dotenv from "dotenv";
dotenv.config();

import { createProxyMiddleware } from "http-proxy-middleware";

const app = express();

// Allow frontend (Vite) access
app.use(
  cors({
    origin: "https://client-944o.vercel.app" || "http://localhost:5173",
    credentials: true,
  })
);

//  Health check route (optional) - needs body parsing
app.get("/api/ping", express.json(), (req, res) => {
  res.send("Gateway is live ✅");
});

// Log incoming requests (for debugging) - but don't parse body yet
app.use((req, res, next) => {
  console.log(`[Gateway] ${req.method} ${req.originalUrl}`);
  next();
});

// ---STUDENT SERVICE PROXY
app.use(
  "/api/student",
  createProxyMiddleware({
    target: "http://localhost:5000",
    changeOrigin: true,
    timeout: 10000,
    proxyTimeout: 10000,
    // ✅ CRITICAL FIX: Express strips /api/student prefix before proxy
    // pathRewrite function receives the stripped path and req object
    // We need to return the full original path from req.originalUrl
    pathRewrite: (path, req) => {
      const fullPath = req.originalUrl || `/api/student${path}`;
      console.log(`[Gateway] pathRewrite: "${path}" -> "${fullPath}"`);
      return fullPath;
    },
    onError: (err, req, res) => {
      console.error(`[Gateway] Proxy error:`, err);
      console.error(`[Gateway] Error details:`, {
        message: err.message,
        code: err.code,
        errno: err.errno,
        syscall: err.syscall,
        address: err.address,
        port: err.port,
      });
      if (!res.headersSent) {
        res.status(502).json({
          error: "Gateway proxy error",
          message: err.message,
          details:
            "Cannot connect to student service. Is it running on port 5000?",
        });
      }
    },
    onProxyReq: (proxyReq, req, res) => {
      console.log(`[Gateway] Proxying ${req.method} ${req.originalUrl}`);
      console.log(`[Gateway] Final proxy path: ${proxyReq.path}`);
    },
    onProxyRes: (proxyRes, req, res) => {
      console.log(
        `[Gateway] Response from student-service: ${proxyRes.statusCode} ${req.originalUrl}`
      );
    },
  })
);

// MENTOR SERVICE PROXY
app.use(
  "/api/mentor",
  createProxyMiddleware({
    target: "http://localhost:5003",
    changeOrigin: true,
    pathRewrite: {
      "^/api/mentor": "/api/mentor",
    },
  })
);

// Start Gateway
const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
  console.log(`API Gateway running on http://localhost:${PORT}`);
});
