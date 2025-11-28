const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path'); // Import path module
require('dotenv').config();

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads'))); // Serve static files from the 'uploads' directory

app.use((req, res, next) => {
  console.log('Incoming request URL:', req.originalUrl);
  next();
});

const uri = process.env.MONGODB_URI;
const seedAdmin = require('./utils/seedAdmin'); // Import the seedAdmin function

mongoose.connect(uri)
  .then(() => {
    console.log('MongoDB database connection established successfully');
    seedAdmin(); // Call the seedAdmin function after successful connection
  })
  .catch(err => console.error('MongoDB connection error:', err));

const contactRouter = require('./routes/contact');
const appointmentRouter = require('./routes/appointment');
const { router: adminAppointmentRouter } = require('./routes/admin-appointment'); // Import admin appointment routes using named export
const { auth } = require('./middleware/auth'); // Import auth middleware using named export
const { protectAdmin } = require('./middleware/adminAuthMiddleware'); // Import admin auth middleware
const adminAuthRoutes = require('./routes/admin-auth'); // Import admin auth routes

app.use('/api/contacts', contactRouter);
app.use('/api/appointments', appointmentRouter);
app.use('/api/admin', adminAuthRoutes); // Admin authentication routes (login/register)

// All routes below this line will be protected by adminAuthMiddleware
app.use('/api/admin/appointments', protectAdmin, adminAppointmentRouter);
app.use('/api/admin/contacts', protectAdmin, require('./routes/admin-contact')); // Admin contact routes
app.use('/api/admin', protectAdmin, require('./routes/admin-misc')); // Admin misc routes (doctors, services, etc.)


app.get('/', (req, res) => {
  res.send('Hello from the server!');
});

app.listen(port, () => {
  console.log(`Server is running on port: ${port}`);
});
