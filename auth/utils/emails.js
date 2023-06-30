const nodemailer = require('nodemailer');
const axios = require('axios');
const express = require('express');
const emailApp = express();


emailApp.listen(3000, function(){
    console.log("Listening on port 3000");
  });

// OAuth 2.0 configuration
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.YOUR_EMAIL,
    pass: process.env.YOUR_PASSWORD
  }
});

const sendEmail = async (emailApp,email) => {
  const callbackURL = 'http://localhost:3000/confirm'; // Replace with your actual callback URL

  const mailOptions = {
    from: process.env.YOUR_EMAIL,
    to: email,
    subject: 'Subject',
    html: `<p>Click on the link to confirm your email address!</p><a href="${callbackURL}?email=${email}">Confirm</a>`,
  };

  transporter.sendMail(mailOptions, async (error, info) => {
    if (error) {
      console.log(error);
    } else {
      console.log('Email sent: ' + info.response);
    }
  });
};

// Handle the confirmation callback URL on your server
emailApp.get('/confirm', async (req, res) => {
  const email = req.query.email;
  console.log("apple");

  try {
    const response = await axios.post('http://localhost:8080/auth/confirm', { email });
    if (response.data.type === 'success') {
      console.log('Email verified');
      res.send('Email verified');
    } else {
      console.log('Email verification failed');
      res.send('Email verification failed');
    }
  } catch (error) {
    console.log(error);
    res.send('Error occurred during email verification');
  }
});

module.exports = sendEmail;
