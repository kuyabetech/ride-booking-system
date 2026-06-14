import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

export const sendEmail = async (to, subject, html) => {
  try {
    const info = await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to,
      subject,
      html
    });
    console.log('Email sent:', info.messageId);
    return true;
  } catch (error) {
    console.error('Email send error:', error);
    return false;
  }
};

export const sendWelcomeEmail = (email, firstName) => {
  const html = `
    <h1>Welcome to Ride Booking System!</h1>
    <p>Hi ${firstName},</p>
    <p>Your account has been created successfully.</p>
    <p>You can now login and book rides with ease.</p>
    <p>Best regards,<br>Waziri Umaru Federal Polytechnic Birnin Kebbi</p>
  `;
  return sendEmail(email, 'Welcome to Ride Booking System', html);
};

export const sendBookingConfirmationEmail = (email, bookingId, fare) => {
  const html = `
    <h2>Booking Confirmed</h2>
    <p>Your ride has been booked successfully!</p>
    <p><strong>Booking ID:</strong> ${bookingId}</p>
    <p><strong>Estimated Fare:</strong> ₦${fare.toLocaleString()}</p>
    <p>Track your ride in the app.</p>
  `;
  return sendEmail(email, 'Ride Booking Confirmation', html);
};
