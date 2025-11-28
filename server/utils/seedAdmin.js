const Admin = require('../models/admin.model');
const bcrypt = require('bcryptjs');

const seedAdmin = async () => {
    try {
        const adminUsername = 'ompatil';
        // For security, do not hardcode passwords.
        // The admin user should be created manually in the database or through a secure setup process.
        // If an admin user needs to be seeded, its password should be set via environment variables.
        // For now, if no admin exists, we will create one with a placeholder password that *must* be changed.
        const adminPasswordPlaceholder = 'default_secure_password_123'; 

        let admin = await Admin.findOne({ username: adminUsername });

        if (admin) {
            console.log('Admin already exists with username:', adminUsername);
            // We are not attempting to update the password via seeding here, as it's a one-time operation.
            // Password updates should be handled through a secure admin panel function.
        } else {
            // Admin does not exist, create a new one with a placeholder password
            await Admin.create({
                username: adminUsername,
                password: adminPasswordPlaceholder, // Pre-save hook will hash this
            });
            console.log('New admin created with username:', adminUsername, '. Please change the password immediately.');
        }
    } catch (error) {
        console.error('Error seeding admin user:', error);
    }
};

module.exports = seedAdmin;
