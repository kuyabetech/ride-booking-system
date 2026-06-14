import { getDB } from '../config/database.js';

export const getAdminDashboard = async (req, res) => {
  try {
    const db = getDB();
    
    // Total users
    const [userCount] = await db.query('SELECT COUNT(*) as count FROM users WHERE role = "user"');
    
    // Total drivers
    const [driverCount] = await db.query('SELECT COUNT(*) as count FROM drivers');
    
    // Total vehicles
    const [vehicleCount] = await db.query('SELECT COUNT(*) as count FROM vehicles');
    
    // Completed bookings today
    const [todayBookings] = await db.query(
      `SELECT COUNT(*) as count FROM bookings WHERE DATE(created_at) = CURDATE() AND status = 'completed'`
    );
    
    // Revenue today
    const [todayRevenue] = await db.query(
      `SELECT SUM(fare_amount) as total FROM bookings WHERE DATE(created_at) = CURDATE() AND status = 'completed'`
    );
    
    res.json({
      success: true,
      dashboard: {
        totalUsers: userCount[0].count,
        totalDrivers: driverCount[0].count,
        totalVehicles: vehicleCount[0].count,
        bookingsToday: todayBookings[0].count,
        revenueToday: todayRevenue[0].total || 0
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch dashboard' });
  }
};

export const getAllUsers = async (req, res) => {
  try {
    const db = getDB();
    const { page = 1, limit = 10, search } = req.query;
    const offset = (page - 1) * limit;
    
    let query = 'SELECT id, user_id, email, first_name, last_name, phone, role, is_active, created_at FROM users';
    const params = [];
    
    if (search) {
      query += ' WHERE CONCAT(first_name, last_name, email) LIKE ?';
      params.push(`%${search}%`);
    }
    
    query += ' LIMIT ? OFFSET ?';
    params.push(parseInt(limit), offset);
    
    const [users] = await db.query(query, params);
    
    res.json({ success: true, data: users });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch users' });
  }
};

export const getAllDrivers = async (req, res) => {
  try {
    const db = getDB();
    const { page = 1, limit = 10, search } = req.query;
    const offset = (page - 1) * limit;
    
    let query = `SELECT d.id, u.user_id, u.email, u.first_name, u.last_name, u.phone, 
                        d.driver_license, d.license_expiry, d.rating, d.total_trips, 
                        d.status as driver_status, d.joining_date
                 FROM drivers d
                 JOIN users u ON d.user_id = u.id`;
    const params = [];
    
    if (search) {
      query += ' WHERE CONCAT(u.first_name, u.last_name, u.email) LIKE ?';
      params.push(`%${search}%`);
    }
    
    query += ' LIMIT ? OFFSET ?';
    params.push(parseInt(limit), offset);
    
    const [drivers] = await db.query(query, params);
    
    res.json({ success: true, data: drivers });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch drivers' });
  }
};

export const getAllVehicles = async (req, res) => {
  try {
    const db = getDB();
    const { page = 1, limit = 10, search } = req.query;
    const offset = (page - 1) * limit;
    
    let query = 'SELECT id, vehicle_number, model, make, year, capacity, plate_number, color, insurance_expiry, fitness_expiry, status, current_driver_id FROM vehicles';
    const params = [];
    
    if (search) {
      query += ' WHERE CONCAT(plate_number, model, make) LIKE ?';
      params.push(`%${search}%`);
    }
    
    query += ' LIMIT ? OFFSET ?';
    params.push(parseInt(limit), offset);
    
    const [vehicles] = await db.query(query, params);
    
    res.json({ success: true, data: vehicles });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch vehicles' });
  }
};

export const getAllBookings = async (req, res) => {
  try {
    const db = getDB();
    const { page = 1, limit = 10, status } = req.query;
    const offset = (page - 1) * limit;
    
    let query = `SELECT b.*, u.first_name, u.last_name, d.first_name as driver_name
                 FROM bookings b 
                 JOIN users u ON b.user_id = u.id 
                 LEFT JOIN drivers dr ON b.driver_id = dr.id
                 LEFT JOIN users d ON dr.user_id = d.id`;
    const params = [];
    
    if (status) {
      query += ' WHERE b.status = ?';
      params.push(status);
    }
    
    query += ' ORDER BY b.created_at DESC LIMIT ? OFFSET ?';
    params.push(parseInt(limit), offset);
    
    const [bookings] = await db.query(query, params);
    
    res.json({ success: true, data: bookings });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch bookings' });
  }
};

export const deactivateUser = async (req, res) => {
  try {
    const { userId } = req.params;
    const db = getDB();
    
    await db.query('UPDATE users SET is_active = FALSE WHERE id = ?', [userId]);
    
    res.json({ success: true, message: 'User deactivated' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to deactivate user' });
  }
};

export const getReports = async (req, res) => {
  try {
    const db = getDB();
    const { period = 'month' } = req.query;
    
    let dateFilter = 'MONTH(created_at) = MONTH(NOW()) AND YEAR(created_at) = YEAR(NOW())';
    if (period === 'week') {
      dateFilter = 'WEEK(created_at) = WEEK(NOW())';
    } else if (period === 'day') {
      dateFilter = 'DATE(created_at) = CURDATE()';
    }
    
    const [bookingStats] = await db.query(`
      SELECT 
        COUNT(*) as total_bookings,
        SUM(CASE WHEN status = 'completed' THEN 1 ELSE 0 END) as completed,
        SUM(CASE WHEN status = 'cancelled' THEN 1 ELSE 0 END) as cancelled,
        SUM(CASE WHEN status = 'no_show' THEN 1 ELSE 0 END) as no_show,
        SUM(fare_amount) as total_revenue
      FROM bookings
      WHERE ${dateFilter}
    `);
    
    res.json({ success: true, reports: bookingStats[0] });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch reports' });
  }
};

export const deleteUser = async (req, res) => {
  try {
    const { userId } = req.params;
    const db = getDB();
    
    await db.query('DELETE FROM users WHERE id = ?', [userId]);
    
    res.json({ success: true, message: 'User deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to delete user' });
  }
};

export const deleteDriver = async (req, res) => {
  try {
    const { driverId } = req.params;
    const db = getDB();
    
    // Get user_id from driver
    const [driver] = await db.query('SELECT user_id FROM drivers WHERE id = ?', [driverId]);
    if (driver.length === 0) {
      return res.status(404).json({ success: false, message: 'Driver not found' });
    }
    
    // Delete driver and user
    await db.query('DELETE FROM drivers WHERE id = ?', [driverId]);
    await db.query('DELETE FROM users WHERE id = ?', [driver[0].user_id]);
    
    res.json({ success: true, message: 'Driver deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to delete driver' });
  }
};

export const deleteVehicle = async (req, res) => {
  try {
    const { vehicleId } = req.params;
    const db = getDB();
    
    await db.query('DELETE FROM vehicles WHERE id = ?', [vehicleId]);
    
    res.json({ success: true, message: 'Vehicle deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to delete vehicle' });
  }
};

export const cancelBooking = async (req, res) => {
  try {
    const { bookingId } = req.params;
    const db = getDB();
    
    await db.query('UPDATE bookings SET status = ? WHERE id = ?', ['cancelled', bookingId]);
    
    res.json({ success: true, message: 'Booking cancelled successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to cancel booking' });
  }
};
