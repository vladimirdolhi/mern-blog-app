const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT || 587),
  secure: true,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

async function sendResetMail(to, link) {
  const from = process.env.SMTP_USER;
  const info = await transporter.sendMail({
    from,
    to,
    subject: "Reset your blog password",
    html: `
      <p>We received a request to reset your password.</p>
      <p>Click the link below to set a new password (valid for ${
        process.env.RESET_TOKEN_TTL_MIN || 60
      } minutes):</p>
      <p><a href="${link}">${link}</a></p>
      <p>If you didn’t request this, just ignore this email.</p>
    `,
  });
  if (process.env.NODE_ENV !== "production") {
    console.log("[mail] reset sent →", to, "messageId:", info.messageId);
  }
}

module.exports = { sendResetMail };
