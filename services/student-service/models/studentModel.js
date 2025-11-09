import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const { Schema } = mongoose;

const enrollmentSchema = new Schema(
  {
    course: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Course",
      required: true,
    },
    progress: { type: Number, default: 0, min: 0, max: 100 },
  },
  { _id: false }
);

const studentSchema = new Schema(
  {
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
    university: {
      type: String,
      required: true,
    },
    course: {
      type: String,
      required: true,
    },
    resetPasswordToken: String,
    resetPasswordExpires: Date,
  },
  { timestamps: true }
);

// 🔒 Hash password before save
studentSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

const Student = mongoose.model("Student", studentSchema);
export default Student;
