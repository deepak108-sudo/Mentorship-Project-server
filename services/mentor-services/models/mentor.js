import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import { hashPasswordHook } from "../hooks/mentorHooks.js";

const { Schema } = mongoose;

const mentorSchema = new Schema({
  email: {
    type: String,
    unique: true,
    required: true,
    trim: true,
  },
  password: {
    type: String,
    required: true,
    minLength: 4,
  },
  expertise: {
    type: String,
    required: true,
  },
  bio: {
    type: String,
    required: true,
  },
  university: {
    type: String,
    required: true,
  },
  course: {
    type: String,
    required: true,
  },
  passingYear: {
    type: Number,
    required: true,
  },

  // ----- New fields for forgot/reset password -----
  resetPasswordToken: String,
  resetPasswordExpires: Date,
});

mentorSchema.pre('save', hashPasswordHook);


const Mentor = mongoose.model("Mentor", mentorSchema);

export default Mentor;
