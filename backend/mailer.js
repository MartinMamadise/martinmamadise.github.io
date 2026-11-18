const nodemailer = require('nodemailer');

/**
 * FIX 1: Use port 587 with STARTTLS (secure: false + requireTLS: true).
 *         Port 465 (SSL) is blocked by most ISPs and cloud providers,
 *         which causes the ETIMEDOUT error you were seeing.
 *
 * FIX 2: Transporter is created once here and exported — not rebuilt
 *         on every request inside the controller.
 */
const transporter = nodemailer.createTransport({
  host:       'smtp.gmail.com',
  port:       587,          // ← Changed from 465 to 587
  secure:     false,        // ← false = STARTTLS (upgrades after connection)
  requireTLS: true,         // ← Forces TLS upgrade; rejects if server doesn't support it
  auth: {
    user: process.env.EMAIL,
    pass: process.env.APP_PASSWORD,
  },
});

module.exports = transporter;
