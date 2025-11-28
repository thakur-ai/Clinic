const router = require('express').Router();
const axios = require('axios');
let Contact = require('../models/contact.model');

router.route('/').get((req, res) => {
  console.log('Request received for /contacts');
  Contact.find()
    .then(contacts => res.json(contacts))
    .catch(err => res.status(400).json('Error: ' + err));
});

router.route('/').post(async (req, res) => {
  const { name, email, phone, inquiryType, message, recaptchaToken } = req.body;
  console.log('Incoming contact form data:', req.body); // Log incoming data

  if (!recaptchaToken) {
    console.log('Error: reCAPTCHA token is missing');
    return res.status(400).json('Error: reCAPTCHA token is missing');
  }

  try {
    const secretKey = process.env.VITE_RECAPTCHA_SECRET_KEY;
    if (!secretKey) {
        console.error('VITE_RECAPTCHA_SECRET_KEY is not defined in server environment.');
        return res.status(500).json('Error: reCAPTCHA secret key missing on server');
    }
    console.log('reCAPTCHA Secret Key (first 5 chars):', secretKey ? secretKey.substring(0, 5) + '...' : 'undefined'); // Log only part of the key for security
    const verificationURL = `https://www.google.com/recaptcha/api/siteverify?secret=${secretKey}&response=${recaptchaToken}`;
    console.log('reCAPTCHA Verification URL:', verificationURL);

    const response = await axios.post(verificationURL);
    const { success } = response.data;

    if (!success) {
      console.log('reCAPTCHA verification failed for token:', recaptchaToken);
      return res.status(400).json('Error: reCAPTCHA verification failed');
    }
    console.log('reCAPTCHA verification successful.');

  } catch (error) {
    console.error('reCAPTCHA verification error:', error);
    return res.status(500).json('Error: reCAPTCHA server error');
  }

  const newContact = new Contact({
    name,
    email,
    phone,
    inquiryType,
    message,
  });

  newContact.save()
    .then(() => {
      console.log('Contact added successfully!');
      res.json('Contact added!');
    })
    .catch(err => {
      console.error('Error saving contact to database:', err); // Log the full error
      res.status(400).json('Error: ' + err.message || 'Unknown database error');
    });
});

module.exports = router;
