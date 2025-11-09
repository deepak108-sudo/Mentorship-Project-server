import Student from "../models/studentModel.js";
//import Course from "../models/courseModel.js";
import Review from "../models/reviewModel.js";
import bcrypt from "bcryptjs";
import { generateToken } from "../utils/jwtUtils.js";
import crypto from "crypto"; // <-- ADDED: Needed for password reset functions

// NOTE: The 'authId' field was removed from the Student Model.
// The unique ID for a student is now the MongoDB generated '_id'.

//--------------------------------Register----------------------------------------
const register = async (req, res) => {
  try {
    console.log("[Register] Received request body:", req.body);

    const { email, password, university, course } = req.body;

    // ----Validate required fields
    if (!email || !password || !university || !course) {
      console.log("[Register] Missing required fields");
      return res.status(400).json({
        msg: "Missing required fields",
        required: ["email", "password", "university", "course"],
      });
    }

    // Check if user exist
    const existingUser = await Student.findOne({ email });
    if (existingUser) {
      console.log("[Register] User already exists:", email);
      return res.status(400).json({ msg: "User already exists" });
    }

    // Create new User (password will be hashed by pre-save hook)
    const newUser = new Student({
      email,
      password,
      university,
      course,
    });

    await newUser.save();
    console.log("[Register] Student registered successfully:", email);
    return res.status(201).json({
      msg: "Student created successfully",
    });
  } catch (err) {
    console.error("[Register] Error:", err);
    // ----More detailed error messages
    if (err.name === "ValidationError") {
      return res.status(400).json({
        msg: "Validation error",
        error: err.message,
      });
    }
    if (err.code === 11000) {
      return res.status(400).json({
        msg: "User already exists (duplicate key)",
      });
    }
    return res.status(500).json({
      msg: "Server error",
      error: err.message,
    });
  }
};

//----------------------------------Login-------------------------------------------------
const login = async (req, res) => {
  try {
    const { email, password } = req.body; //find user

    const user = await Student.findOne({ email });
    if (!user) {
      return res.status(404).json({ msg: "User not found" });
    } //compare password

    const isMatched = await bcrypt.compare(password, user.password);
    if (!isMatched) return res.status(400).json({ msg: "Invalid Credentials" }); //create jwt

    const token = generateToken(user);

    console.log(`Token: ${token}`);
    res.status(200).json({
      status: "success",
      message: "Login Successful",
      token: token,
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json("Server error");
  }
};

export { register, login };

// ----- Forgot Password -----
export const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    const student = await Student.findOne({ email });
    if (!student) return res.status(404).json({ msg: "Mentor not found" });

    const token = crypto.randomBytes(32).toString("hex");
    student.resetPasswordToken = crypto
      .createHash("sha256")
      .update(token)
      .digest("hex");
    student.resetPasswordExpires = Date.now() + 3600000; // 1 hour
    await student.save({ validateBeforeSave: false }); // NOTE: sendResetEmail is not defined, assuming it exists elsewhere or is a placeholder // await sendResetEmail(student, token);

    res.status(200).json({ msg: "Password reset email sent" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Server error" });
  }
};

// ----- Reset Password -----
export const resetPassword = async (req, res) => {
  try {
    const { token } = req.params;
    const { password } = req.body;
    const hashedToken = crypto.createHash("sha256").update(token).digest("hex");

    const student = await Student.findOne({
      resetPasswordToken: hashedToken,
      resetPasswordExpires: { $gt: Date.now() },
    });

    if (!student)
      return res.status(400).json({ msg: "Invalid or expired token" });

    student.password = password; // hashed by pre-save hook
    student.resetPasswordToken = undefined;
    student.resetPasswordExpires = undefined;

    await student.save();
    res.status(200).json({ msg: "Password reset successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Server error" });
  }
};

//------------------------------------------End of Authentication-------------------------------------------

// GET /api/student/profile
export const getStudentProfile = (req, res) => {
  const { _id, email, university, course } = req.student; // Adjusted to show actual schema fields
  res.status(200).json({ id: _id, email, university, course });
};

// PUT /api/student/profile
export const updateStudentProfile = async (req, res) => {
  try {
    // Allow updating non-auth fields like university/course
    const { university, course } = req.body;
    const updateFields = {};
    if (university) updateFields.university = university;
    if (course) updateFields.course = course;

    await Student.findByIdAndUpdate(req.student.id, updateFields, {
      new: true,
    });
    res.status(200).json({ message: "Profile updated" });
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
};

// REMOVED: createStudentProfile (It was redundant and relied on the deprecated 'authId' field.)

// GET /api/student/enrollments
export const getEnrollments = async (req, res) => {
  try {
    const student = await Student.findById(req.student.id).populate(
      "enrollments.course",
      "id title"
    );
    res.status(200).json({ courses: student.enrollments.map((e) => e.course) });
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
};

// POST /api/student/enroll
export const enrollInCourse = async (req, res) => {
  try {
    const { courseId } = req.body;
    if (!courseId)
      return res.status(400).json({ message: "Course ID is required" });

    const isEnrolled = req.student.enrollments.some(
      (e) => e.course.toString() === courseId
    );
    if (isEnrolled)
      return res.status(400).json({ message: "Already enrolled" });

    req.student.enrollments.push({ course: courseId });
    await req.student.save();

    res.status(201).json({ message: "Enrollment successful" });
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
};

// GET /api/student/progress/:courseId
export const getCourseProgress = (req, res) => {
  const { courseId } = req.params;
  const enrollment = req.student.enrollments.find(
    (e) => e.course.toString() === courseId
  );
  if (!enrollment)
    return res.status(404).json({ message: "Not enrolled in this course" });
  res.status(200).json({ progress: `${enrollment.progress}%` });
};

// POST /api/student/wishlist
export const addToWishlist = async (req, res) => {
  try {
    const { courseId } = req.body;
    await Student.findByIdAndUpdate(req.student.id, {
      $addToSet: { wishlist: courseId },
    });
    res.status(200).json({ message: "Added to wishlist" });
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
};

// GET /api/student/wishlist
export const getWishlist = async (req, res) => {
  try {
    const student = await Student.findById(req.student.id).populate(
      "wishlist",
      "id title"
    );
    res.status(200).json({ wishlist: student.wishlist });
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
};

// POST /api/student/review
export const postReview = async (req, res) => {
  try {
    const { courseId, rating, comment } = req.body;
    const studentId = req.student.id;

    const isEnrolled = req.student.enrollments.some(
      (e) => e.course.toString() === courseId
    );
    if (!isEnrolled)
      return res.status(403).json({ message: "Must be enrolled to review" });

    const existingReview = await Review.findOne({
      course: courseId,
      student: studentId,
    });
    if (existingReview)
      return res.status(400).json({ message: "Already reviewed this course" });

    await Review.create({
      course: courseId,
      student: studentId,
      rating,
      comment,
    });
    res.status(201).json({ message: "Review submitted" });
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
};
