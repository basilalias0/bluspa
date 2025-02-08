const nodemailer = require('nodemailer');
require('dotenv').config()

const transporter = nodemailer.createTransport({
    service: 'gmail', // e.g., 'gmail', 'sendgrid', 'mailgun'
    auth: {
      user: process.env.EMAIL_USER, // Your email address (from environment variables)
      pass: process.env.EMAIL_PASSWORD, // Your email password or app password (from environment variables)
    },
  });

  module.exports = transporter 