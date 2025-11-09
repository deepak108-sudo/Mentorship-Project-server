// student-service/models/courseModel.js
import mongoose from 'mongoose';

const courseSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String },
});

const Course = mongoose.model('Course', courseSchema);

export default Course;   