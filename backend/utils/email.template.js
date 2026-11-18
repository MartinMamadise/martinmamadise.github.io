/**
 * Generates a clean HTML email body for portfolio contact messages.
 * @param {string} name
 * @param {string} email
 * @param {string} message
 * @returns {string} HTML string
 */
function buildEmailHtml(name, email, message) {
  return `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 24px; border: 1px solid #e2e2de; border-radius: 6px;">
      <h2 style="color: #1a1a18; margin-bottom: 4px;">New Portfolio Contact Message</h2>
      <p style="color: #6b6b67; font-size: 13px; margin-top: 0;">Sent via martinmamadise.com</p>
      <hr style="border: none; border-top: 1px solid #e2e2de; margin: 20px 0;">
      <table style="width: 100%; font-size: 14px; color: #1a1a18;">
        <tr>
          <td style="padding: 6px 0; font-weight: bold; width: 80px;">Name:</td>
          <td style="padding: 6px 0;">${name}</td>
        </tr>
        <tr>
          <td style="padding: 6px 0; font-weight: bold;">Email:</td>
          <td style="padding: 6px 0;"><a href="mailto:${email}" style="color: #1a5cff;">${email}</a></td>
        </tr>
      </table>
      <hr style="border: none; border-top: 1px solid #e2e2de; margin: 20px 0;">
      <p style="font-size: 14px; color: #1a1a18; font-weight: bold; margin-bottom: 8px;">Message:</p>
      <p style="font-size: 14px; color: #333; white-space: pre-wrap;">${message}</p>
    </div>
  `;
}

module.exports = { buildEmailHtml };
