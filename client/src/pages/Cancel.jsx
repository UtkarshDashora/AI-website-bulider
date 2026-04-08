import React from 'react';
import { useNavigate } from 'react-router-dom';
import { XCircle, ArrowLeft, RefreshCcw } from 'lucide-react';
import { motion } from 'motion/react';

function Cancel() {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen bg-[#050505] text-white flex flex-col items-center justify-center p-6 font-sans">
            <motion.div 
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="max-w-md w-full bg-zinc-900/50 border border-white/5 rounded-[2.5rem] p-10 text-center shadow-2xl backdrop-blur-xl"
            >
                <div className="w-16 h-16 bg-red-400/10 border border-red-400/20 rounded-3xl flex items-center justify-center mx-auto mb-8">
                    <XCircle className="text-red-400" size={32} />
                </div>

                <h1 className="text-2xl font-bold mb-4 tracking-tight">Payment Cancelled</h1>
                <p className="text-zinc-400 mb-10 leading-relaxed">
                    The checkout process was cancelled. No charges were made to your account. Feel free to try again whenever you're ready.
                </p>

                <div className="space-y-4">
                    <button 
                        onClick={() => navigate("/")}
                        className="w-full py-4 rounded-2xl bg-zinc-800 text-white font-bold flex items-center justify-center gap-2 hover:bg-zinc-750 transition-all active:scale-95 border border-white/5"
                    >
                        Return to Pricing
                        <ArrowLeft size={18} />
                    </button>
                </div>
            </motion.div>
        </div>
    );
}

export default Cancel;
