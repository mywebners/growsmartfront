import React, { useState } from "react";
import { motion } from "framer-motion";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post("http://localhost:5000/forgot", { email });
      setMessage('Reset link sent to your email!');
    } catch (err) {
      setMessage('Failed to send reset link');
    }
  };

  return (
    <div className="min-h-screen pt-8 sm:pt-10 pb-16 sm:pb-20 px-3 max-[320px]:px-2 sm:px-4 flex items-center justify-center">
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        className="glass-card p-12 w-full max-w-md backdrop-blur-xl shadow-2xl"
      >
        <motion.div className="text-center mb-12">
          <div className="text-6xl mb-4">🔑</div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-orange-400 to-red-500 bg-clip-text text-transparent mb-2">
            Reset Password
          </h1>
          <p className="text-[#5b5b5b]">Enter your email to receive reset instructions</p>
        </motion.div>

        <form className="space-y-6" onSubmit={handleSubmit}>
          <input
            type="email"
            placeholder="Enter your email"
            className="input-field"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <button type="submit" className="btn-career w-full text-lg py-5">
            Send Reset Link
          </button>
        </form>

        {message && (
          <motion.p 
            className="mt-6 text-center p-4 rounded-xl bg-green-500/20 border border-green-500/50 text-green-300"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            {message}
          </motion.p>
        )}

        <div className="text-center mt-8">
          <button
            className="text-[#2f7de1] hover:text-[#378edd] text-sm font-medium underline"
            onClick={() => navigate('/login')}
          >
            Back to Login
          </button>
        </div>
      </motion.div>
    </div>
  );
};

export default ForgotPassword;