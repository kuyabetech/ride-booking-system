import { getDB } from '../config/database.js';

export const getDriverProfile = async (req, res) => {
  try {
    const db = getDB();
    const [drivers] = await db.query(
      `SELECT d.*, u.email, u.first_name, u.last_name, u.phone 
       FROM drivers d 
       JOIN users u ON d.user_id = u.id 
       WHERE u.id = ?`,
      [req.user.id]
    );
    
    if (drivers.length === 0) {
      return res.status(404).json({ success: false, message: 'Driver not found' });
    }
    
    res.json({ success: true, driver: drivers[0] });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch driver profile' });
  }
};

export const getAssignedRides = async (req, res) => {
  try {
    const db = getDB();
    const { status = 'confirmed', page = 1, limit = 10 } = req.query;
    const offset = (page - 1) * limit;
    
    // Get driver ID
    const [drivers] = await db.query(
      'SELECT id FROM drivers WHERE user_id = ?',
      [req.user.id]
    );
    
    if (drivers.length === 0) {
      return res.status(404).json({ success: false, message: 'Driver not found' });
    }
    
    const driverId = drivers[0].id;
    
    const [bookings] = await db.query(
      `SELECT b.booking_id as id, b.*, u.first_name, u.last_name, u.phone, v.vehicle_number, v.model, v.plate_number
       FROM bookings b
       JOIN users u ON b.user_id = u.id
       LEFT JOIN vehicles v ON b.vehicle_id = v.id
       WHERE b.driver_id = ? AND b.status = ?
       ORDER BY b.scheduled_time ASC
       LIMIT ? OFFSET ?`,
      [driverId, status, parseInt(limit), offset]
    );
    
    res.json({ success: true, data: bookings });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch assigned rides' });
  }
};

export const updateDriverLocation = async (req, res) => {
  try {
    const { latitude, longitude } = req.body;
    const db = getDB();
    
    const [drivers] = await db.query(
      'SELECT id FROM drivers WHERE user_id = ?',
      [req.user.id]
    );
    
    if (drivers.length === 0) {
      return res.status(404).json({ success: false, message: 'Driver not found' });
    }
    
    await db.query(
      'UPDATE drivers SET current_latitude = ?, current_longitude = ? WHERE id = ?',
      [latitude, longitude, drivers[0].id]
    );
    
    res.json({ success: true, message: 'Location updated' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to update location' });
  }
};

export const updateRideStatus = async (req, res) => {
  try {
    const { bookingId } = req.params;
    const { status } = req.body;
    const db = getDB();
    
    const [drivers] = await db.query(
      'SELECT id FROM drivers WHERE user_id = ?',
      [req.user.id]
    );
    
    if (drivers.length === 0) {
      return res.status(404).json({ success: false, message: 'Driver not found' });
    }
    
    const [result] = await db.query(
      'UPDATE bookings SET status = ? WHERE booking_id = ? AND driver_id = ?',
      [status, bookingId, drivers[0].id]
    );
    
    if (result.affectedRows === 0) {
      return res.status(404).json({ success: false, message: 'Booking not found' });
    }
    
    res.json({ success: true, message: 'Ride status updated' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to update ride status' });
  }
};

export const updateDriverStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const validStatuses = ['online', 'offline', 'busy', 'on_break', 'available'];
    
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ success: false, message: 'Invalid status' });
    }
    
    // Map 'online' to 'available' for database compatibility
    const dbStatus = status === 'online' ? 'available' : status;
    
    const db = getDB();
    const [drivers] = await db.query(
      'SELECT id FROM drivers WHERE user_id = ?',
      [req.user.id]
    );
    
    if (drivers.length === 0) {
      return res.status(404).json({ success: false, message: 'Driver not found' });
    }
    
    await db.query(
      'UPDATE drivers SET status = ? WHERE id = ?',
      [dbStatus, drivers[0].id]
    );
    
    res.json({ success: true, message: 'Status updated successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to update status' });
  }
};
