const nodemailer = require('nodemailer');

const sendEmail = async (options) => {
  // 1. Create a transporter using credentials from .env file
  const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  // 2. Define email options
  const mailOptions = {
    from: '"Student Success Hub" <noreply@sih.com>',
    to: options.email,
    subject: options.subject,
    html: options.html,
  };

  // 3. Send the email
  const info = await transporter.sendMail(mailOptions);

  console.log('Message sent successfully to Ethereal!');
  // This URL lets you preview the sent email
  console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
};

module.exports = sendEmail;