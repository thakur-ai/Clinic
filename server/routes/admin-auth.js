const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const Admin = require('../models/admin.model');

// Generate JWT Token
const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: '1h',
    });
};

// @route   POST /api/admin/login
// @desc    Auth admin & get token
// @access  Public
router.post('/login', async (req, res) => {
    const { username, password } = req.body;
    console.log('Attempting admin login for username:', username);

    try {
        const admin = await Admin.findOne({ username });

        if (!admin) {
            console.log('Admin not found for username:', username);
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        console.log('Admin found:', admin.username);
        const isMatch = await admin.matchPassword(password);

        if (isMatch) {
            console.log('Password matched for admin:', admin.username);
            console.log('JWT_SECRET:', process.env.JWT_SECRET ? 'Defined' : 'Undefined');
            res.json({
                _id: admin._id,
                username: admin.username,
                token: generateToken(admin._id),
            });
        } else {
            console.log('Invalid password for admin:', admin.username);
            res.status(401).json({ message: 'Invalid credentials' });
        }
    } catch (error) {
        console.error('Server error during admin login:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// @route   POST /api/admin/register
// @desc    Register a new admin (for initial setup, can be removed later)
// @access  Public
router.post('/register', async (req, res) => {
    const { username, password } = req.body;

    try {
        const adminExists = await Admin.findOne({ username });

        if (adminExists) {
            return res.status(400).json({ message: 'Admin already exists' });
        }

        const admin = await Admin.create({
            username,
            password,
        });

        if (admin) {
            res.status(201).json({
                _id: admin._id,
                username: admin.username,
                token: generateToken(admin._id),
            });
        } else {
            res.status(400).json({ message: 'Invalid admin data' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router;
