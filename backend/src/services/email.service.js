import nodemailer from 'nodemailer';

export const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

export async function sendVerificationEmail(email, code, subject = 'Verification code') {
  // tu código actual de nodemailer
  const mailOptions = {
    from: `"RentDirect" <${process.env.EMAIL_USER}>`,
    to: email,
    subject,
    text: `Tu codigo de verificacion es: ${code}`
  };
  await transporter.sendMail(mailOptions);
}

export async function sendInvoiceEmail(to, subject, text, filePath) {
  const mailOptions = {
    from: `"RentDirect" <${process.env.EMAIL_USER}>`,
    to,
    subject,
    text,
    attachments: [
      {
        filename: "factura.pdf",
        path: filePath,
      },
    ],
  };

  await transporter.sendMail(mailOptions);
}