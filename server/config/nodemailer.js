import { createTransport } from "nodemailer";

const sendEmail = async ({ email, subject, html }) => {
  const transport = createTransport({
    host: "smtp.gmail.com",
    port: 465,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });

  try {
    transport.sendMail({
      from: process.env.SMTP_USER,
      to: email,
      subject,
      html,
    });
  } catch (error) {
    console.log("Nodemailer transporter error", error);
  }
};

export default sendEmail;
