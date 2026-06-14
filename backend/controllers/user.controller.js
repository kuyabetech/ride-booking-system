import { getDB } from '../config/database.js';

export const getUserProfile = async (req, res) => {
  try {
    const db = getDB();
    const [users] = await db.query(
      'SELECT id, user_id, email, first_name, last_name, phone, role, profile_picture, created_at FROM users WHERE id = ?',
      [req.user.id]
    );
    
    if (users.length === 0) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }
    
    res.json({ success: true, user: users[0] });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch profile' });
  }
};

export const updateUserProfile = async (req, res) => {
  try {
    const { firstName, lastName, phone, profilePicture } = req.body;
    const db = getDB();
    
    const updates = [];
    const params = [];
    
    if (firstName) {
      updates.push('first_name = ?');
      params.push(firstName);
    }
    if (lastName) {
      updates.push('last_name = ?');
      params.push(lastName);
    }
    if (phone) {
      updates.push('phone = ?');
      params.push(phone);
    }
    if (profilePicture) {
      updates.push('profile_picture = ?');
      params.push(profilePicture);
    }
    
    if (updates.length === 0) {
      return res.status(400).json({ success: false, message: 'No fields to update' });
    }
    
    params.push(req.user.id);
    
    await db.query(
      `UPDATE users SET ${updates.join(', ')} WHERE id = ?`,
      params
    );
    
    res.json({ success: true, message: 'Profile updated successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to update profile' });
  }
};

export const getUserNotifications = async (req, res) => {
  try {
    const db = getDB();
    const { page = 1, limit = 10, isRead } = req.query;
    const offset = (page - 1) * limit;
    
    let query = 'SELECT * FROM notifications WHERE user_id = ?';
    const params = [req.user.id];
    
    if (isRead !== undefined) {
      query += ' AND is_read = ?';
      params.push(isRead === 'true');
    }
    
    query += ' ORDER BY created_at DESC LIMIT ? OFFSET ?';
    params.push(parseInt(limit), offset);
    
    const [notifications] = await db.query(query, params);
    
    res.json({ success: true, notifications });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch notifications' });
  }
};

export const markNotificationAsRead = async (req, res) => {
  try {
    const { id } = req.params;
    const db = getDB();
    
    await db.query(
      'UPDATE notifications SET is_read = TRUE WHERE id = ? AND user_id = ?',
      [id, req.user.id]
    );
    
    res.json({ success: true, message: 'Notification marked as read' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to update notification' });
  }
};
