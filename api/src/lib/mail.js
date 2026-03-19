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
    from: process.env.EMAIL_SENDER,
    to,
    subject,
    html,
  });
  return x;
}
