import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './HomePage.jsx';
import AdminDashboard from './admin/AdminDashboard.jsx';
import AboutPage from './AboutPage.jsx';
import ContactPage from './ContactPage.jsx';
import AppointmentPage from './AppointmentPage.jsx';
import UserReportPage from './UserReportPage.jsx';
import AdminReportPage from './admin/AdminReportPage.jsx';
import AdminContactsPage from './admin/AdminContactsPage.jsx'; // Import AdminContactsPage
import AdminLoginPage from './admin/AdminLoginPage.jsx';
import AdminPrivateRoute from './admin/components/AdminPrivateRoute.jsx';
import OfflineAppointmentBookingPage from './admin/OfflineAppointmentBookingPage.jsx'; // Import the new component
import Navbar from './Navbar.jsx';
import Footer from './components/Footer.jsx'; // Import the Footer component

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-100 flex flex-col"> {/* Added flex flex-col for proper footer positioning */}
        <Navbar />

        <main className="flex-grow container mx-auto p-4 pt-16"> {/* Added flex-grow */}
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/contact" element={<ContactPage />} />
            <Route path="/appointment" element={<AppointmentPage />} />
            <Route path="/reports/:reportId?" element={<UserReportPage />} />
            <Route path="/admin/login" element={<AdminLoginPage />} />
            <Route element={<AdminPrivateRoute />}>
                <Route path="/admin" element={<AdminDashboard />} />
                <Route path="/admin/reports/:reportId?" element={<AdminReportPage />} />
                <Route path="/admin/contacts" element={<AdminContactsPage />} />
                <Route path="/admin/offline-appointment" element={<OfflineAppointmentBookingPage />} /> {/* New route for offline booking */}
            </Route>
          </Routes>
        </main>
        <Footer /> {/* Render the Footer component */}
      </div>
    </Router>
  );
}

export default App;
