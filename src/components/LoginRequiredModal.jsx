import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";

/**
 * GrowSmart-style login gate popup.
 * Used when a feature needs account / OpenAI / MongoDB access.
 */
function LoginRequiredModal({
  open = true,
  onClose,
  title = "Please sign up to continue",
  message = "Career prediction, Jobs guidance, CV Maker, and History need a free GrowSmart account so your results stay saved after logout.",
  fromPath = "/",
}) {
  const navigate = useNavigate();

  if (!open) return null;

  const goRegister = () => {
    navigate("/register", { state: { from: fromPath } });
  };

  const goLogin = () => {
    navigate("/login", { state: { from: fromPath } });
  };

  const handleClose = () => {
    if (onClose) onClose();
    else navigate("/", { replace: true });
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-[200] flex items-center justify-center px-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          role="dialog"
          aria-modal="true"
          aria-labelledby="login-required-title"
        >
          <button
            type="button"
            className="absolute inset-0 bg-[#0b1f44]/45 backdrop-blur-sm"
            aria-label="Close"
            onClick={handleClose}
          />

          <motion.div
            className="relative z-10 w-full max-w-md glass-card p-8 sm:p-10 text-center shadow-2xl border border-[#d9e6fb] bg-white"
            initial={{ opacity: 0, y: 24, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 12, scale: 0.98 }}
            transition={{ type: "spring", stiffness: 280, damping: 24 }}
          >
            <div className="mx-auto mb-5 w-16 h-16 rounded-2xl bg-gradient-to-br from-[#0056d2] to-[#003a9b] text-white flex items-center justify-center text-3xl shadow-lg">
              🔐
            </div>
            <h2
              id="login-required-title"
              className="text-2xl sm:text-3xl font-bold text-[#111111] mb-3"
            >
              {title}
            </h2>
            <p className="text-[#444444] text-sm sm:text-base leading-relaxed mb-8">
              {message}
            </p>

            <div className="flex flex-col gap-3">
              <button
                type="button"
                className="w-full py-3.5 rounded-2xl font-bold text-white bg-gradient-to-r from-[#0056d2] to-[#2f7de1] hover:from-[#0044a8] hover:to-[#0056d2] shadow-lg"
                onClick={goRegister}
              >
                Sign up for free
              </button>
              <button
                type="button"
                className="w-full py-3.5 rounded-2xl font-semibold text-[#111111] bg-[#eef5ff] border border-[#d9e6fb] hover:bg-[#dbeafe]"
                onClick={goLogin}
              >
                Log in
              </button>
              <button
                type="button"
                className="w-full py-2.5 text-sm font-medium text-[#5b5b5b] hover:text-[#111111]"
                onClick={handleClose}
              >
                Back to dashboard
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export default LoginRequiredModal;
