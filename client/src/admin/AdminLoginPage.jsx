import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { motion } from "framer-motion";
import { User, Lock, AlertCircle } from "lucide-react";

const AdminLoginPage = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const submitHandler = async (e) => {
    e.preventDefault();
    setError("");
    //op
    try {
      const { data } = await axios.post(
        `${process.env.REACT_APP_API_BASE_URL}/api/admin/login`,
        { username, password }
      );
      localStorage.setItem("adminToken", data.token);
      navigate("/admin");
    } catch (err) {
      setError(err.response?.data?.message || "Invalid username or password");
    }
  };

  return (
    <div className="relative flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-100 to-indigo-200 px-4">

      {/* Floating background shapes */}
      <motion.div
        className="absolute top-20 left-10 w-28 h-28 bg-blue-300 rounded-full opacity-40 blur-2xl"
        animate={{ y: [0, 30, 0] }}
        transition={{ repeat: Infinity, duration: 6 }}
      />
      <motion.div
        className="absolute bottom-20 right-10 w-36 h-36 bg-indigo-400 rounded-full opacity-30 blur-3xl"
        animate={{ y: [0, -25, 0] }}
        transition={{ repeat: Infinity, duration: 7 }}
      />

      {/* Login Card */}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-md bg-white/60 backdrop-blur-xl shadow-xl border border-white/50 rounded-2xl p-6 sm:p-8"
      >
        <h3 className="text-2xl sm:text-3xl font-extrabold text-center text-gray-800">
          Admin Login
        </h3>
        <p className="text-sm sm:text-base text-center text-gray-600 mt-1">Secure access panel</p>

        {/* Error Alert */}
        {error && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex items-center gap-2 bg-red-100 border border-red-400 text-red-700 px-3 py-2 rounded-md mt-4"
          >
            <AlertCircle size={18} />
            <span className="text-sm">{error}</span>
          </motion.div>
        )}

        <form onSubmit={submitHandler} className="mt-6 space-y-5">

          {/* Username Field */}
          <div>
            <label className="text-sm font-medium text-gray-700 block mb-1">
              Username
            </label>
            <div className="relative">
              <User className="absolute left-3 top-3 text-gray-500" size={18} />
              <input
                type="text"
                placeholder="Enter admin username"
                className="w-full pl-10 px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-blue-600 outline-none transition"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            </div>
          </div>

          {/* Password Field */}
          <div>
            <label className="text-sm font-medium text-gray-700 block mb-1">
              Password
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-3 text-gray-500" size={18} />
              <input
                type="password"
                placeholder="Enter password"
                className="w-full pl-10 px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-blue-600 outline-none transition"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
          </div>

          {/* Submit Button */}
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            className="w-full bg-blue-600 text-white py-3 rounded-xl font-semibold text-base sm:text-lg shadow-md hover:bg-blue-700 transition"
            type="submit"
          >
            Login to Dashboard
          </motion.button>

          {/* Footer */}
          <p className="text-xs sm:text-sm text-center text-gray-500">
            © 2025 Clinic Admin Panel | All Rights Reserved
          </p>
        </form>
      </motion.div>
    </div>
  );
};

export default AdminLoginPage;
