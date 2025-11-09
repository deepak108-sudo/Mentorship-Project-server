// student-service/routes/studentRoutes.js
import express from "express";
import {
  getStudentProfile,
  updateStudentProfile,
  getEnrollments,
  enrollInCourse,
  getCourseProgress,
  addToWishlist,
  getWishlist,
  postReview,
  login,
  register,
  forgotPassword,
  resetPassword,
} from "../controllers/studentController.js"; // Make sure you export createStudentProfile
import { protect, getAuthUser } from "../middleware/authMiddleware.js";

const router = express.Router();
router.post("/register", register);
router.post("/login", login);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password/:token", resetPassword);

// All routes below this require a student profile to exist.
router.use(protect);

router.route("/profile").get(getStudentProfile).put(updateStudentProfile);
router.route("/enrollments").get(getEnrollments);
router.route("/enroll").post(enrollInCourse);
router.route("/progress/:courseId").get(getCourseProgress);
router.route("/wishlist").get(getWishlist).post(addToWishlist);
router.route("/review").post(postReview);

export default router;
