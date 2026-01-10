const Admin = require('../models/admin.model');
const bcrypt = require('bcryptjs');

const seedAdmin = async () => {
    try {
        const adminUsername = 'admin';
        const adminPassword = 'securepassword123'; // The raw password to be hashed

        let admin = await Admin.findOne({ username: adminUsername });

        if (admin) {
            // Admin exists, check if password needs update
            const isMatch = await bcrypt.compare(adminPassword, admin.password);
            if (!isMatch) {
                admin.password = adminPassword; // Pre-save hook will hash this
                await admin.save();
                console.log('Admin password updated successfully.');
            } else {
                console.log('Admin already exists with the correct password.');
            }
        } else {
            // Admin does not exist, create a new one
            await Admin.create({
                username: adminUsername,
                password: adminPassword, // Pre-save hook will hash this
            });
            console.log('Admin created successfully.');
        }
    } catch (error) {
        console.error('Error seeding admin user:', error);
    }
};

module.exports = seedAdmin;
