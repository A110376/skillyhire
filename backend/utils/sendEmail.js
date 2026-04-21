import nodeMailer from "nodemailer";

export const sendEmail = async ({ email, subject, message }) => {
  const transporter = nodeMailer.createTransport({
    host: process.env.SMTP_HOST,
    service: process.env.SMTP_SERVICE,
    port: Number(process.env.SMTP_PORT),
    secure: false, // Consider making this conditional based on port
    auth: {
      user: process.env.SMTP_MAIL,
      pass: process.env.SMTP_PASSWORD,
    },
  });

  const options = {
    from: `"SkillyHire" <${process.env.SMTP_MAIL}>`,
    to: email,
    subject: subject,
    text: message,
  };

  // ✅ FIX: sendMail (not sendEmail)
  await transporter.sendMail(options);
};
