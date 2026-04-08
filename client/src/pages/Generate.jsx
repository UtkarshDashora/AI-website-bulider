import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { motion } from 'motion/react';
import axios from "axios";
import { useDispatch } from 'react-redux';
import { updateCredits } from '../redux/Userslice';
import VantaBackground from '../components/VantaBackground';

function Generate() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [prompt, setPrompt] = useState("");
  const [loading, setLoading] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const thinkingInterval = useRef(null);

  const thinkingSteps = [
    "Analyzing your vision...",
    "Scanning architectural patterns...",
    "Planning layout structure...",
    "Generating premium components...",
    "Applying vibrant color palettes...",
    "Optimizing responsive behavior...",
    "Finalizing high-fidelity code..."
  ];

  const serverUrl = "http://localhost:5000";

  const handleGenerateWebsite = async () => {
    if (!prompt.trim()) return;
    
    try {
      setLoading(true);
      setCurrentStep(0);
      
      // Cycle through thinking steps
      thinkingInterval.current = setInterval(() => {
        setCurrentStep((prev) => (prev + 1) % thinkingSteps.length);
      }, 2000);

      const res = await axios.post(
        `${serverUrl}/api/website/generate`, 
        { prompt }, 
        { withCredentials: true }
      );
      
      if (res.data.success && res.data.id) {
        if (res.data.credits !== undefined) {
          dispatch(updateCredits(res.data.credits));
        }
        navigate(`/editor/${res.data.id}`); 
      } else {
        throw new Error("Website created but no ID returned from server.");
      }

    } catch (error) {
      console.error("Generation failed:", error.response?.data || error.message);
      const errorMsg = error.response?.data?.message || error.message;
      alert(`Failed to generate website: ${errorMsg}`);
    } finally {
      setLoading(false);
      if (thinkingInterval.current) clearInterval(thinkingInterval.current);
    }
  };

  return (
    <VantaBackground>
    <div className="min-h-screen font-sans text-white bg-transparent selection:bg-purple-500/30">
      
      {/* Navbar */}
      <nav className="sticky top-0 z-40 backdrop-blur-xl bg-black/60 border-b border-white/5">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => navigate("/")}
              className="p-2 rounded-xl hover:bg-white/5 border border-white/5 transition-all group"
            >
              <ArrowLeft size={18} className="group-hover:-translate-x-0.5 transition-transform" />
            </button>
            <h1 className="text-xl font-bold tracking-tight">
              Genweb<span className="text-zinc-500 font-normal">.ai</span>
            </h1>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-6 py-20">
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h1 className="text-4xl md:text-6xl font-bold mb-6 tracking-tight leading-tight">
            Build Your Website <br />
            <span className="bg-gradient-to-r from-purple-400 via-blue-400 to-emerald-400 bg-clip-text text-transparent italic leading-[1.2]">
              With Real AI Power
            </span>
          </h1>

          <p className="text-zinc-400 max-w-xl mx-auto text-lg leading-relaxed">
            Describe your vision in detail. Genweb.ai focuses on high-fidelity, 
            production-ready code that matches your brand perfectly.
          </p>
        </motion.div>

        {/* Form Section */}
        <motion.div 
           initial={{ opacity: 0, y: 20 }}
           animate={{ opacity: 1, y: 0 }}
           transition={{ duration: 0.6, delay: 0.2 }}
           className="bg-zinc-900/40 border border-white/10 rounded-[2.5rem] p-8 md:p-12 shadow-2xl backdrop-blur-sm"
        >
          <div className="mb-10">
            <h2 className="text-2xl font-bold mb-3">Describe your website</h2>
            <p className="text-zinc-500">Be specific about the layout, color scheme, and features you want.</p>
          </div>

          <div className="space-y-10">
            <div className="group relative">
              <textarea
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="E.g., I want a modern portfolio website for a digital artist with a dark theme, glassmorphism effects, and a masonry gallery... "
                className="w-full h-64 p-8 rounded-[2rem] bg-black/40 border border-white/5 outline-none resize-none text-base leading-relaxed focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500/10 transition-all placeholder:text-zinc-700 disabled:opacity-50"
                disabled={loading}
              />
            </div>

            <div className="flex flex-col items-center gap-8">
              <motion.button
                whileHover={loading ? {} : { scale: 1.02, y: -2 }}
                whileTap={loading ? {} : { scale: 0.98 }}
                onClick={handleGenerateWebsite}
                disabled={loading || !prompt.trim()}
                className={`w-full md:w-auto px-16 py-5 rounded-2xl font-bold text-lg transition-all shadow-[0_20px_40px_rgba(255,255,255,0.1)] 
                  ${loading || !prompt.trim() ? "bg-zinc-700 text-zinc-400 cursor-not-allowed" : "bg-white text-black hover:bg-zinc-200"}`}
              >
                {loading ? "AI is Building..." : "Generate Website"}
              </motion.button>

              {loading && (
                 <motion.div 
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="w-full max-w-md flex flex-col items-center bg-zinc-900/60 p-6 rounded-3xl border border-white/10 backdrop-blur-xl shadow-2xl relative overflow-hidden"
                 >
                    {/* Animated Progress Bar */}
                    <div className="absolute top-0 left-0 h-1 bg-gradient-to-r from-purple-500 via-blue-500 to-emerald-500 animate-loading-bar w-full" />
                    
                    <span className="text-[10px] text-purple-400 uppercase tracking-[0.3em] font-black mb-3 text-center">
                        AI Model Synchronizing
                    </span>
                    <div className="text-sm text-zinc-100 font-medium text-center animate-pulse">
                        {thinkingSteps[currentStep]}
                    </div>
                 </motion.div>
              )}
            </div>
          </div>
        </motion.div>

      </main>
    </div>
    </VantaBackground>
  );
}

export default Generate;