'use client';

import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { ArrowRight, Sparkles, ShieldCheck, Rocket } from 'lucide-react';
import { ProjectWizard } from '../layout/project-wizard';

export function HeroSection() {
  return (
    <div className="relative overflow-hidden bg-zinc-950 pt-24 pb-32">
      {/* Background Gradients */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <div className="absolute top-0 left-1/4 w-[30rem] h-[30rem] bg-blue-500/10 rounded-full blur-[128px]" />
        <div className="absolute bottom-0 right-1/4 w-[30rem] h-[30rem] bg-purple-500/10 rounded-full blur-[128px]" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-8 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mx-auto max-w-3xl"
        >
          <div className="mb-8 flex justify-center">
            <span className="rounded-full bg-zinc-900 px-3 py-1 text-sm font-medium leading-6 text-zinc-300 border border-zinc-800 flex items-center shadow-sm">
              <span className="flex w-2 h-2 rounded-full bg-zinc-400 mr-2 animate-pulse"></span>
              Introducing StackGen V2.0
            </span>
          </div>
          <h1 className="text-4xl font-semibold tracking-tight text-zinc-100 sm:text-6xl mb-6">
            Design, Build, and Ship your SaaS <span className="text-zinc-500">faster than ever.</span>
          </h1>
          <p className="mt-6 text-lg leading-8 text-zinc-400">
            StackGen is your personal AI CTO. It analyzes your ideas, suggests the perfect tech stack, creates a comprehensive architecture checklist, and even scans your GitHub repo to ensure production readiness.
          </p>
          <div className="mt-12 w-full max-w-4xl mx-auto">
             <ProjectWizard />
          </div>
        </motion.div>

        {/* Tech Stack Marquee */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.2 }}
          className="mt-16 sm:mt-24 lg:mt-32 w-full overflow-hidden relative border-t border-zinc-900/50 pt-10"
        >
           {/* Fade edges */}
           <div className="absolute inset-y-0 left-0 w-1/4 bg-gradient-to-r from-zinc-950 to-transparent z-10 pointer-events-none" />
           <div className="absolute inset-y-0 right-0 w-1/4 bg-gradient-to-l from-zinc-950 to-transparent z-10 pointer-events-none" />
           
           <p className="text-center text-[10px] font-bold tracking-[0.2em] text-zinc-600 uppercase mb-8">
             Architecting with the modern stack
           </p>

           <div className="flex relative">
             <motion.div 
               animate={{ x: [0, -1035] }} 
               transition={{ repeat: Infinity, duration: 30, ease: 'linear' }}
               className="flex whitespace-nowrap opacity-40 hover:opacity-100 transition-opacity duration-500 items-center"
             >
               {[
                 'Next.js', 'NestJS', 'PostgreSQL', 'Prisma', 'Tailwind CSS', 'Docker', 'AWS', 'Vercel', 'Supabase', 'Stripe', 'React', 'TypeScript', 'Redis', 'GraphQL',
                 'Next.js', 'NestJS', 'PostgreSQL', 'Prisma', 'Tailwind CSS', 'Docker', 'AWS', 'Vercel', 'Supabase', 'Stripe', 'React', 'TypeScript', 'Redis', 'GraphQL'
               ].map((tech, i) => (
                 <div key={i} className="flex items-center mx-8">
                   <span className="text-xl font-bold text-zinc-300 tracking-tight">{tech}</span>
                   <span className="mx-8 w-1.5 h-1.5 rounded-full bg-zinc-800" />
                 </div>
               ))}
             </motion.div>
           </div>
        </motion.div>
      </div>
    </div>
  );
}
