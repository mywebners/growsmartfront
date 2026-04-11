import React, { useState } from "react";
import { motion } from "framer-motion";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function Register() {

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: ""
  });

  const navigate = useNavigate();

  const handleSubmit = async () => {

    try {
      await axios.post(
        "http://127.0.0.1:5000/auth/register",
        form
      );

      alert("Registered successfully");
      navigate("/login");

    } catch (err) {
      alert("Registration failed");
    }
  };

  return (
    <div className="min-h-screen pt-32 pb-20 px-4 flex items-center justify-center">
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6 }}
        className="glass-card p-12 w-full max-w-md backdrop-blur-xl shadow-2xl career-glow"
      >
        <motion.div
          className="text-center mb-12"
          initial={{ y: -30 }}
          animate={{ y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <div className="text-6xl mb-4">👤</div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-green-400 to-blue-500 bg-clip-text text-transparent mb-2">
            Create Account
          </h1>
          <p className="text-white/70">Join thousands discovering their dream careers</p>
        </motion.div>

        <form className="space-y-6">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
          >
            <input
              type="text"
              placeholder="Full Name"
              className="input-field"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
            />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5 }}
          >
            <input
              type="email"
              placeholder="Email Address"
              className="input-field"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
            />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.6 }}
          >
            <input
              type="password"
              placeholder="Create Password"
              className="input-field"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
            />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
          >
            <button
              type="button"
              onClick={handleSubmit}
              className="btn-career w-full text-lg py-5 shadow-2xl hover:shadow-green-500/50"
            >
              Create Account
            </button>
          </motion.div>

          <motion.div
            className="text-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
          >
            <button
              className="text-blue-400 hover:text-blue-300 text-sm font-medium underline"
              onClick={() => navigate('/login')}
            >
              Already have an account? Sign In
            </button>
          </motion.div>
        </form>
      </motion.div>
    </div>
  );
}

export default Register;