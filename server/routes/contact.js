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

  if (!recaptchaToken) {
    return res.status(400).json('Error: reCAPTCHA token is missing');
  }

  try {
    const secretKey = process.env.VITE_RECAPTCHA_SECRET_KEY;
    const verificationURL = `https://www.google.com/recaptcha/api/siteverify?secret=${secretKey}&response=${recaptchaToken}`;

    const response = await axios.post(verificationURL);
    const { success } = response.data;

    if (!success) {
      return res.status(400).json('Error: reCAPTCHA verification failed');
    }
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
    .then(() => res.json('Contact added!'))
    .catch(err => res.status(400).json('Error: ' + err));
});

module.exports = router;
