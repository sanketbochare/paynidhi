// backend/src/utils/email.utils.js
import nodemailer from "nodemailer";

export const transporter = nodemailer.createTransport({
  service: "gmail",
  host: "smtp.gmail.com",
  port: 587,
  secure: false,
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_APP_PASS,
  },
});


export const sendOtpEmail = async ({ to, code }) => {
  const html = `
    <div style="font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; padding: 24px; background: #0f172a;">
      <div style="max-width: 480px; margin: 0 auto; background: #020617; border-radius: 16px; padding: 24px; border: 1px solid #1f2937;">
        <div style="display:flex; align-items:center; gap:8px; margin-bottom:16px;">
          <div style="width:28px; height:28px; border-radius:999px; background:#4f46e5; display:flex; align-items:center; justify-content:center; color:#ffffff; font-size:12px; font-weight:700;">
            PN
          </div>
          <span style="font-size:12px; color:#9ca3af;">PayNidhi Security</span>
        </div>
        <h1 style="font-size:20px; color:#e5e7eb; margin:0 0 8px;">Confirm it’s you</h1>
        <p style="font-size:13px; color:#9ca3af; margin:0 0 16px;">
          Use the one-time verification code below to continue. This code expires in 5 minutes.
        </p>
        <div style="text-align:center; margin:24px 0;">
          <div style="display:inline-flex; letter-spacing:8px; font-size:22px; font-weight:700; padding:10px 18px; border-radius:999px; background:rgba(55,65,81,0.7); color:#f9fafb; border:1px solid rgba(148,163,184,0.6);">
            ${code}
          </div>
        </div>
        <p style="font-size:11px; color:#6b7280; margin:0 0 4px;">
          Didn’t request this? You can safely ignore this email.
        </p>
        <p style="font-size:11px; color:#4b5563; margin:0;">
          © ${new Date().getFullYear()} PayNidhi · Secure access
        </p>
      </div>
    </div>
  `;

  await transporter.sendMail({
    from: `"PayNidhi Security" <${process.env.GMAIL_USER}>`,
    to,
    subject: "Your PayNidhi verification code",
    html,
  });
};
