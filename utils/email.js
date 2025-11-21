const nodemailer = require("nodemailer");

exports.sendEmail = async (to, subject, text, html = null) => {
  try {
    const transporter = nodemailer.createTransport({
      host: process.env.EMAIL_HOST,     // smtp.gmai
      port: process.env.EMAIL_PORT,     // 587 
      secure: false,
      auth: {
        user: process.env.EMAIL_USER,   // your email
        pass: process.env.EMAIL_PASS,  
      },
    });

    const mailOptions = {
      from: `"Flight Booking" <${process.env.EMAIL_USER}>`,
      to,
      subject,
      text,
      html: html || undefined,  // If HTML provided, use it
    };

    await transporter.sendMail(mailOptions);

    console.log(`📩 Email sent to ${to}`);
    return true;
  } catch (err) {
    console.error(" Email sending failed:", err.message);
    throw new Error("Failed to send email");
  }
};
