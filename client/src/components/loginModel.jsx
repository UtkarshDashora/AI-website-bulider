import React from 'react';
import { AnimatePresence, motion } from "motion/react";
import { signInWithPopup, signInWithRedirect } from "firebase/auth";
import { auth, provider } from "../firebase";
import axios from "axios";
import { serverUrl } from "../App";
import { useDispatch } from 'react-redux';
import { setUser } from '../redux/Userslice';

function LoginModel({ open, onClose }) {
  const dispatch = useDispatch();

  const handleGoogleLogin = async () => {
    try {
        console.log("[Auth] Attempting login. Server URL:", serverUrl);
        
        // Detect mobile users
        const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);

        if (isMobile) {
            console.log("[Auth] Mobile detected: Using Redirect flow");
            await signInWithRedirect(auth, provider);
        } else {
            console.log("[Auth] Desktop detected: Using Popup flow");
            const result = await signInWithPopup(auth, provider);
            const { data } = await axios.post(`${serverUrl}/api/auth/google`, {
                name: result.user.displayName,
                email: result.user.email,
                avatar: result.user.photoURL
            }, { withCredentials: true });
            
            if (data.success) {
                dispatch(setUser(data.user));
                onClose();
            }
        }
    } catch (error) {
        console.error("[Auth] Login error:", error);
    }
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className='fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-xl px-4'
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.88, opacity: 0, y: 60 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 40 }}
            transition={{ duration: 0.45, ease: "easeOut" }}
            className="relative w-full max-w-md p-[1px] rounded-3xl bg-gradient-to-br from-purple-500/40 via-purple-500/30 to-transparent"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="relative rounded-3xl bg-[#0b0b0b] border border-white/10 shadow-[0_0_30px_120px_rgba(0,0,0,0.8)] overflow-hidden">

              {/* Background ambient glowing blurs */}
              <motion.div
                animate={{ opacity: [0.25, 0.4, 0.25] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="absolute -top-32 -left-32 w-80 h-80 bg-purple-500/30 blur-[140px]"
              />
              <motion.div
                animate={{ opacity: [0.25, 0.4, 0.25] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="absolute -bottom-32 -right-32 w-80 h-80 bg-purple-500/30 blur-[140px]"
              />

              <button
                onClick={onClose}
                className="absolute top-5 right-5 z-20 text-zinc-400 hover:text-white transition text-lg"
              >
                X
              </button>

              <div className="relative z-10 px-8 py-12">
                <h1 className="inline-block mb-6 px-4 py-1.5 rounded-full bg-white/5 border border-white/10 text-xs text-zinc-300">
                  AI-powered website builder
                </h1>

                <h2 className="text-3xl font-semibold leading-tight mb-8 space-x-2">
                  <span>Welcome to</span>
                  <span className='bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent'>Genweb.ai</span>
                </h2>

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleGoogleLogin}
                  className="group relative w-full h-12 rounded-xl bg-white text-black font-semibold shadow-xl overflow-hidden"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-zinc-100 to-white opacity-0 group-hover:opacity-100 transition-opacity" />
                  <div className="relative h-full flex items-center justify-center gap-3">
                    <img src="https://i.pinimg.com/originals/68/3d/9a/683d9a1a8150ee8b29bfd25d46804605.png" alt="Google logo" className="w-5 h-5" />
                    <span>Continue with Google</span>
                  </div>
                </motion.button>

                <div className='flex items-center gap-4 mt-8'>
                  <div className='flex-1 h-px bg-white/10' />
                  <span className='text-xs text-zinc-500'>Secure Login</span>
                  <div className='flex-1 h-px bg-white/10' />
                </div>

                <p className="text-xs text-zinc-500 leading-relaxed text-center mt-6 text-balance">
                  By continuing, you agree to our{" "}
                  <span className="underline cursor-pointer hover:text-zinc-300 transition-colors">Terms of Service</span>
                  {" "}and{" "}
                  <span className="underline cursor-pointer hover:text-zinc-300 transition-colors">Privacy Policy</span>.
                </p>

              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export default LoginModel;
