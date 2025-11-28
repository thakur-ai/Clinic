const express = require('express');
const router = express.Router();
const Contact = require('../models/contact.model');
const { protectAdmin } = require('../middleware/adminAuthMiddleware');

// @route   GET /api/admin/contacts
// @desc    Get all contact messages (Admin only)
// @access  Private (Admin)
router.get('/', protectAdmin, async (req, res) => {
    try {
        const contacts = await Contact.find().sort({ date: -1 });
        res.json(contacts);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});

// @route   DELETE /api/admin/contacts/:id
// @desc    Delete a contact message (Admin only)
// @access  Private (Admin)
router.delete('/:id', protectAdmin, async (req, res) => {
    try {
        const contact = await Contact.findById(req.params.id);

        if (!contact) {
            return res.status(404).json({ message: 'Contact not found' });
        }

        await contact.deleteOne();
        res.json({ message: 'Contact removed' });
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router;
