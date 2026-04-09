import React, { useState, useEffect } from 'react';
import { ArrowLeft, Plus, Layout, Settings, Trash2, Globe, ExternalLink, Clock, Rocket, Send } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import axios from 'axios';
import { motion } from 'motion/react';
import { getImageFixerScript } from '../utils/imageFixer';
import { serverUrl } from '../App';
const serverUrl = "https://ai-website-bulider1.onrender.com";

function Dashboard() {
    const navigate = useNavigate();
    const { userData } = useSelector((state) => state.user);
    const [websites, setWebsites] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchWebsites = async () => {
            try {
                const res = await axios.get(`${serverUrl}/api/website/get`, {
                    withCredentials: true
                });
                if (res.data.success) {
                    setWebsites(res.data.websites);
                }
            } catch (err) {
                console.error("Dashboard Fetch Error:", err);
            } finally {
                setLoading(false);
            }
        };
        fetchWebsites();
    }, []);

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const year = date.getFullYear();
        return `${day}/${month}/${year}`;
    };

    const getPreviewCode = (site) => {
        const baseCode = site.latestCode || "";
        const styles = `
            <style>
                html, body { 
                    margin: 0;
                    padding: 0;
                    width: 100%;
                    height: 100%;
                }
                /* Hide scrollbars for the preview */
                ::-webkit-scrollbar { display: none; }
            </style>
        `;
        const scripts = `
            <script>
                ${getImageFixerScript(site?.title || "")}
            </script>
        `;

        // If it's a full HTML document, inject before </head> and </body>
        if (baseCode.includes('</head>')) {
            return baseCode
                .replace(/<\/head>/i, `<script src="https://cdn.tailwindcss.com"></script><script src="https://unpkg.com/lucide@latest"></script>${styles}</head>`)
                .replace(/<\/body>/i, `${scripts}</body>`);
        }

        // Fallback for partial code: wrap it
        return `
            <!DOCTYPE html>
            <html>
            <head>
                <script src="https://cdn.tailwindcss.com"></script>
                <script src="https://unpkg.com/lucide@latest"></script>
                ${styles}
            </head>
            <body>
                ${baseCode}
                ${scripts}
            </body>
            </html>
        `;
    };

    return (
        <div className='min-h-screen bg-black text-white selection:bg-purple-500/30 font-sans'>
            <header className='sticky top-0 z-50 bg-black/80 backdrop-blur-md'>
                <div className='max-w-7xl mx-auto px-6 h-20 flex items-center justify-between'>
                    <div className='flex items-center gap-6'>
                        <button
                            onClick={() => navigate("/")}
                            className='p-2 rounded-lg bg-zinc-900 border border-white/10 hover:bg-zinc-800 transition-all group'
                        >
                            <ArrowLeft size={16} className='group-hover:-translate-x-0.5 transition-transform' />
                        </button>
                        <h1 className='text-lg font-bold tracking-tight'>Dashboard</h1>
                    </div>

                    <button
                        onClick={() => navigate("/generate")}
                        className='px-5 py-2.5 rounded-xl bg-white text-black text-[13px] font-black hover:bg-zinc-200 transition-all flex items-center gap-2 active:scale-95 shadow-xl'
                    >
                        <Plus size={16} strokeWidth={3} />
                        New Website
                    </button>
                </div>
            </header>

            {/* User Greeting */}
            <section className="max-w-7xl mx-auto px-6 pt-16 pb-8">
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="space-y-1"
                >
                    <p className="text-zinc-500 text-sm font-medium">Welcome Back</p>
                    <h2 className="text-4xl font-bold tracking-tight">{userData?.name || "User"}</h2>
                </motion.div>
            </section>

            {/* Main Content */}
            <main className='max-w-7xl mx-auto px-6 py-12'>
                {loading ? (
                    <div className="flex flex-col items-center justify-center py-32 space-y-4">
                        <div className="w-10 h-10 border-4 border-purple-500/30 border-t-purple-500 rounded-full animate-spin"></div>
                        <span className="text-zinc-500 text-sm font-medium tracking-widest uppercase">Loading Projects...</span>
                    </div>
                ) : websites.length === 0 ? (
                    <div className='flex flex-col items-center justify-center py-32 border-2 border-dashed border-white/5 rounded-3xl bg-white/[0.02]'>
                        <div className='w-16 h-16 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center mb-6'>
                            <Layout size={32} className='text-zinc-500' />
                        </div>
                        <h2 className='text-xl font-semibold mb-2'>No websites yet</h2>
                        <p className='text-zinc-400 mb-8 max-w-sm text-center'>
                            You haven't generated any websites. Describe your vision and let AI build it for you.
                        </p>
                        <button
                            onClick={() => navigate("/generate")}
                            className='px-6 py-3 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition font-medium text-sm'
                        >
                            Start Creating
                        </button>
                    </div>
                ) : (
                    <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10'>
                        {websites.map((site, index) => (
                            <motion.div 
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.1 }}
                                key={site._id}
                                className="group bg-[#111111] border border-white/5 rounded-[2rem] overflow-hidden flex flex-col transition-all cursor-pointer relative"
                                onClick={() => navigate(`/editor/${site._id}`)}
                            >
                                {/* Website Preview Container */}
                                <div className="p-4">
                                    <div className="aspect-[16/10] bg-[#1a1a1a] rounded-[1.5rem] overflow-hidden relative border border-white/5 shadow-2xl">
                                        {/* Internal Preview Header */}
                                        <div className="absolute top-0 left-0 right-0 h-10 bg-black/40 backdrop-blur-sm z-40 px-4 flex items-center justify-between border-b border-white/5">
                                            <span className="text-[11px] font-bold text-zinc-400 truncate max-w-[70%]">{site.title}</span>
                                            <div className="p-1 px-2 rounded-md hover:bg-white/5 transition-colors">
                                                <div className="w-4 h-0.5 bg-zinc-500 rounded-full mb-0.5" />
                                                <div className="w-4 h-0.5 bg-zinc-500 rounded-full mb-0.5" />
                                                <div className="w-4 h-0.5 bg-zinc-500 rounded-full" />
                                            </div>
                                        </div>

                                        <div className="pt-10 h-full w-full relative">
                                            <div className="absolute inset-0 z-30 bg-transparent cursor-pointer"></div>
                                            <iframe
                                                srcDoc={getPreviewCode(site)}
                                                className="absolute inset-0 w-[400%] h-[400%] border-none origin-top-left scale-[0.25] pointer-events-none"
                                                title={`Preview ${site.title}`}
                                                loading="lazy"
                                            />
                                            <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent z-20 pointer-events-none"></div>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex-1 px-8 pb-8 pt-2 space-y-4">
                                    <div className="space-y-1">
                                        <h3 className="text-[17px] font-bold tracking-tight text-white">{site.title}</h3>
                                        <p className="text-zinc-500 text-[13px] line-clamp-2 leading-snug">
                                            {site.conversation?.[0]?.content || "AI generated website"}
                                        </p>
                                    </div>

                                    <div className="flex items-center gap-2 text-zinc-600 text-[11px] font-medium">
                                        Last Updated {formatDate(site.createdAt)}
                                    </div>

                                    <div className="pt-2">
                                        {!site.deployed ? (
                                            <button
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    navigate(`/editor/${site._id}`);
                                                }}
                                                className="w-full py-3 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-black text-xs tracking-wider flex items-center justify-center gap-2 shadow-lg shadow-purple-500/10 active:scale-95 transition-transform uppercase"
                                            >
                                                <Rocket size={14} fill="currentColor" />
                                                Deploy
                                            </button>
                                        ) : (
                                            <button
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    navigator.clipboard.writeText(`${window.location.origin}/live/${site._id}`);
                                                    alert("Share link copied to clipboard!");
                                                }}
                                                className="w-full py-3 rounded-xl bg-zinc-800 text-white font-black text-xs tracking-wider flex items-center justify-center gap-2 shadow-xl active:scale-95 transition-transform uppercase border border-white/5 hover:bg-zinc-700"
                                            >
                                                <Send size={14} className="text-purple-500" />
                                                Share Link
                                            </button>
                                        )}
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                )}
            </main>
        </div>
    );
}

export default Dashboard;
