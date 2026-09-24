import React, { useMemo, useState } from "react";
import { motion } from "framer-motion";
import axios from "axios";
import { useNavigate, useSearchParams } from "react-router-dom";

function ResetPassword() {
  const [searchParams] = useSearchParams();
  const token = useMemo(() => searchParams.get("token") || "", [searchParams]);
  const navigate = useNavigate();

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");

    if (!token) {
      setError("Missing reset token. Open the link from your email again.");
      return;
    }
    if (password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }
    if (password !== confirmPassword) {
      setError("Password and confirm password do not match.");
      return;
    }

    setLoading(true);
    try {
      const res = await axios.post("http://127.0.0.1:5000/auth/reset-password", {
        token,
        password,
        confirm_password: confirmPassword,
      });
      setMessage(res.data?.message || "Password updated. You can sign in now.");
      setTimeout(() => navigate("/login", { replace: true }), 1600);
    } catch (err) {
      setError(err.response?.data?.message || "Could not reset password. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen pt-8 sm:pt-10 pb-16 sm:pb-20 px-3 max-[320px]:px-2 sm:px-4 flex items-center justify-center">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="glass-card p-12 w-full max-w-md backdrop-blur-xl shadow-2xl career-glow"
      >
        <div className="text-center mb-10">
          <div className="text-6xl mb-4">🆕</div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-[#003a9b] via-[#0056d2] to-[#2f7de1] bg-clip-text text-transparent mb-2">
            Set new password
          </h1>
          <p className="text-[#5b5b5b] text-sm">
            Enter a new password and confirm it. This updates your account in the database.
          </p>
        </div>

        {!token ? (
          <div className="text-center space-y-4">
            <p className="text-red-500 text-sm">
              Invalid link. Please request a new reset email.
            </p>
            <button
              type="button"
              className="btn-career w-full py-4"
              onClick={() => navigate("/forgot-password")}
            >
              Request new link
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            <input
              type="password"
              placeholder="New password"
              className="input-field"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="new-password"
              minLength={6}
              required
            />
            <input
              type="password"
              placeholder="Confirm new password"
              className="input-field"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              autoComplete="new-password"
              minLength={6}
              required
            />

            {error && <p className="text-red-500 text-sm text-center">{error}</p>}
            {message && (
              <p className="text-[#0b1f44] text-sm text-center bg-[#eef5ff] rounded-xl p-4 border border-[#b7d0f5]">
                {message}
              </p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="btn-career w-full text-lg py-5 shadow-xl disabled:opacity-60"
            >
              {loading ? "Saving…" : "Update password"}
            </button>

            <button
              type="button"
              className="text-[#2f7de1] hover:text-[#378edd] text-sm font-medium underline block w-full text-center"
              onClick={() => navigate("/login")}
            >
              Back to sign in
            </button>
          </form>
        )}
      </motion.div>
    </div>
  );
}

export default ResetPassword;
