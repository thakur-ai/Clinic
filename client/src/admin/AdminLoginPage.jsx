import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { motion } from "framer-motion";
import { User, Lock, AlertCircle, ArrowRight, ShieldCheck } from "lucide-react";

const AdminLoginPage = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const submitHandler = async (e) => {
    e.preventDefault();
    setError("");
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

  // Animation Variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { duration: 0.8, staggerChildren: 0.1 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: {
      opacity: 1,
      x: 0,
      transition: { type: "spring", stiffness: 100 },
    },
  };

  return (
    <div className="flex min-h-screen w-full bg-white overflow-hidden">
      {/* --------------------------
        LEFT SIDE: Visual / Brand (Hidden on Mobile, Visible on Desktop) 
        --------------------------
      */}
      <motion.div
        initial={{ x: -100, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="hidden lg:flex w-1/2 bg-slate-900 relative items-center justify-center overflow-hidden"
      >
        {/* Abstract Background Elements */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-900 via-indigo-900 to-slate-900 z-0" />
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 25, ease: "linear" }}
          className="absolute -top-24 -left-24 w-96 h-96 bg-blue-600 rounded-full mix-blend-multiply filter blur-3xl opacity-20"
        />
        <motion.div
          animate={{ rotate: -360 }}
          transition={{ repeat: Infinity, duration: 30, ease: "linear" }}
          className="absolute -bottom-24 -right-24 w-96 h-96 bg-indigo-600 rounded-full mix-blend-multiply filter blur-3xl opacity-20"
        />

        {/* Brand Content */}
        <div className="relative z-10 text-center px-12">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="mb-6 inline-flex p-4 rounded-2xl bg-white/10 backdrop-blur-sm border border-white/10"
          >
            <ShieldCheck className="text-blue-400 w-12 h-12" />
          </motion.div>
          <h2 className="text-4xl font-bold text-white mb-4 tracking-tight">
            Admin Portal
          </h2>
          <p className="text-slate-300 text-lg leading-relaxed max-w-md mx-auto">
            Manage your clinic's data, appointments, and doctors securely from
            one central hub.
          </p>
        </div>
      </motion.div>

      {/* --------------------------
        RIGHT SIDE: Login Form (Full width mobile, Half width desktop)
        --------------------------
      */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-12 lg:p-24 bg-gray-50 lg:bg-white relative">
        {/* Mobile-only background blobs */}
        <div className="lg:hidden absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
          <div className="absolute top-[-10%] right-[-10%] w-64 h-64 bg-blue-200 rounded-full blur-3xl opacity-30" />
          <div className="absolute bottom-[-10%] left-[-10%] w-64 h-64 bg-indigo-200 rounded-full blur-3xl opacity-30" />
        </div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="w-full max-w-md bg-white lg:bg-transparent p-8 rounded-3xl shadow-xl lg:shadow-none border border-gray-100 lg:border-none relative z-10"
        >
          {/* Header */}
          <motion.div variants={itemVariants} className="mb-10">
            <h3 className="text-3xl font-extrabold text-slate-900 tracking-tight">
              Welcome back
            </h3>
            <p className="text-slate-500 mt-2 text-sm">
              Please enter your details to sign in.
            </p>
          </motion.div>

          {/* Error Message */}
          {error && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              className="mb-6 overflow-hidden"
            >
              <div className="flex items-center gap-3 bg-red-50 border-l-4 border-red-500 text-red-700 p-4 rounded-r-md">
                <AlertCircle size={20} className="shrink-0" />
                <span className="text-sm font-medium">{error}</span>
              </div>
            </motion.div>
          )}

          <form onSubmit={submitHandler} className="space-y-6">
            {/* Username */}
            <motion.div variants={itemVariants}>
              <label className="block text-sm font-semibold text-slate-700 mb-2 ml-1">
                Username
              </label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <User className="h-5 w-5 text-gray-400 group-focus-within:text-blue-600 transition-colors" />
                </div>
                <input
                  type="text"
                  placeholder="Enter your username"
                  className="block w-full pl-11 pr-4 py-3.5 bg-gray-50 border border-gray-200 rounded-xl text-slate-900 placeholder-gray-400 focus:outline-none focus:bg-white focus:ring-2 focus:ring-blue-100 focus:border-blue-600 transition-all duration-200"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                />
              </div>
            </motion.div>

            {/* Password */}
            <motion.div variants={itemVariants}>
              <div className="flex justify-between items-center mb-2 ml-1">
                <label className="block text-sm font-semibold text-slate-700">
                  Password
                </label>
                <a
                  href="#"
                  className="text-xs font-medium text-blue-600 hover:text-blue-800 hover:underline"
                >
                  Forgot password?
                </a>
              </div>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-400 group-focus-within:text-blue-600 transition-colors" />
                </div>
                <input
                  type="password"
                  placeholder="••••••••"
                  className="block w-full pl-11 pr-4 py-3.5 bg-gray-50 border border-gray-200 rounded-xl text-slate-900 placeholder-gray-400 focus:outline-none focus:bg-white focus:ring-2 focus:ring-blue-100 focus:border-blue-600 transition-all duration-200"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
            </motion.div>

            {/* Button */}
            <motion.div variants={itemVariants} className="pt-2">
              <motion.button
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.98 }}
                className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold py-4 rounded-xl shadow-lg shadow-blue-500/30 transition-all duration-200"
                type="submit"
              >
                <span>Sign In</span>
                <ArrowRight size={18} />
              </motion.button>
            </motion.div>
          </form>

          {/* Footer */}
          <motion.div variants={itemVariants} className="mt-10 text-center">
            <p className="text-xs text-slate-400">
              © 2025 Clinic Admin Panel. <br className="sm:hidden" /> Secure
              Connection Encrypted.
            </p>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
};

export default AdminLoginPage;
