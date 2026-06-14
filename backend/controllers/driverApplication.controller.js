import { getDB } from '../config/database.js';

export const submitDriverApplication = async (req, res) => {
  try {
    const db = getDB();
    const userId = req.user.id;
    const { yearsOfExperience, preferredAreas, bankName, accountNumber, accountName } = req.body;

    // Check if user already has a driver profile
    const [existingDriver] = await db.query('SELECT id FROM drivers WHERE user_id = ?', [userId]);
    if (existingDriver.length > 0) {
      return res.status(400).json({ success: false, message: 'User already has a driver profile' });
    }

    // Generate application number
    const appNumber = `DRV${Date.now()}`;

    // Get file URLs from req.files (assumes multer middleware stores this)
    const licensePhotoUrl = req.files?.license_photo?.[0]?.path || null;
    const profilePhotoUrl = req.files?.profile_photo?.[0]?.path || null;
    const medicalCertUrl = req.files?.medical_certificate?.[0]?.path || null;
    const trainingCertUrl = req.files?.training_certificate?.[0]?.path || null;

    // Create driver application
    await db.query(
      `INSERT INTO driver_applications 
       (application_number, user_id, years_of_experience, preferred_areas, bank_name, 
        account_number, account_name, license_photo_url, profile_photo_url, 
        medical_certificate_url, training_certificate_url, status, submitted_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'submitted', NOW())`,
      [appNumber, userId, yearsOfExperience, preferredAreas, bankName, accountNumber, accountName,
        licensePhotoUrl, profilePhotoUrl, medicalCertUrl, trainingCertUrl]
    );

    // Create driver profile with pending status
    const [userResult] = await db.query('SELECT email, first_name FROM users WHERE id = ?', [userId]);
    if (userResult.length === 0) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    // TODO: Send confirmation email with appNumber

    res.json({
      success: true,
      message: 'Driver application submitted successfully',
      data: {
        applicationNumber: appNumber,
        status: 'submitted',
        email: userResult[0].email
      }
    });
  } catch (error) {
    console.error('Error submitting driver application:', error);
    res.status(500).json({ success: false, message: 'Failed to submit application' });
  }
};

export const getDriverApplications = async (req, res) => {
  try {
    const db = getDB();
    const { status = 'submitted', page = 1, limit = 10 } = req.query;
    const offset = (page - 1) * limit;

    let query = `
      SELECT da.*, u.email, u.first_name, u.last_name, u.phone, u.profile_picture,
             reviewer.first_name as reviewed_by_name
      FROM driver_applications da
      JOIN users u ON da.user_id = u.id
      LEFT JOIN users reviewer ON da.reviewed_by = reviewer.id
      WHERE 1=1
    `;

    const params = [];

    if (status && status !== 'all') {
      query += ' AND da.status = ?';
      params.push(status);
    }

    query += ' ORDER BY da.submitted_at DESC LIMIT ? OFFSET ?';
    params.push(parseInt(limit), offset);

    const [applications] = await db.query(query, params);

    // Get total count
    let countQuery = 'SELECT COUNT(*) as total FROM driver_applications WHERE 1=1';
    const countParams = [];
    if (status && status !== 'all') {
      countQuery += ' AND status = ?';
      countParams.push(status);
    }

    const [countResult] = await db.query(countQuery, countParams);

    res.json({
      success: true,
      data: applications,
      pagination: {
        total: countResult[0].total,
        page: parseInt(page),
        limit: parseInt(limit),
        pages: Math.ceil(countResult[0].total / limit)
      }
    });
  } catch (error) {
    console.error('Error fetching driver applications:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch applications' });
  }
};

