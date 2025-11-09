// student-service/middleware/authMiddleware.js
import jwt from 'jsonwebtoken';
import Student from '../models/studentModel.js';

const protect = async (req, res, next) => {
  let token;

  // 1. Check if the Authorization header exists and starts with 'Bearer'
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    try {
      // 2. Get token from header (e.g., "Bearer eyJhbGci...")
      token = req.headers.authorization.split(' ')[1];

      // 3. Verify the token using the shared secret
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

     const studentProfile = await Student.findOne({ authId: decoded.userId });

      if (!studentProfile) {
        return res.status(401).json({ message: 'Not authorized, student profile not found' });
      }

       req.student = studentProfile;

      next(); // Proceed to the next middleware or controller
    } catch (error) {
      console.error(error);
      res.status(401).json({ message: 'Not authorized, token failed' });
    }
  }

  if (!token) {
    res.status(401).json({ message: 'Not authorized, no token' });
  }
};

export { protect };
export const getAuthUser = (req, res, next) => {
    let token;
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        try {
            token = req.headers.authorization.split(' ')[1];
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            // Just attach the auth ID, don't look for a student
            req.authId = decoded.userId;
            next();
        } catch (error) {
            return res.status(401).json({ message: 'Not authorized, token failed' });
        }
    }
    if (!token) {
        return res.status(401).json({ message: 'Not authorized, no token' });
    }
};