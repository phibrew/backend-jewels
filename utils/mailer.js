import nodemailer from 'nodemailer';

export async function createTransporter() {
  const transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  await transporter.verify(); // optional but helps debug
  return transporter;
}
