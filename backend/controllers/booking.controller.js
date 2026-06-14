import { getDB } from '../config/database.js';
import { io } from '../server.js';
import { calculateTotalFare } from '../utils/fare.js';

export const createBooking = async (req, res) => {
  try {
    const {
      pickupLocation,
      pickupLat,
      pickupLng,
      dropoffLocation,
      dropoffLat,
      dropoffLng,
      scheduledTime,
      distance,
      duration
    } = req.body;
    
    const db = getDB();
    const fare = calculateTotalFare(distance);
    const bookingId = `BK${Date.now()}${Math.floor(Math.random() * 1000)}`;
    
    // Check for conflicts
    const [conflicts] = await db.query(
      `SELECT COUNT(*) as count FROM bookings 
       WHERE scheduled_time BETWEEN DATE_SUB(?, INTERVAL 1 HOUR) 
       AND DATE_ADD(?, INTERVAL 1 HOUR) 
       AND status NOT IN ('cancelled', 'completed')`,
      [scheduledTime, scheduledTime]
    );
    
    if (conflicts[0].count > 5) {
      return res.status(400).json({ 
        success: false, 
        message: 'Time slot unavailable. Please choose another time.' 
      });
    }
    
    // Create booking
    const [result] = await db.query(
      `INSERT INTO bookings (booking_id, user_id, pickup_location, pickup_latitude, 
        pickup_longitude, dropoff_location, dropoff_latitude, dropoff_longitude, 
        scheduled_time, distance_km, duration_minutes, fare_amount, status) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'pending')`,
      [bookingId, req.user.id, pickupLocation, pickupLat, pickupLng, 
       dropoffLocation, dropoffLat, dropoffLng, scheduledTime, distance, duration, fare]
    );
    
    // Find available driver
    const [drivers] = await db.query(
      `SELECT d.*, u.first_name, u.last_name, u.phone 
       FROM drivers d 
       JOIN users u ON d.user_id = u.id 
       WHERE d.status = 'available' 
       ORDER BY d.rating DESC LIMIT 1`
    );
    
    let driverId = null;
    if (drivers.length > 0) {
      driverId = drivers[0].id;
      await db.query(
        'UPDATE bookings SET driver_id = ?, vehicle_id = 1, status = ? WHERE id = ?',
        ['confirmed', result.insertId]
      );
      await db.query('UPDATE drivers SET status = "busy" WHERE id = ?', [driverId]);
      
      // Notify driver
      io.to(`driver-${driverId}`).emit('new-booking', {
        bookingId,
        pickup: pickupLocation,
        dropoff: dropoffLocation,
        fare
      });
    }
    
    // Create notification for user
    await db.query(
      `INSERT INTO notifications (user_id, title, message, type) 
       VALUES (?, ?, ?, 'booking')`,
      [req.user.id, 'Booking Confirmed', 
       `Your ride has been booked successfully. Booking ID: ${bookingId}`]
    );
    
    res.status(201).json({
      success: true,
      message: 'Booking created successfully',
      bookingId,
      fare,
      driver: driverId ? drivers[0] : null
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Failed to create booking' });
  }
};

export const getBookings = async (req, res) => {
  try {
    const db = getDB();
    const { status, page = 1, limit = 10 } = req.query;
    const offset = (page - 1) * limit;
    
    let query = `
      SELECT b.*, 
             u.first_name, u.last_name, u.phone,
             d.first_name as driver_first_name, d.last_name as driver_last_name,
             v.vehicle_number, v.model, v.plate_number
      FROM bookings b
      JOIN users u ON b.user_id = u.id
      LEFT JOIN drivers dr ON b.driver_id = dr.id
      LEFT JOIN users d ON dr.user_id = d.id
      LEFT JOIN vehicles v ON b.vehicle_id = v.id
      WHERE b.user_id = ?
    `;
    
    const params = [req.user.id];
    
    if (status) {
      query += ' AND b.status = ?';
      params.push(status);
    }
    
    query += ' ORDER BY b.scheduled_time DESC LIMIT ? OFFSET ?';
    params.push(parseInt(limit), offset);
    
    const [bookings] = await db.query(query, params);
    
    const [total] = await db.query(
      'SELECT COUNT(*) as total FROM bookings WHERE user_id = ?',
      [req.user.id]
    );
    
    res.json({
      success: true,
      bookings,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total: total[0].total,
        pages: Math.ceil(total[0].total / limit)
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Failed to fetch bookings' });
  }
};

export const getBookingById = async (req, res) => {
  try {
    const { id } = req.params;
    const db = getDB();
    
    const [bookings] = await db.query(
      `SELECT b.*, 
              u.first_name, u.last_name,
              d.first_name as driver_first_name, d.last_name as driver_last_name, d.phone as driver_phone,
              v.vehicle_number, v.model, v.plate_number
       FROM bookings b
       JOIN users u ON b.user_id = u.id
       LEFT JOIN drivers dr ON b.driver_id = dr.id
       LEFT JOIN users d ON dr.user_id = d.id
       LEFT JOIN vehicles v ON b.vehicle_id = v.id
       WHERE b.booking_id = ? AND b.user_id = ?`,
      [id, req.user.id]
    );
    
    if (bookings.length === 0) {
      return res.status(404).json({ success: false, message: 'Booking not found' });
    }
    
    res.json({ success: true, booking: bookings[0] });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch booking' });
  }
};

export const cancelBooking = async (req, res) => {
  try {
    const { id } = req.params;
    const { reason } = req.body;
    const db = getDB();
    
    const [booking] = await db.query(
      'SELECT * FROM bookings WHERE booking_id = ? AND user_id = ?',
      [id, req.user.id]
    );
    
    if (booking.length === 0) {
      return res.status(404).json({ success: false, message: 'Booking not found' });
    }
    
    if (booking[0].status !== 'pending' && booking[0].status !== 'confirmed') {
      return res.status(400).json({ success: false, message: 'Cannot cancel this booking' });
    }
    
    await db.query(
      `UPDATE bookings SET status = 'cancelled', cancellation_reason = ? 
       WHERE booking_id = ?`,
      [reason, id]
    );
    
    // Free up driver if assigned
    if (booking[0].driver_id) {
      await db.query('UPDATE drivers SET status = "available" WHERE id = ?', 
        [booking[0].driver_id]);
    }
    
    res.json({ success: true, message: 'Booking cancelled successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Failed to cancel booking' });
  }
};

export const updateBookingStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    const db = getDB();
    
    const validStatuses = ['pending', 'confirmed', 'in_progress', 'completed', 'cancelled', 'no_show'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ success: false, message: 'Invalid status' });
    }
    
    const [result] = await db.query(
      'UPDATE bookings SET status = ? WHERE booking_id = ?',
      [status, id]
    );
    
    if (result.affectedRows === 0) {
      return res.status(404).json({ success: false, message: 'Booking not found' });
    }
    
    res.json({ success: true, message: 'Status updated successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to update booking' });
  }
};
