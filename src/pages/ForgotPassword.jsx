import React, { useState } from "react";
import { motion } from "framer-motion";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");
    if (!email.trim()) {
      setError("Email is required");
      return;
    }
    setLoading(true);
    try {
      const res = await axios.post("http://127.0.0.1:5000/auth/forgot-password", {
        email: email.trim(),
      });
      setMessage(res.data?.message || "Check your email for next steps.");
    } catch (err) {
      setError(err.response?.data?.message || "Request failed. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen pt-32 pb-20 px-4 flex items-center justify-center">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="glass-card p-12 w-full max-w-md backdrop-blur-xl shadow-2xl career-glow"
      >
        <div className="text-center mb-10">
          <div className="text-6xl mb-4">🔑</div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-amber-400 to-orange-500 bg-clip-text text-transparent mb-2">
            Forgot password
          </h1>
          <p className="text-white/70 text-sm">
            Enter the email you registered with. If it exists, your password will be reset.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <input
            type="email"
            placeholder="Email address"
            className="input-field"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            autoComplete="email"
          />

          {error && (
            <p className="text-red-400 text-sm text-center">{error}</p>
          )}
          {message && (
            <p className="text-emerald-300 text-sm text-center bg-white/5 rounded-xl p-4 border border-emerald-500/30">
              {message}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="btn-career w-full text-lg py-5 shadow-xl disabled:opacity-60"
          >
            {loading ? "Sending…" : "Reset password"}
          </button>

          <div className="text-center space-y-2">
            <button
              type="button"
              className="text-blue-400 hover:text-blue-300 text-sm font-medium underline block w-full"
              onClick={() => navigate("/login")}
            >
              Back to sign in
            </button>
            <button
              type="button"
              className="text-white/50 hover:text-white/80 text-sm"
              onClick={() => navigate("/register")}
            >
              Create account
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
}

export default ForgotPassword;
