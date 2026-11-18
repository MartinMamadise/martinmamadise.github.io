const transporter       = require('../mailer');
const { buildEmailHtml } = require('../utils/email.template');

const sendMessage = async (req, res) => {
  const { name, email, subject, message } = req.body;

  // Basic server-side validation
  if (!name || !email || !message) {
    return res.status(400).json({ success: false, error: 'Missing required fields.' });
  }

  try {
    const mailOptions = {
      /**
       * FIX 3: 'from' MUST be your authenticated Gmail address.
       *        Gmail ignores (or rejects) a 'from' that differs from the
       *        logged-in account.  The sender's email goes in the body instead.
       */
      from:    `"Portfolio Contact" <${process.env.EMAIL}>`,
      to:      process.env.EMAIL,
      replyTo: email, // ← Lets you hit Reply in Gmail and it goes to the visitor
      subject: subject || `New message from ${name}`,
      text: `Name: ${name}\nEmail: ${email}\n\nMessage:\n${message}`,
      html: buildEmailHtml(name, email, message),
    };

    await transporter.sendMail(mailOptions);

    return res.status(200).json({ success: true });

  } catch (error) {
    console.error('Nodemailer error:', error.message);
    return res.status(500).json({ success: false, error: 'Failed to send email.' });
  }
};

module.exports = { sendMessage };
