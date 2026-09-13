import React, { useState, useContext } from "react";
import { motion } from "framer-motion";
import axios from "axios";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

function Login() {

  const [form, setForm] = useState({
    email: "",
    password: ""
  });

  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async () => {

    try {
      const res = await axios.post(
        "http://127.0.0.1:5000/auth/login",
        form
      );

      login(res.data.token, res.data.name);

      navigate("/guidance", { replace: true });

    } catch (err) {
      alert(err.response?.data?.message || "Login failed");
    }
  };

  return (
    <div className="min-h-screen pt-24 sm:pt-32 pb-16 sm:pb-20 px-3 max-[320px]:px-2 sm:px-4 flex items-center justify-center">
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
          <div className="text-6xl mb-4">🔐</div>
          <h1 className="text-4xl font-bold text-career-gradient mb-2">
            Welcome Back
          </h1>
          <p className="text-white/70">Sign in to use GrowSmart</p>
        </motion.div>

        <form className="space-y-6">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
          >
            <input
              type="email"
              placeholder="Enter your email"
              className="input-field"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
            />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5 }}
          >
            <input
              type="password"
              placeholder="Enter your password"
              className="input-field"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
            />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
          >
            <button
              type="button"
              onClick={handleSubmit}
              className="btn-career w-full text-lg py-5 shadow-2xl hover:shadow-blue-500/50"
            >
              Sign In
            </button>
          </motion.div>

          <motion.div
            className="text-center space-y-3"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7 }}
          >
            <button
              type="button"
              className="text-amber-300/90 hover:text-amber-200 text-sm font-medium underline block w-full"
              onClick={() => navigate("/forgot-password")}
            >
              Forgot password?
            </button>
            <button
              type="button"
              className="text-blue-400 hover:text-blue-300 text-sm font-medium underline block w-full"
              onClick={() => navigate('/register')}
            >
              Don't have an account? Create one
            </button>
          </motion.div>
        </form>
      </motion.div>
    </div>
  );
}

export default Login;