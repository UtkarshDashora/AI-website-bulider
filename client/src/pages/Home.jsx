import React, { useState } from 'react';
import { motion, AnimatePresence } from "motion/react";
import LoginModel from '../components/loginModel';
import { useSelector, useDispatch } from 'react-redux';
import { Coins, Check, Zap, Crown, Rocket, LogOut, User } from 'lucide-react';
import { setUser } from '../redux/Userslice';
import axios from 'axios';
import { serverUrl } from '../App';
import { useNavigate } from 'react-router-dom';
import VantaBackground from '../components/VantaBackground';

function Home() {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    
    const highlights = [
        "AI Generated code",
        "Fully Responsive Layouts",
        "Production Ready output"
    ];

    const [openlogin, setOpenlogin] = useState(false);
    const [openprofile, setOpenprofile] = useState(false);
    const { userData } = useSelector((state) => state.user);

    const handleLogout = async () => {
        console.log("logout click");
        try {
            await axios.get(`${serverUrl}/api/auth/logout`, { withCredentials: true });
            dispatch(setUser(null));
            setOpenprofile(false);
        } catch (error) {
            console.log(error);
        }
    };



    return (
        <VantaBackground>
        <div className='relative min-h-screen text-white bg-transparent selection:bg-purple-500/30'>
            <motion.div
                initial={{ y: -40, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.5 }}
                className='fixed top-0 left-0 right-0 z-50 backdrop-blur-xl bg-black/40 border-b border-white/10'>
                <div className='max-w-7xl mx-auto px-6 py-4 flex justify-between items-center'>
                    <div className='text-xl font-bold cursor-pointer' onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
                        GenWeb<span className='font-normal'>.ai</span>
                    </div>
                    <div className='flex items-center gap-5'>
                        <button 
                            onClick={() => navigate("/pricing")}
                            className='hidden md:inline text-sm font-medium text-zinc-400 hover:text-white transition-colors cursor-pointer'
                        >
                            Pricing
                        </button>
                        
                        {userData && (
                            <div className='hidden md:flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/10 text-sm cursor-pointer hover:bg-white/10 transition'>
                                <Coins size={14} className='text-yellow-400' />
                                <span className='text-zinc-300'>credits</span>
                                <span>{userData.credits}</span>
                                <span className='font-semibold'>+</span>
                            </div>
                        )}

                        {!userData ? (
                            <button 
                                className='px-4 py-2 rounded-lg border border-white/20 hover:bg-white/10 font-medium text-sm transition-colors' 
                                onClick={() => setOpenlogin(true)}
                            >
                                Get Started
                            </button>
                        ) : (
                            <div className='relative'>
                                <button className='flex items-center' onClick={() => setOpenprofile(!openprofile)}>
                                    <img 
                                        src={userData.avatar || `https://ui-avatars.com/api/?name=${userData.name}`} 
                                        alt="" 
                                        className='w-9 h-9 rounded-full border border-white/20 object-cover hover:border-white/40 transition-colors' 
                                    />
                                </button>
                                <AnimatePresence>
                                    {openprofile && (
                                        <motion.div
                                            initial={{ opacity: 0, y: -10, scale: 0.95 }}
                                            animate={{ opacity: 1, y: 0, scale: 1 }}
                                            exit={{ opacity: 0, y: -10, scale: 0.95 }}
                                            className='absolute right-0 mt-3 w-60 z-50 rounded-xl bg-[#0b0b0b] border border-white/10 shadow-2xl overflow-hidden'
                                        >
                                            <div className="px-4 py-3 border-b border-white/10">
                                                <p className="text-sm font-medium truncate">{userData.name}</p>
                                                <p className="text-xs text-zinc-500 truncate">{userData.email}</p>
                                            </div>

                                            <button className='md:hidden w-full flex px-4 py-3 items-center gap-2 text-sm border-b border-white/10 hover:bg-white/5'>
                                                <Coins size={14} className='text-yellow-400' />
                                                <span className='text-zinc-300'>credits</span>
                                                <span>{userData.credits}</span>
                                                <span className='font-semibold'>+</span>
                                            </button>
                                            <button 
                                                onClick={() => { navigate("/dashboard"); setOpenprofile(false); }}
                                                className='w-full text-left px-4 py-3 text-sm hover:bg-white/5 transition-colors'
                                            >
                                                Dashboard
                                            </button>
                                            <button 
                                                onClick={handleLogout}
                                                className='w-full text-left px-4 py-3 text-sm text-red-400 hover:bg-red-400/5 transition-colors'
                                            >
                                                Logout
                                            </button>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>
                        )}
                    </div>
                </div>
            </motion.div>

            <section className='pt-52 pb-32 px-6 flex flex-col items-center justify-center text-center'>
                <motion.h1
                    initial={{ y: 40, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    className="text-5xl md:text-7xl md:leading-tight font-bold tracking-tight uppercase"
                >
                    Build Stunning Websites <br />
                    <span className='bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent italic'>with AI</span>
                </motion.h1>
                <motion.p
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    className='mt-8 max-w-2xl mx-auto text-zinc-400 text-lg'
                >
                    Describe your idea let AI generate a complete website in seconds,
                    responsive, beautiful and ready to launch.
                </motion.p>
                
                <button 
                    className='px-10 py-4 rounded-xl bg-white text-black font-semibold hover:scale-105 transition mt-12 shadow-[0_0_20px_rgba(255,255,255,0.2)]' 
                    onClick={() => {
                        if (userData) navigate("/dashboard");
                        else setOpenlogin(true);
                    }}
                >
                    {userData ? "Go to Dashboard" : "Get Started"}
                </button>
            </section>
            
            <section className='max-w-7xl mx-auto px-6 pb-32'>
                <div className='grid grid-cols-1 md:grid-cols-3 gap-10'>
                    {highlights.map((highlight, index) => (
                        <motion.div
                            key={index}
                            initial={{ y: 40, opacity: 0 }}
                            whileInView={{ y: 0, opacity: 1 }}
                            className='rounded-2xl bg-white/5 border border-white/10 p-8 hover:bg-white/[0.07] transition-colors shadow-lg'
                        >
                            <h1 className='text-xl font-semibold mb-3'>{highlight}</h1>
                            <p className='text-sm text-zinc-400 leading-relaxed'>
                                Genweb.ai builds real websites with clean code, animations, and responsive design.
                                Scalable structures ensure your site grows seamlessly.
                            </p>
                        </motion.div>
                    ))}
                </div>
            </section>

            
            <footer className='border-t border-white/10 py-10 text-center text-sm text-zinc-500'>
                &copy; {new Date().getFullYear()} Genweb.ai Made By Utkarsh D@shora
            </footer>

            <LoginModel open={openlogin} onClose={() => setOpenlogin(false)} />
        </div>
        </VantaBackground>
    );
}

export default Home;
