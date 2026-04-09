import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Rocket, Code2, Monitor, Smartphone, Tablet, Send, CheckCircle2, Loader2, Globe } from 'lucide-react';
import axios from 'axios';
import { motion } from 'motion/react';
import { getImageFixerScript } from '../utils/imageFixer';
import { useDispatch } from 'react-redux';
import { updateCredits } from '../redux/Userslice';
import { serverUrl } from '../App';
const serverUrl = "https://ai-website-bulider1.onrender.com";

function Editor() {
    const { id } = useParams();
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [website, setWebsite] = useState(null);
    const [error, setError] = useState("");
    const [prompt, setPrompt] = useState("");
    const [isEditing, setIsEditing] = useState(false);
    const iframeRef = useRef(null);
    const [isThinking, setIsThinking] = useState(false);
    const [currentStep, setCurrentStep] = useState(0);
    const thinkingInterval = useRef(null);

    // Interactivity states
    const [viewMode, setViewMode] = useState('preview'); // 'preview' | 'code'
    const [deviceSize, setDeviceSize] = useState('desktop'); // 'desktop' | 'tablet' | 'mobile'
    const [isDeploying, setIsDeploying] = useState(false);
    const [isDeployed, setIsDeployed] = useState(false);

    const thinkingSteps = [
        "Analyzing your request...",
        "Scanning existing code...",
        "Planning layout refinements...",
        "Applying modern styling...",
        "Optimizing responsiveness...",
        "Finalizing the design..."
    ];

    useEffect(() => {
        const fetchWebsite = async () => {
            try {
                const res = await axios.get(`${serverUrl}/api/website/get-by-id/${id}`, {
                    withCredentials: true
                });
                if (res.data.success) {
                    setWebsite(res.data.website);
                }
            } catch (err) {
                console.error("Fetch Website Error:", err);
                setError(err.response?.data?.message || "Failed to load website");
            }
        };
        fetchWebsite();
    }, [id]);

    const handleEdit = async () => {
        if (!prompt) return;
        setIsEditing(true);
        setIsThinking(true);
        setCurrentStep(0);

        // Cycle through thinking steps
        thinkingInterval.current = setInterval(() => {
            setCurrentStep((prev) => (prev + 1) % thinkingSteps.length);
        }, 1800);

        try {
            const res = await axios.post(`${serverUrl}/api/website/edit/${id}`, { prompt }, {
                withCredentials: true
            });
            if (res.data.success) {
                if (res.data.credits !== undefined) {
                    dispatch(updateCredits(res.data.credits));
                }
                setWebsite(res.data.website);
                setPrompt("");
            }
        } catch (err) {
            console.error("Edit Error:", err);
            alert(err.response?.data?.message || "Failed to edit website");
        } finally {
            setIsEditing(false);
            setIsThinking(false);
            if (thinkingInterval.current) clearInterval(thinkingInterval.current);
        }
    };

    const handleDeploy = async () => {
        setIsDeploying(true);
        try {
            const res = await axios.post(`${serverUrl}/api/website/deploy/${id}`, {}, {
                withCredentials: true
            });
            if (res.data.success) {
                setWebsite(res.data.website);
                setIsDeployed(true);
                setTimeout(() => setIsDeployed(false), 5000);
            }
        } catch (err) {
            console.error("Deploy Error:", err);
            alert("Failed to deploy website");
        } finally {
            setIsDeploying(false);
        }
    };

    const toggleDevice = () => {
        const sizes = ['desktop', 'tablet', 'mobile'];
        const currentIdx = sizes.indexOf(deviceSize);
        setDeviceSize(sizes[(currentIdx + 1) % sizes.length]);
    };

    const getDeviceWidth = () => {
        if (deviceSize === 'mobile') return '375px';
        if (deviceSize === 'tablet') return '768px';
        return '100%';
    };

    useEffect(() => {
        if (!iframeRef.current || !website?.latestCode || viewMode !== 'preview') return;
        
        const scripts = `
            <script>
                ${getImageFixerScript(website?.title || "")}
            </script>
        `;

        let finalCode = website.latestCode;
        if (/<\/body>/i.test(finalCode)) {
            finalCode = finalCode.replace(/<\/body>/i, `${scripts}</body>`);
        } else if (/<\/html>/i.test(finalCode)) {
            finalCode = finalCode.replace(/<\/html>/i, `${scripts}</html>`);
        } else {
            finalCode = `<!DOCTYPE html><html><head><script src="https://cdn.tailwindcss.com"></script><script src="https://unpkg.com/lucide@latest"></script></head><body>${finalCode}${scripts}</body></html>`;
        }

        const blob = new Blob([finalCode], { type: "text/html" });
        const url = URL.createObjectURL(blob);
        iframeRef.current.src = url;
        return () => URL.revokeObjectURL(url);
    }, [website?.latestCode, viewMode]);

    if (error) {
        return <div className="h-screen flex items-center justify-center bg-black text-red-400">{error}</div>;
    }

    if (!website) {
        return <div className="h-screen flex items-center justify-center bg-black text-white">Loading website...</div>;
    }

    return (
        <div className="h-screen w-screen bg-black text-white overflow-hidden flex flex-col font-sans">
            {/* Unified Top Header Bar */}
            <header className="h-14 px-6 flex justify-between items-center bg-black border-b border-white/5 shrink-0 relative">
                <div className="flex items-center gap-4">
                    <span className="text-sm font-semibold tracking-tight">{website?.title}</span>
                </div>

                <div className="absolute left-1/2 -translate-x-1/2">
                    <span className="text-zinc-700 text-[10px] font-bold uppercase tracking-[0.2em]">{viewMode === 'preview' ? 'Live Preview' : 'Raw Source'}</span>
                </div>

                <div className="flex items-center gap-4">
                    {!website?.deployed ? (
                        <button 
                            onClick={handleDeploy}
                            disabled={isDeploying}
                            className={`flex items-center gap-2 px-6 py-1.5 rounded-xl text-sm font-bold transition shadow-lg ${
                                isDeployed 
                                ? "bg-emerald-600 text-white" 
                                : "bg-purple-600 text-white hover:bg-purple-700 shadow-purple-500/20"
                            }`}
                        >
                            {isDeploying ? (
                                <Loader2 size={14} className="animate-spin" />
                            ) : isDeployed ? (
                                <CheckCircle2 size={14} />
                            ) : (
                                <Rocket size={14} />
                            )}
                            {isDeploying ? "Deploying..." : isDeployed ? "Deployed!" : "Deploy"}
                        </button>
                    ) : (
                        <button 
                            onClick={() => {
                                navigator.clipboard.writeText(`${window.location.origin}/live/${id}`);
                                setIsDeployed(true);
                                setTimeout(() => setIsDeployed(false), 3000);
                            }}
                            className={`flex items-center gap-2 px-6 py-1.5 rounded-xl text-sm font-bold transition shadow-lg ${
                                isDeployed 
                                ? "bg-emerald-600 text-white" 
                                : "bg-zinc-800 text-white hover:bg-zinc-700 shadow-xl"
                            }`}
                        >
                            {isDeployed ? <CheckCircle2 size={14} /> : <Send size={14} />}
                            {isDeployed ? "Link Copied!" : "Share Link"}
                        </button>
                    )}
                    <div className="flex gap-2 text-zinc-400">
                        <button 
                            onClick={() => window.open(`/live/${id}`, '_blank')}
                            className="p-1.5 hover:text-white transition rounded-lg hover:bg-zinc-800"
                            title="View Live Site"
                        >
                            <Globe size={18} />
                        </button>
                        <button 
                            onClick={() => setViewMode(prev => prev === 'preview' ? 'code' : 'preview')}
                            className={`p-1.5 hover:text-white transition rounded-lg ${viewMode === 'code' ? 'bg-zinc-800 text-white' : ''}`}
                            title="Toggle Code View"
                        >
                            <Code2 size={18} />
                        </button>
                        <button 
                            onClick={toggleDevice}
                            className={`p-1.5 hover:text-white transition rounded-lg ${deviceSize !== 'desktop' ? 'bg-zinc-800 text-white' : ''}`}
                            title={`Switch to ${deviceSize === 'desktop' ? 'Tablet' : deviceSize === 'tablet' ? 'Mobile' : 'Desktop'}`}
                        >
                            {deviceSize === 'mobile' ? <Smartphone size={18} /> : deviceSize === 'tablet' ? <Tablet size={18} /> : <Monitor size={18} />}
                        </button>
                    </div>
                </div>
            </header>

            <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
                {/* Sidebar - Chat Area */}
                <aside className="w-full md:w-80 h-[320px] md:h-full flex flex-col bg-black border-b md:border-b-0 md:border-r border-white/5 overflow-hidden shrink-0">
                    <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-6 scrollbar-hide">
                        {website?.conversation?.map((msg, i) => (
                            <motion.div
                                initial={{ opacity: 0, y: 5 }}
                                animate={{ opacity: 1, y: 0 }}
                                key={i}
                                className={`flex flex-col ${msg.role === "user" ? "items-end" : "items-start"}`}
                            >
                                <div
                                    className={`max-w-[90%] md:max-w-[100%] px-4 md:px-5 py-2.5 md:py-3 rounded-2xl text-sm leading-relaxed ${msg.role === "user"
                                        ? "bg-zinc-800 text-zinc-100"
                                        : "bg-zinc-900 text-zinc-300 shadow-xl"
                                        }`}
                                >
                                    {msg.content}
                                </div>
                            </motion.div>
                        ))}
                        {isThinking && (
                            <div className="flex flex-col items-start bg-zinc-900/50 p-4 rounded-xl border border-white/5 animate-pulse backdrop-blur-sm">
                                <span className="text-[10px] text-purple-400 uppercase tracking-[0.2em] font-black mb-1">
                                    AI is Thinking
                                </span>
                                <div className="text-xs text-zinc-400 italic">
                                    {thinkingSteps[currentStep]}
                                </div>
                            </div>
                        )}
                    </div>

                    <div className="p-4 md:p-6 bg-black">
                        <div className="relative group">
                            <textarea
                                value={prompt}
                                onChange={(e) => setPrompt(e.target.value)}
                                placeholder="Edit your website..."
                                className="w-full bg-zinc-900 text-zinc-200 text-sm p-4 rounded-2xl outline-none border border-white/5 focus:border-purple-500/30 transition-all resize-none shadow-2xl h-24 scrollbar-hide"
                                disabled={isEditing}
                            />
                            <button
                                onClick={handleEdit}
                                disabled={isEditing || !prompt}
                                className="absolute bottom-3 right-3 p-2 rounded-xl bg-purple-600 text-white hover:bg-purple-700 transition disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-purple-500/20 scale-90 hover:scale-100 active:scale-95"
                            >
                                <Send size={16} />
                            </button>
                        </div>
                    </div>
                </aside>

                {/* Main Preview Area */}
                <main className="flex-1 bg-zinc-950 relative overflow-hidden flex flex-col items-center justify-center p-4 md:p-8">
                    <div 
                        style={{ width: getDeviceWidth() }}
                        className="h-full bg-white rounded-t-2xl shadow-2xl overflow-hidden transition-all duration-500 ease-in-out relative border-x border-t border-white/10"
                    >
                        {viewMode === 'preview' ? (
                            <iframe
                                ref={iframeRef}
                                className="w-full h-full border-none"
                                title="Live Preview"
                            />
                        ) : (
                            <div className="w-full h-full bg-[#1e1e1e] overflow-auto p-8 font-mono text-sm text-zinc-300 selection:bg-purple-500/30">
                                <pre className="whitespace-pre-wrap break-all uppercase text-[10px] text-zinc-500 font-bold mb-4 tracking-widest">Raw Source Code</pre>
                                <pre className="whitespace-pre-wrap">{website.latestCode}</pre>
                            </div>
                        )}
                        
                        {/* Status Overlay */}
                        <div className="absolute top-4 right-4 flex gap-2">
                           {isDeployed && (
                               <motion.div 
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    className="px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-[10px] font-black uppercase text-emerald-400 tracking-widest flex items-center gap-2 backdrop-blur-md"
                               >
                                   <Globe size={10} />
                                   Live on Edge
                               </motion.div>
                           )}
                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
}

export default Editor;
