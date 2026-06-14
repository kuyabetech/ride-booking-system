import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { validationResult } from 'express-validator';
import { getDB } from '../config/database.js';
import { sendEmail, sendWelcomeEmail } from '../utils/email.js';
import { generateUserId } from '../utils/helpers.js';

export const register = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, errors: errors.array() });
    }
    
    const { email, password, firstName, lastName, phone } = req.body;
    const db = getDB();
    
    // Check if user exists
    const [existing] = await db.query('SELECT id FROM users WHERE email = ?', [email]);
    if (existing.length > 0) {
      return res.status(400).json({ success: false, message: 'Email already registered' });
    }
    
    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);
    const userId = generateUserId('USR');
    
    // Create user
    const [result] = await db.query(
      `INSERT INTO users (user_id, email, password_hash, first_name, last_name, phone, role) 
       VALUES (?, ?, ?, ?, ?, ?, 'user')`,
      [userId, email, hashedPassword, firstName, lastName, phone]
    );
    
    // Generate token
    const token = jwt.sign(
      { userId: result.insertId, email, role: 'user' },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );
    
    // Send welcome email
    await sendWelcomeEmail(email, firstName);
    
    res.status(201).json({
      success: true,
      message: 'Registration successful',
      token,
      user: {
        id: userId,
        email,
        firstName,
        lastName,
        role: 'user'
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Registration failed' });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const db = getDB();
    
    const [users] = await db.query(
      'SELECT * FROM users WHERE email = ? AND is_active = TRUE',
      [email]
    );
    
    if (users.length === 0) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }
    
    const user = users[0];
    const isValidPassword = await bcrypt.compare(password, user.password_hash);
    
    if (!isValidPassword) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }
    
    // Update last login
    await db.query('UPDATE users SET last_login = NOW() WHERE id = ?', [user.id]);
    
    const token = jwt.sign(
      { userId: user.id, email: user.email, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );
    
    // Log activity
    await db.query(
      'INSERT INTO activity_logs (user_id, action, entity_type, ip_address) VALUES (?, ?, ?, ?)',
      [user.id, 'login', 'auth', req.ip]
    );
    
    res.json({
      success: true,
      message: 'Login successful',
      token,
      user: {
        id: user.user_id,
        email: user.email,
        firstName: user.first_name,
        lastName: user.last_name,
        role: user.role,
        profilePicture: user.profile_picture
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Login failed' });
  }
};

export const logout = async (req, res) => {
  try {
    await db.query(
      'INSERT INTO activity_logs (user_id, action, entity_type, ip_address) VALUES (?, ?, ?, ?)',
      [req.user.id, 'logout', 'auth', req.ip]
    );
    
    res.json({ success: true, message: 'Logout successful' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Logout failed' });
  }
};

export const refreshToken = async (req, res) => {
  try {
    const { refreshToken } = req.body;
    
    const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
    const db = getDB();
    
    const [users] = await db.query('SELECT * FROM users WHERE id = ? AND is_active = TRUE', [decoded.userId]);
    if (users.length === 0) {
      return res.status(401).json({ success: false, message: 'User not found' });
    }
    
    const user = users[0];
    const newToken = jwt.sign(
      { userId: user.id, email: user.email, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );
    
    res.json({ success: true, token: newToken });
  } catch (error) {
    res.status(401).json({ success: false, message: 'Token refresh failed' });
  }
};
