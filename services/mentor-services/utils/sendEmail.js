import nodemailer from "nodemailer";

export const sendResetEmail = async (mentor, token) => {
  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS, // 16-character App Password
      },
    });

    console.log('User:', process.env.EMAIL_USER);
console.log('Pass:', process.env.EMAIL_PASS);

    const resetURL = `http://localhost:3000/mentor/reset-password/${token}`;

    const message = `
      <h3>Password Reset Request</h3>
      <p>Click the link below to reset your password:</p>
      <a href="${resetURL}">Reset Password</a>
      <p>This link will expire in 1 hour.</p>
    `;

    await transporter.sendMail({
      from: `"Mentorship App" <${process.env.EMAIL_USER}>`, 
      to: mentor.email,
      subject: "Mentor Password Reset",
      html: message,
    });

    console.log("Password reset email sent successfully to", mentor.email);
  } catch (error) {
      console.error("Detailed email error:", error);
  }
};
