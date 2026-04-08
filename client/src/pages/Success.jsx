import React, { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { CheckCircle, ArrowRight, PartyPopper } from 'lucide-react';
import { motion } from 'framer-motion';
import { useGetCurrentUser } from '../hooks/useGetCurrentUser';
import axios from 'axios';

const serverUrl = "https://ai-website-bulider1.onrender.com";

function Success() {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const { refreshUser } = useGetCurrentUser();
    const sessionId = searchParams.get('session_id');
    const [verifying, setVerifying] = React.useState(true);
    const [error, setError] = React.useState(null);

    useEffect(() => {
        const verifyPayment = async () => {
            if (sessionId) {
                try {
                    setVerifying(true);
                    const res = await axios.get(`${serverUrl}/api/payment/verify-session/${sessionId}`, {
                        withCredentials: true
                    });
                    if (res.data.success) {
                        await refreshUser();
                        setVerifying(false);
                    }
                } catch (err) {
                    console.error("Verification failed:", err);
                    setError("Verification took longer than expected. Please check your dashboard in a few minutes.");
                    setVerifying(false);
                }
            }
        };

        verifyPayment();
    }, [sessionId]);

    return (
        <div className="min-h-screen bg-[#050505] text-white flex flex-col items-center justify-center p-6 font-sans">
            <motion.div 
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="max-w-md w-full bg-zinc-900/50 border border-white/5 rounded-[2.5rem] p-10 text-center shadow-2xl backdrop-blur-xl"
            >
                {verifying ? (
                    <div className="space-y-6">
                        <div className="w-20 h-20 border-4 border-white/10 border-t-purple-500 rounded-full animate-spin mx-auto mb-8" />
                        <h1 className="text-2xl font-bold tracking-tight">Verifying Payment...</h1>
                        <p className="text-zinc-400 text-sm">Please wait while we confirm your purchase with Stripe.</p>
                    </div>
                ) : (
                    <>
                        <div className="w-20 h-20 bg-emerald-500/20 border border-emerald-500/20 rounded-3xl flex items-center justify-center mx-auto mb-8">
                            <CheckCircle className="text-emerald-400" size={40} />
                        </div>

                        <h1 className="text-3xl font-bold mb-4 tracking-tight">Payment Successful!</h1>
                        <p className="text-zinc-400 mb-10 leading-relaxed">
                            {error || "Thank you for your purchase. Your credits have been automatically added to your account. You can now start building more premium AI websites."}
                        </p>

                        <div className="space-y-4">
                            <button 
                                onClick={() => navigate("/dashboard")}
                                className="w-full py-4 rounded-2xl bg-white text-black font-bold flex items-center justify-center gap-2 hover:bg-zinc-200 transition-all active:scale-95"
                            >
                                Go to Dashboard
                                <ArrowRight size={18} />
                            </button>
                            
                            <div className="flex items-center justify-center gap-2 text-xs text-zinc-500 font-medium uppercase tracking-widest pt-4">
                                <PartyPopper size={14} className="text-purple-400" />
                                Happy Building
                            </div>
                        </div>
                    </>
                )}
            </motion.div>
        </div>
    );
}

export default Success;
