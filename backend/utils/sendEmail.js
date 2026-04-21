const nodemailer = require("nodemailer");

const sendEmail = async (to, subject, html) => {
  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const mailOptions = {
      from: `"Blood Status System" <${process.env.EMAIL_USER}>`,
      to: to, // <-- yaha user ka email jayega
      subject,
      html,   // <-- अब plain text nahi, proper HTML mail bhejenge
    };

    const info = await transporter.sendMail(mailOptions);
    console.log("Email sent successfully:", info.response);
  } catch (error) {
    console.error("Email send error:", error);
    throw error;
  }
};

module.exports = sendEmail;