export const approveDriver = async (req, res) => {
  try {
    const db = getDB();
    const { applicationId } = req.params;
    const { vehicleId } = req.body;
    const reviewerId = req.user.id;

    // Get application details
    const [apps] = await db.query(
      `SELECT da.user_id, da.application_number, u.email, u.first_name 
       FROM driver_applications da
       JOIN users u ON da.user_id = u.id
       WHERE da.id = ?`,
      [applicationId]
    );

    if (apps.length === 0) {
      return res.status(404).json({ success: false, message: 'Application not found' });
    }

    const userId = apps[0].user_id;

    // Update application status
    await db.query(
      `UPDATE driver_applications SET status = 'approved', reviewed_by = ?, reviewed_at = NOW()
       WHERE id = ?`,
      [reviewerId, applicationId]
    );

    // Create driver profile if not exists
    const [existingDriver] = await db.query('SELECT id FROM drivers WHERE user_id = ?', [userId]);

    if (existingDriver.length === 0) {
      const today = new Date().toISOString().split('T')[0];
      await db.query(
        `INSERT INTO drivers (user_id, driver_license, license_expiry, status, joining_date)
         VALUES (?, ?, DATE_ADD(CURDATE(), INTERVAL 3 YEAR), 'available', ?)`,
        [userId, `LIC${Date.now()}`, today]
      );
    } else {
      await db.query('UPDATE drivers SET status = ? WHERE user_id = ?', ['available', userId]);
    }

    // Assign vehicle if provided
    if (vehicleId) {
      const [vehicle] = await db.query('SELECT id FROM vehicles WHERE id = ?', [vehicleId]);
      if (vehicle.length === 0) {
        return res.status(400).json({ success: false, message: 'Vehicle not found' });
      }

      const [driver] = await db.query('SELECT id FROM drivers WHERE user_id = ?', [userId]);

      await db.query(
        `INSERT INTO driver_vehicle_assignment (driver_id, vehicle_id, assigned_by, assigned_at, status)
         VALUES (?, ?, ?, NOW(), 'active')`,
        [driver[0].id, vehicleId, reviewerId]
      );

      await db.query('UPDATE vehicles SET current_driver_id = ? WHERE id = ?', [driver[0].id, vehicleId]);
    }

    // TODO: Send approval email

    res.json({
      success: true,
      message: 'Driver application approved successfully',
      data: { applicationNumber: apps[0].application_number }
    });
  } catch (error) {
    console.error('Error approving driver:', error);
    res.status(500).json({ success: false, message: 'Failed to approve application' });
  }
};

export const rejectDriver = async (req, res) => {
  try {
    const db = getDB();
    const { applicationId } = req.params;
    const { rejectionReason, reviewerNotes } = req.body;
    const reviewerId = req.user.id;

    // Get application details
    const [apps] = await db.query(
      `SELECT da.user_id, u.email FROM driver_applications da
       JOIN users u ON da.user_id = u.id
       WHERE da.id = ?`,
      [applicationId]
    );

    if (apps.length === 0) {
      return res.status(404).json({ success: false, message: 'Application not found' });
    }

    // Update application status
    await db.query(
      `UPDATE driver_applications SET status = 'rejected', reviewed_by = ?, reviewed_at = NOW(),
        rejection_reason = ?, reviewer_notes = ?
       WHERE id = ?`,
      [reviewerId, rejectionReason, reviewerNotes, applicationId]
    );

    // TODO: Send rejection email

    res.json({
      success: true,
      message: 'Driver application rejected'
    });
  } catch (error) {
    console.error('Error rejecting driver:', error);
    res.status(500).json({ success: false, message: 'Failed to reject application' });
  }
};

export const getDrivers = async (req, res) => {
  try {
    const db = getDB();
    const { page = 1, limit = 10 } = req.query;
    const offset = (page - 1) * limit;

    const [drivers] = await db.query(
      `SELECT d.*, u.email, u.first_name, u.last_name, u.phone,
              v.vehicle_number, v.plate_number, v.model
       FROM drivers d
       JOIN users u ON d.user_id = u.id
       LEFT JOIN vehicles v ON d.id = v.current_driver_id
       ORDER BY d.joining_date DESC
       LIMIT ? OFFSET ?`,
      [parseInt(limit), offset]
    );

    const [countResult] = await db.query('SELECT COUNT(*) as total FROM drivers');

    res.json({
      success: true,
      data: drivers,
      pagination: {
        total: countResult[0].total,
        page: parseInt(page),
        limit: parseInt(limit)
      }
    });
  } catch (error) {
    console.error('Error fetching drivers:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch drivers' });
  }
};
