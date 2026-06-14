import jwt from 'jsonwebtoken';
import { getDB } from '../config/database.js';

export const authenticate = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    
    if (!token) {
      return res.status(401).json({ success: false, message: 'Authentication required' });
    }
    
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const db = getDB();
    
    const [users] = await db.query(
      'SELECT id, user_id, email, first_name, last_name, phone, role FROM users WHERE id = ? AND is_active = TRUE',
      [decoded.userId]
    );
    
    if (users.length === 0) {
      return res.status(401).json({ success: false, message: 'User not found or inactive' });
    }
    
    req.user = users[0];
    next();
  } catch (error) {
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({ success: false, message: 'Invalid token' });
    }
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ success: false, message: 'Token expired' });
    }
    res.status(500).json({ success: false, message: 'Authentication error' });
  }
};

export const authorize = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ 
        success: false, 
        message: 'Access denied. Insufficient permissions' 
      });
    }
    next();
  };
};
