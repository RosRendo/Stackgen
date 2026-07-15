'use client';

import { useState, useRef, useEffect } from 'react';
import { useProjectStore, ComplexityLevel } from '@/store/project-store';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Zap, Code, Building2, ArrowRight } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { authClient } from '@/lib/auth-client';

export function ProjectWizard() {
  const router = useRouter();
  const { setProjectDetails, setGenerating } = useProjectStore();
  const [name, setName] = useState('');
  const [desc, setDesc] = useState('');
  const [level, setLevel] = useState<ComplexityLevel>('MVP');
  const [isFocused, setIsFocused] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const { data: session } = authClient.useSession();

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${Math.max(60, textareaRef.current.scrollHeight)}px`;
    }
  }, [desc]);

  // Load pending project from localStorage if they got redirected
  useEffect(() => {
    const savedName = localStorage.getItem('pendingProjectName');
    const savedDesc = localStorage.getItem('pendingProjectDesc');
    const savedLevel = localStorage.getItem('pendingProjectLevel');
    if (savedName) setName(savedName);
    if (savedDesc) setDesc(savedDesc);
    if (savedLevel) setLevel(savedLevel as ComplexityLevel);
  }, []);

  const handleGenerate = async () => {
    if (!desc) return;
    
    const finalName = name.trim() || 'Untitled Project';

    if (!session) {
      localStorage.setItem('pendingProjectName', finalName);
      localStorage.setItem('pendingProjectDesc', desc);
      localStorage.setItem('pendingProjectLevel', level);
      router.push('/auth');
      return;
    }

    setProjectDetails(finalName, desc, level);
    setGenerating(true);
    
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/ai/generate-blueprint`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ projectName: finalName, description: desc, level }),
      });
      
      if (!res.ok) {
        if (res.status === 402) {
          const errData = await res.json().catch(() => null);
          alert(errData?.message || "Please upgrade your plan.");
        } else if (res.status === 401) {
          alert("You must be logged in to generate.");
          router.push('/auth');
        } else {
          alert("Failed to generate architecture.");
        }
        setGenerating(false);
        return;
      }
      
      const data = await res.json();
      
      useProjectStore.getState().setGeneratedData({
        techStack: data.techStack || [{ name: 'Next.js', rationale: 'Fallback' }, { name: 'NestJS', rationale: 'Fallback' }],
        checklist: data.checklist || [],
        nodes: data.nodes || [],
        edges: data.edges || []
      });
      useProjectStore.getState().calculateProgress();

      // Save to database
      try {
        await fetch(`${process.env.NEXT_PUBLIC_API_URL}/projects`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include',
          body: JSON.stringify({
            projectName: finalName,
            description: desc,
            level,
            techStack: data.techStack || [{ name: 'Next.js', rationale: 'Fallback' }, { name: 'NestJS', rationale: 'Fallback' }],
            checklist: data.checklist || [],
            architectureNodes: data.nodes || [],
            architectureEdges: data.edges || []
          }),
        });
      } catch (saveErr) {
        console.error('Failed to save project:', saveErr);
      }

      // Clear pending state since we succeeded
      localStorage.removeItem('pendingProjectName');
      localStorage.removeItem('pendingProjectDesc');
      localStorage.removeItem('pendingProjectLevel');

      // Automatically redirect to dashboard so user sees their new project
      router.push('/dashboard');
    } catch (err) {
      console.error('Failed to generate blueprint:', err);
      setGenerating(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleGenerate();
    }
  };

  return (
    <div className="flex flex-col items-center justify-center w-full p-4 max-w-4xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="w-full max-w-3xl flex flex-col items-center"
      >
        <h1 className="text-3xl sm:text-4xl font-medium tracking-tight text-zinc-100 mb-8 text-center">
          What do you want to build?
        </h1>

        <motion.div 
          animate={{
            scale: isFocused ? 1.02 : 1,
            boxShadow: isFocused ? '0 20px 40px -10px rgba(139, 92, 246, 0.15)' : '0 10px 30px -10px rgba(0, 0, 0, 0.3)',
            borderColor: isFocused ? 'rgba(139, 92, 246, 0.3)' : 'rgba(39, 39, 42, 1)'
          }}
          transition={{ type: 'spring', stiffness: 300, damping: 20 }}
          className="w-full bg-zinc-900/50 border border-zinc-800 rounded-3xl p-3 sm:p-4 shadow-2xl relative overflow-hidden group"
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
        >
          {/* Animated Glow Border Effect */}
          <AnimatePresence>
            {isFocused && (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 z-0 pointer-events-none rounded-3xl"
                style={{
                  background: 'linear-gradient(45deg, rgba(59,130,246,0.1), rgba(168,85,247,0.1))',
                  border: '1px solid rgba(168,85,247,0.2)'
                }}
              />
            )}
          </AnimatePresence>

          <div className="flex flex-col gap-2 relative z-10">
            <input
              type="text"
              placeholder="Project Name (e.g. Acme SaaS)"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full bg-transparent border-none text-zinc-100 text-sm font-medium placeholder:text-zinc-500 focus:outline-none px-3 pt-2"
            />
            
            <textarea
              ref={textareaRef}
              placeholder="Describe your application... (e.g. A marketplace for local home services with a booking system and Stripe integration)"
              value={desc}
              onChange={(e) => setDesc(e.target.value)}
              onKeyDown={handleKeyDown}
              className="w-full bg-transparent border-none text-zinc-200 text-base placeholder:text-zinc-600 focus:outline-none resize-none px-3 pb-4 min-h-[60px] max-h-[300px]"
            />
          </div>

          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mt-2 px-1 relative z-10">
            <div className="flex items-center gap-2 overflow-x-auto pb-2 sm:pb-0 scrollbar-hide max-w-full">
              {[
                { id: 'MVP', icon: Zap },
                { id: 'Startup', icon: Code },
                { id: 'Professional', icon: Building2 },
                { id: 'Enterprise', icon: Building2 },
              ].map((lvl) => (
                <button
                  key={lvl.id}
                  onClick={() => setLevel(lvl.id as ComplexityLevel)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-colors ${
                    level === lvl.id
                      ? 'bg-gradient-to-r from-blue-500/20 to-purple-500/20 border border-purple-500/30 text-purple-200'
                      : 'bg-zinc-800/50 text-zinc-400 hover:bg-zinc-800 hover:text-zinc-200 border border-transparent'
                  }`}
                >
                  <lvl.icon className="w-3.5 h-3.5" />
                  {lvl.id}
                </button>
              ))}
            </div>

            <motion.button
              onClick={handleGenerate}
              disabled={!desc}
              whileHover={(!desc) ? {} : { scale: 1.05 }}
              whileTap={(!desc) ? {} : { scale: 0.95 }}
              className={`shrink-0 flex items-center justify-center w-10 h-10 rounded-full transition-all ${
                !desc
                  ? 'bg-zinc-800 text-zinc-500 cursor-not-allowed'
                  : 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg shadow-purple-500/25 border border-purple-400/20'
              }`}
            >
              <ArrowRight className="w-5 h-5" />
            </motion.button>
          </div>
        </motion.div>
        
        <p className="text-zinc-500 text-xs mt-6 text-center max-w-md">
          StackGen will instantly design your tech stack, generate a master checklist, and architect your database schema.
        </p>
      </motion.div>
    </div>
  );
}
