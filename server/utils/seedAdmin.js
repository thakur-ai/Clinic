const Admin = require('../models/admin.model');
const bcrypt = require('bcryptjs');

const seedAdmin = async () => {
    try {
        const adminUsername = 'ompatil';
        const adminPassword = '3107'; // The raw password to be hashed

        let admin = await Admin.findOne({ username: adminUsername });

        if (admin) {
            // Check if password needs to be updated. Hash the provided password to compare.
            // Note: This is a simplification. In a real app, you might not re-hash and compare directly like this
            // but rely on `matchPassword` after fetching. For seeding, we'll directly update if necessary.
            const isMatch = await bcrypt.compare(adminPassword, admin.password);
            if (!isMatch) {
                // Password needs to be updated
                admin.password = adminPassword; // The pre-save hook will hash this
                await admin.save();
                console.log('Admin password updated successfully.');
            } else {
                console.log('Admin already exists with the correct password.');
            }
        } else {
            // Admin does not exist, create a new one
            admin = await Admin.create({
                username: adminUsername,
                password: adminPassword, // The pre-save hook in the model will hash this
            });
            console.log('Admin created successfully.');
        }
    } catch (error) {
        console.error('Error seeding admin user:', error);
    }
};

module.exports = seedAdmin;
