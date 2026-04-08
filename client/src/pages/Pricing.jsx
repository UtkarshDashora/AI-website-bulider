import React, { useState } from 'react';
import { motion, AnimatePresence } from "motion/react";
import { useSelector, useDispatch } from 'react-redux';
import { Coins, Check, Zap, Crown, Rocket, ArrowLeft, Star, Shield, ZapIcon } from 'lucide-react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import LoginModel from '../components/loginModel';
import VantaBackground from '../components/VantaBackground';

const serverUrl = "https://ai-website-bulider1.onrender.com";

function Pricing() {
    const navigate = useNavigate();
    const { userData } = useSelector((state) => state.user);
    const [openlogin, setOpenlogin] = useState(false);

    const plans = [
        {
            name: "Starter",
            price: "Free",
            credits: "100",
            description: "Perfect for exploring the AI's capabilities.",
            features: ["1 Full Website Generation", "Standard Image Fixer", "Basic Components", "Community Support"],
            icon: <ZapIcon className="text-blue-400" size={24} />,
            button: "Try for Free",
            popular: false,
            color: "blue"
        },
        {
            name: "Professional",
            price: "$29",
            credits: "15,000",
            description: "Powerful tools for creators and freelancers.",
            features: ["Unlimited Edits", "Priority AI Generation", "Ironclad Image Fixer", "Premium Templates", "Custom Branding", "Priority Support"],
            icon: <Crown className="text-purple-400" size={24} />,
            button: "Upgrade to Pro",
            popular: true,
            color: "purple"
        },
        {
            name: "Ultimate",
            price: "$99",
            credits: "50,000",
            description: "Scale your agency with massive credit packs.",
            features: ["White-label Export", "Dedicated Account Manager", "Custom Component Library", "API Access (Beta)", "Enterprise Grade Security", "Instant Support"],
            icon: <Rocket className="text-emerald-400" size={24} />,
            button: "Go Ultimate",
            popular: false,
            color: "emerald"
        }
    ];

    const handlePayment = async (plan) => {
        if (!userData) {
            setOpenlogin(true);
            return;
        }

        if (plan.price === "Free") {
            navigate("/dashboard");
            return;
        }

        try {
            const numericPrice = parseInt(plan.price.replace("$", ""));
            const res = await axios.post(`${serverUrl}/api/payment/create-checkout-session`, {
                planName: plan.name,
                credits: plan.credits.replace(",", ""),
                price: numericPrice
            }, { withCredentials: true });

            if (res.data.success && res.data.url) {
                window.location.href = res.data.url;
            }
        } catch (error) {
            console.error("Payment Error:", error);
            alert("Failed to initiate payment. Please try again.");
        }
    };

    return (
        <VantaBackground>
        <div className='relative min-h-screen font-sans text-white bg-transparent selection:bg-purple-500/30'>
            {/* Background Decorations */}
            <div className='absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-purple-600/10 rounded-full blur-[120px] pointer-events-none' />
            <div className='absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-600/10 rounded-full blur-[120px] pointer-events-none' />
            
            <header className='fixed top-0 left-0 right-0 z-50 backdrop-blur-xl bg-black/40 border-b border-white/5'>
                <div className='max-w-7xl mx-auto px-6 h-20 flex items-center justify-between'>
                    <div className='flex items-center gap-6'>
                        <button 
                            onClick={() => navigate("/")}
                            className='p-2 rounded-lg bg-zinc-900 border border-white/10 hover:bg-zinc-800 transition group'
                        >
                            <ArrowLeft size={16} className='group-hover:-translate-x-0.5 transition' />
                        </button>
                    </div>
                    <div className='absolute left-1/2 -translate-x-1/2 text-xl font-bold tracking-tighter'>
                        GenWeb<span className='text-purple-500'>.ai</span>
                    </div>
                    <div className='flex items-center gap-4'>
                         {userData && (
                            <div className='flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/5 border border-white/10 text-xs font-bold'>
                                <Coins size={14} className='text-yellow-400' />
                                <span className='text-zinc-400 uppercase tracking-widest'>Credits</span>
                                <span>{userData.credits}</span>
                            </div>
                        )}
                    </div>
                </div>
            </header>

            <main className='pt-40 pb-32 px-6'>
                <div className='max-w-7xl mx-auto text-center mb-24'>
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className='inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-400 text-xs font-bold uppercase tracking-widest mb-8'
                    >
                        <Star size={12} fill="currentColor" />
                        Professional Pricing
                    </motion.div>
                    <motion.h1 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className='text-5xl md:text-7xl font-bold tracking-tight mb-6'
                    >
                        Scale your vision <br />
                        <span className='bg-gradient-to-r from-white via-zinc-400 to-zinc-600 bg-clip-text text-transparent italic'>without limits.</span>
                    </motion.h1>
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className='text-zinc-400 text-lg max-w-2xl mx-auto leading-relaxed'
                    >
                        Choose a credit pack that matches your needs. From simple experiments 
                        to high-volume agency production, we've got you covered.
                    </motion.p>
                </div>

                <div className='max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8'>
                    {plans.map((plan, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            whileHover={{ 
                                rotateY: 5, 
                                rotateX: -5,
                                scale: 1.02,
                                transition: { duration: 0.2 }
                            }}
                            transition={{ delay: index * 0.1 }}
                            viewport={{ once: true }}
                            style={{ 
                                perspective: 1000,
                                transformStyle: "preserve-3d"
                            }}
                            className={`relative group rounded-[2.5rem] p-10 border transition-all duration-500 flex flex-col ${
                                plan.popular 
                                ? 'bg-zinc-900 border-purple-500/50 shadow-[0_0_40px_rgba(168,85,247,0.1)]' 
                                : 'bg-[#0b0b0b] border-white/5 hover:border-white/20'
                            }`}
                        >
                            {plan.popular && (
                                <div className='absolute -top-4 left-1/2 -translate-x-1/2 px-6 py-1.5 rounded-full bg-gradient-to-r from-purple-600 to-indigo-600 text-[10px] font-black uppercase tracking-[0.2em] shadow-lg'>
                                    Recommended
                                </div>
                            )}

                            <div className='mb-8 flex justify-between items-start'>
                                <div className={`p-4 rounded-3xl bg-white/5 border border-white/10 ${plan.color === 'purple' ? 'group-hover:bg-purple-500/10 group-hover:border-purple-500/30' : ''} transition-all duration-500`}>
                                    {plan.icon}
                                </div>
                                <div className='text-right'>
                                    <h3 className='text-sm font-black uppercase tracking-widest text-zinc-500'>{plan.name}</h3>
                                    <div className='flex items-baseline justify-end gap-1'>
                                        <span className='text-4xl font-bold tracking-tight'>{plan.price}</span>
                                        {plan.price !== "Free" && <span className='text-xs text-zinc-600 font-bold uppercase'>/mo</span>}
                                    </div>
                                </div>
                            </div>

                            <p className='text-zinc-400 text-sm leading-relaxed mb-8'>
                                {plan.description}
                            </p>

                            <div className='p-6 rounded-3xl bg-white/[0.03] border border-white/5 mb-10'>
                                <div className='flex items-center gap-3 mb-1'>
                                    <Coins size={16} className='text-yellow-400' />
                                    <span className='text-2xl font-bold tracking-tight'>{plan.credits}</span>
                                </div>
                                <span className='text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500'>AI Credits Included</span>
                            </div>

                            <ul className='space-y-5 mb-12 flex-grow'>
                                {plan.features.map((feature, fIdx) => (
                                    <li key={fIdx} className='flex items-start gap-3 text-sm text-zinc-400 group-hover:text-zinc-300 transition-colors'>
                                        <div className='p-1 rounded-full bg-white/5 mt-0.5'>
                                            <Check size={10} className='text-purple-400' />
                                        </div>
                                        {feature}
                                    </li>
                                ))}
                            </ul>

                            <button 
                                onClick={() => handlePayment(plan)}
                                className={`w-full py-5 rounded-[1.5rem] font-black text-xs uppercase tracking-[0.2em] transition-all duration-300 active:scale-95 ${
                                    plan.popular 
                                    ? 'bg-purple-600 hover:bg-purple-500 text-white shadow-2xl shadow-purple-500/20' 
                                    : 'bg-white text-black hover:bg-zinc-200'
                                }`}
                            >
                                {plan.button}
                            </button>
                        </motion.div>
                    ))}
                </div>

                <div className='max-w-4xl mx-auto mt-40 grid grid-cols-1 md:grid-cols-2 gap-16'>
                    <div className='flex gap-6'>
                        <div className='shrink-0 w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center'>
                            <Shield size={24} className='text-zinc-400' />
                        </div>
                        <div>
                            <h4 className='text-lg font-bold mb-2'>Secure Payments</h4>
                            <p className='text-sm text-zinc-500 leading-relaxed'>We use Stripe for secure checkout. We never store your card details on our servers.</p>
                        </div>
                    </div>
                    <div className='flex gap-6'>
                        <div className='shrink-0 w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center'>
                            <Zap size={24} className='text-zinc-400' />
                        </div>
                        <div>
                            <h4 className='text-lg font-bold mb-2'>Instant Credits</h4>
                            <p className='text-sm text-zinc-500 leading-relaxed'>Your credits are added to your account instantly after a successful payment session.</p>
                        </div>
                    </div>
                </div>

                <div className='mt-40 border-t border-white/5 pt-20 text-center opacity-40 hover:opacity-100 transition-opacity'>
                    <p className='text-xs font-black uppercase tracking-widest'>© 2026 GenWeb.ai - Build the future of the web.</p>
                </div>
            </main>

            <LoginModel open={openlogin} onClose={() => setOpenlogin(false)} />
        </div>
        </VantaBackground>
    );
}

export default Pricing;
