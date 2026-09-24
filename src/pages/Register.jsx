import React, { useState, useContext } from "react";
import { motion } from "framer-motion";
import axios from "axios";
import { useNavigate, useLocation } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

function Register() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);

  const { login } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();
  const redirectTo = location.state?.from || "/guidance";

  const handleSubmit = async (e) => {
    e?.preventDefault?.();
    setLoading(true);
    try {
      // Register API now returns token + name → auto sign-in (no login page)
      const res = await axios.post("http://127.0.0.1:5000/auth/register", {
        name: form.name.trim(),
        email: form.email.trim().toLowerCase(),
        password: form.password,
      });

      if (!res.data?.token) {
        alert(res.data?.message || "Registered but login failed. Please sign in.");
        navigate("/login", { state: { from: redirectTo } });
        return;
      }

      // JWT + GET /auth/me (profile + empty history for new user)
      await login(res.data.token, res.data.name, {
        email: res.data.email,
        image: res.data.image,
      });
      navigate(redirectTo, { replace: true });
    } catch (err) {
      alert(err.response?.data?.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen pt-8 sm:pt-10 pb-16 sm:pb-20 px-3 max-[320px]:px-2 sm:px-4 flex items-center justify-center">
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
          <h1 className="text-4xl font-bold bg-gradient-to-r from-[#003a9b] via-[#0056d2] to-[#2f7de1] bg-clip-text text-transparent mb-2">
            Create Account
          </h1>
          <p className="text-[#5b5b5b]">Join thousands discovering their dream careers</p>
        </motion.div>

        <form className="space-y-6" onSubmit={handleSubmit} autoComplete="on">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
          >
            <input
              type="text"
              name="name"
              placeholder="Full Name"
              className="input-field"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              required
            />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5 }}
          >
            <input
              type="email"
              name="email"
              placeholder="Email Address"
              className="input-field"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              required
              autoComplete="username"
            />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.6 }}
          >
            {/* type=password masks on screen; Network tab still shows JSON body (browser DevTools — cannot hide from yourself) */}
            <input
              type="password"
              name="password"
              placeholder="Create Password"
              className="input-field"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              required
              minLength={6}
              autoComplete="new-password"
            />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
          >
            <button
              type="submit"
              disabled={loading}
              className="btn-career w-full text-lg py-5 shadow-2xl hover:shadow-[#2f7de1]/40 disabled:opacity-60"
            >
              {loading ? "Creating account…" : "Create Account"}
            </button>
          </motion.div>

          <motion.div
            className="text-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
          >
            <button
              type="button"
              className="text-[#2f7de1] hover:text-[#378edd] text-sm font-medium underline"
              onClick={() => navigate("/login")}
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
