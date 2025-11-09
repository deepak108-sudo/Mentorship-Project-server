import dotenv from "dotenv";
dotenv.config();

//import libraries
import express from "express";
import mongoose from "mongoose";
import studentRoutes from "./routes/studentRoutes.js";

//initialize
const app = express();
const PORT = process.env.PORT || 5000;

//middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//get info.
app.get('/',(req,res)=>{
  res.status(200).json({
    status: "We are live bidu",
    message:"Hello",
    time:new Date().toISOString
  })
});

// --Request logging middleware (important for debugging)
app.use((req, res, next) => {
  console.log(`[Student-Service] ${req.method} ${req.url}`);
  console.log(`[Student-Service] Original URL: ${req.originalUrl}`);
  console.log(`[Student-Service] Base URL: ${req.baseUrl}`);
  if (req.body && Object.keys(req.body).length > 0) {
    console.log(`[Student-Service] Request body:`, req.body);
  }
  next();
});

const startServer = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log(`MongoDB Successfully Connected ✅`);
    app.use("/api/student", studentRoutes);

    //  Debug: Catch-all route to see unmatched requests
    app.use("*", (req, res) => {
      console.log(
        `[Student-Service] Unmatched route: ${req.method} ${req.originalUrl}`
      );
      res.status(404).json({
        error: "Route not found",
        method: req.method,
        path: req.originalUrl,
        message: "This route is not registered in the student service",
      });
    });

    //  Debug: Log all registered routes
    console.log("Registered routes:");
    console.log("  POST /api/student/register");
    console.log("  POST /api/student/login");

    //Start server after connecting database
    app.listen(PORT, () => {
      console.log(`Student Service running on port ${PORT}`);
    });
  } catch (err) {
    console.error(`DB not connected ❌`, err.message);
    process.exit(1);
  }
};

startServer();
