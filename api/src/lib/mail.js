import "dotenv/config";
import nodemailer from "nodemailer";

const mailer = nodemailer.createTransport(process.env.SMTP_URI);

/**
 * @param {string} to
 * @param {string} subject
 * @param {string} html
 */
export async function sendMail(to, subject, html) {
  const x = await mailer.sendMail({
    from: process.env.EMAIL_SENDER, // ใส่ email อื่นก็ได้ แต่ต้องยืนยันโดเมนกับระบบของ brevo.com
    to,
    subject,
    html,
  });
  console.log(x);
  return x;
}
