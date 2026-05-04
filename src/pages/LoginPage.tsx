import React from "react";
import { useAuth } from "@/src/context/AuthContext";
import { motion } from "motion/react";
import { useNavigate } from "react-router-dom";

export default function LoginPage() {
  const { loginWithGoogle, user } = useAuth();
  const navigate = useNavigate();

  React.useEffect(() => {
    if (user) {
      navigate("/");
    }
  }, [user, navigate]);

  return (
    <div className="min-h-[80vh] flex items-center justify-center bg-[#FDF5E6] px-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="max-w-md w-full bg-white p-12 border border-[#D4AF37]/20 shadow-xl text-center"
      >
        <h1 className="text-4xl font-display text-[#2F2F2F] mb-4">Welcome <span className="italic text-[#8B0000]">Back</span></h1>
        <p className="text-gray-500 mb-10 text-sm">Sign in to your S&M Wardrobe account to manage orders and see personalized recommendations.</p>
        
        <button
          onClick={loginWithGoogle}
          className="w-full py-4 border-2 border-[#2F2F2F] text-[#2F2F2F] font-bold tracking-widest uppercase hover:bg-[#2F2F2F] hover:text-white transition-all flex items-center justify-center gap-4 group"
        >
          <img src="https://www.google.com/favicon.ico" className="w-5 h-5" alt="Google" />
          Continue with Google
        </button>

        <p className="mt-8 text-[10px] text-gray-400 uppercase tracking-widest leading-loose">
          By signing in, you agree to our Terms of Service and Privacy Policy.
        </p>
      </motion.div>
    </div>
  );
}
