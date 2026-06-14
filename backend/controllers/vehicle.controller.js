import { getDB } from '../config/database.js';

export const addVehicle = async (req, res) => {
  try {
    const db = getDB();
    const { vehicleNumber, model, make, year, capacity, plateNumber, color, insuranceExpiry, fitnessExpiry } = req.body;

    // Check for duplicate vehicle number
    const [existing] = await db.query('SELECT id FROM vehicles WHERE vehicle_number = ?', [vehicleNumber]);
    if (existing.length > 0) {
      return res.status(400).json({ success: false, message: 'Vehicle number already exists' });
    }

    // Get file URLs from req.files
    const registrationDocUrl = req.files?.registration_doc?.[0]?.path || null;
    const insuranceDocUrl = req.files?.insurance_doc?.[0]?.path || null;
    const vehiclePhotoUrl = req.files?.vehicle_photo?.[0]?.path || null;

    // Insert vehicle
    const [result] = await db.query(
      `INSERT INTO vehicles 
       (vehicle_number, model, make, year, capacity, plate_number, color, 
        insurance_expiry, fitness_expiry, status, created_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, 'active', NOW())`,
      [vehicleNumber, model, make, year, capacity, plateNumber, color, insuranceExpiry, fitnessExpiry]
    );

    res.json({
      success: true,
      message: 'Vehicle added successfully',
      data: { vehicleId: result.insertId, vehicleNumber }
    });
  } catch (error) {
    console.error('Error adding vehicle:', error);
    res.status(500).json({ success: false, message: 'Failed to add vehicle' });
  }
};

export const getVehicles = async (req, res) => {
  try {
    const db = getDB();
    const { status = 'all', page = 1, limit = 10 } = req.query;
    const offset = (page - 1) * limit;

    let query = `
      SELECT v.*, 
             CONCAT(d.id, '') as driver_id,
             CONCAT(u.first_name, ' ', u.last_name) as driver_name,
             u.phone as driver_phone
      FROM vehicles v
      LEFT JOIN drivers d ON v.current_driver_id = d.id
      LEFT JOIN users u ON d.user_id = u.id
      WHERE 1=1
    `;

    const params = [];

    if (status && status !== 'all') {
      query += ' AND v.status = ?';
      params.push(status);
    }

    query += ' ORDER BY v.created_at DESC LIMIT ? OFFSET ?';
    params.push(parseInt(limit), offset);

    const [vehicles] = await db.query(query, params);

    // Get total count
    let countQuery = 'SELECT COUNT(*) as total FROM vehicles WHERE 1=1';
    const countParams = [];
    if (status && status !== 'all') {
      countQuery += ' AND status = ?';
      countParams.push(status);
    }

    const [countResult] = await db.query(countQuery, countParams);

    res.json({
      success: true,
      data: vehicles,
      pagination: {
        total: countResult[0].total,
        page: parseInt(page),
        limit: parseInt(limit),
        pages: Math.ceil(countResult[0].total / limit)
      }
    });
  } catch (error) {
    console.error('Error fetching vehicles:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch vehicles' });
  }
};

export const assignVehicleToDriver = async (req, res) => {
  try {
    const db = getDB();
    const { driverId, vehicleId } = req.body;
    const assignedBy = req.user.id;

    // Check vehicle availability
    const [vehicle] = await db.query(
      `SELECT id, status, current_driver_id FROM vehicles WHERE id = ?`,
      [vehicleId]
    );

    if (vehicle.length === 0) {
      return res.status(404).json({ success: false, message: 'Vehicle not found' });
    }

    if (vehicle[0].status !== 'active') {
      return res.status(400).json({ success: false, message: 'Vehicle is not available' });
    }

    // Check driver eligibility
    const [driver] = await db.query(
      `SELECT d.id, d.status, u.email FROM drivers d
       JOIN users u ON d.user_id = u.id
       WHERE d.id = ?`,
      [driverId]
    );

    if (driver.length === 0) {
      return res.status(404).json({ success: false, message: 'Driver not found' });
    }

    // End any existing assignment for this vehicle
    if (vehicle[0].current_driver_id) {
      await db.query(
        `UPDATE driver_vehicle_assignment SET status = 'ended', end_reason = 'Vehicle reassigned'
         WHERE vehicle_id = ? AND status = 'active'`,
        [vehicleId]
      );
    }

    // Create new assignment
    await db.query(
      `INSERT INTO driver_vehicle_assignment (driver_id, vehicle_id, assigned_by, assigned_at, status)
       VALUES (?, ?, ?, NOW(), 'active')`,
      [driverId, vehicleId, assignedBy]
    );

    // Update vehicle
    await db.query(
      'UPDATE vehicles SET current_driver_id = ? WHERE id = ?',
      [driverId, vehicleId]
    );

    // Update driver status
    await db.query(
      'UPDATE drivers SET status = ? WHERE id = ?',
      ['available', driverId]
    );

    res.json({
      success: true,
      message: 'Vehicle assigned to driver successfully'
    });
  } catch (error) {
    console.error('Error assigning vehicle:', error);
    res.status(500).json({ success: false, message: 'Failed to assign vehicle' });
  }
};

export const updateVehicleMaintenance = async (req, res) => {
  try {
    const db = getDB();
    const { vehicleId } = req.params;
    const { maintenanceStatus, nextMaintenanceDate } = req.body;

    const [vehicle] = await db.query(
      'SELECT id, current_driver_id FROM vehicles WHERE id = ?',
      [vehicleId]
    );

    if (vehicle.length === 0) {
      return res.status(404).json({ success: false, message: 'Vehicle not found' });
    }

    // Update vehicle maintenance
    await db.query(
      `UPDATE vehicles SET status = ?, last_maintenance = NOW(), next_maintenance = ?
       WHERE id = ?`,
      [maintenanceStatus === 'maintenance' ? 'maintenance' : 'active', nextMaintenanceDate, vehicleId]
    );

    // If vehicle is in maintenance, unassign driver
    if (maintenanceStatus === 'maintenance' && vehicle[0].current_driver_id) {
      await db.query(
        `UPDATE driver_vehicle_assignment SET status = 'ended', end_reason = 'Vehicle under maintenance'
         WHERE vehicle_id = ? AND status = 'active'`,
        [vehicleId]
      );

      await db.query(
        'UPDATE vehicles SET current_driver_id = NULL WHERE id = ?',
        [vehicleId]
      );
    }

    res.json({
      success: true,
      message: 'Vehicle maintenance status updated'
    });
  } catch (error) {
    console.error('Error updating vehicle maintenance:', error);
    res.status(500).json({ success: false, message: 'Failed to update maintenance status' });
  }
};

export const getVehicleAssignmentHistory = async (req, res) => {
  try {
    const db = getDB();
    const { vehicleId } = req.params;

    const [history] = await db.query(
      `SELECT dva.*, 
              CONCAT(d.id, '') as driver_id,
              CONCAT(u.first_name, ' ', u.last_name) as driver_name,
              CONCAT(admin.first_name, ' ', admin.last_name) as assigned_by_name
       FROM driver_vehicle_assignment dva
       JOIN drivers d ON dva.driver_id = d.id
       JOIN users u ON d.user_id = u.id
       JOIN users admin ON dva.assigned_by = admin.id
       WHERE dva.vehicle_id = ?
       ORDER BY dva.assigned_at DESC`,
      [vehicleId]
    );

    res.json({
      success: true,
      data: history
    });
  } catch (error) {
    console.error('Error fetching assignment history:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch history' });
  }
};
