'use client';

import { motion } from 'framer-motion';
import { Database, Layout, Server, GitBranch, Terminal } from 'lucide-react';

export function ShowcaseSection() {
  return (
    <div className="py-24 sm:py-32 bg-zinc-950 border-t border-zinc-900/50 overflow-hidden relative">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-2xl lg:text-center mb-16">
          <h2 className="text-sm font-semibold leading-7 text-zinc-400 tracking-wide uppercase">How it works</h2>
          <p className="mt-2 text-3xl font-medium tracking-tight text-zinc-100 sm:text-4xl">
            From prompt to production architecture
          </p>
        </div>

        <div className="relative mt-16 max-w-5xl mx-auto flex flex-col md:flex-row items-center justify-between gap-12">
          
          {/* Step 1 */}
          <motion.div 
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6 }}
            className="flex-1 w-full relative"
          >
            <div className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-6 shadow-xl relative z-10 backdrop-blur-sm">
              <div className="flex items-center gap-3 mb-4 border-b border-zinc-800 pb-4">
                <div className="w-8 h-8 rounded bg-zinc-800 flex items-center justify-center">
                  <Terminal className="w-4 h-4 text-zinc-300" />
                </div>
                <h3 className="font-medium text-zinc-200">1. Define</h3>
              </div>
              <div className="space-y-3">
                <div className="h-2 w-3/4 bg-zinc-800 rounded-full animate-pulse" />
                <div className="h-2 w-full bg-zinc-800 rounded-full animate-pulse delay-75" />
                <div className="h-2 w-5/6 bg-zinc-800 rounded-full animate-pulse delay-150" />
              </div>
            </div>
          </motion.div>

          {/* Connector */}
          <motion.div 
            initial={{ opacity: 0, scale: 0 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: 0.3 }}
            className="hidden md:flex h-px flex-1 bg-gradient-to-r from-transparent via-zinc-700 to-transparent relative"
          >
            <motion.div 
              animate={{ x: [0, 100, 0], opacity: [0, 1, 0] }}
              transition={{ repeat: Infinity, duration: 2, ease: "linear" }}
              className="absolute -top-1 left-1/2 w-2 h-2 rounded-full bg-zinc-400"
            />
          </motion.div>

          {/* Step 2 */}
          <motion.div 
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="flex-1 w-full relative"
          >
            <div className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-6 shadow-xl relative z-10 backdrop-blur-sm">
              <div className="flex items-center gap-3 mb-4 border-b border-zinc-800 pb-4">
                <div className="w-8 h-8 rounded bg-zinc-800 flex items-center justify-center">
                  <Layout className="w-4 h-4 text-zinc-300" />
                </div>
                <h3 className="font-medium text-zinc-200">2. Architect</h3>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="h-10 rounded border border-zinc-700/50 bg-zinc-800/30 flex items-center justify-center">
                  <Layout className="w-4 h-4 text-zinc-500" />
                </div>
                <div className="h-10 rounded border border-zinc-700/50 bg-zinc-800/30 flex items-center justify-center">
                  <Server className="w-4 h-4 text-zinc-500" />
                </div>
                <div className="h-10 rounded border border-zinc-700/50 bg-zinc-800/30 flex items-center justify-center col-span-2">
                  <Database className="w-4 h-4 text-zinc-500" />
                </div>
              </div>
            </div>
          </motion.div>

          {/* Connector */}
          <motion.div 
            initial={{ opacity: 0, scale: 0 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: 0.5 }}
            className="hidden md:flex h-px flex-1 bg-gradient-to-r from-transparent via-zinc-700 to-transparent relative"
          >
            <motion.div 
              animate={{ x: [0, 100, 0], opacity: [0, 1, 0] }}
              transition={{ repeat: Infinity, duration: 2, ease: "linear", delay: 1 }}
              className="absolute -top-1 left-1/4 w-2 h-2 rounded-full bg-zinc-400"
            />
          </motion.div>

          {/* Step 3 */}
          <motion.div 
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="flex-1 w-full relative"
          >
            <div className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-6 shadow-xl relative z-10 backdrop-blur-sm">
              <div className="flex items-center gap-3 mb-4 border-b border-zinc-800 pb-4">
                <div className="w-8 h-8 rounded bg-zinc-800 flex items-center justify-center">
                  <GitBranch className="w-4 h-4 text-zinc-300" />
                </div>
                <h3 className="font-medium text-zinc-200">3. Build</h3>
              </div>
              <div className="space-y-2">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full border border-zinc-500" />
                    <div className="h-2 flex-1 bg-zinc-800 rounded-full" />
                  </div>
                ))}
              </div>
            </div>
          </motion.div>

        </div>
      </div>
    </div>
  );
}
