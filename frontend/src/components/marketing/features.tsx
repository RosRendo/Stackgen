'use client';

import { motion } from 'framer-motion';
import { CheckSquare, Shield, GitBranch, Database, Layout, Server, Globe, Check, Terminal } from 'lucide-react';

export function FeaturesSection() {
  return (
    <div id="features" className="py-32 bg-zinc-950 relative overflow-hidden">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-2xl lg:text-center mb-20">
          <h2 className="text-sm font-bold leading-7 text-zinc-400 tracking-widest uppercase">Ship faster, ship better</h2>
          <p className="mt-2 text-3xl font-medium tracking-tight text-zinc-100 sm:text-5xl">
            Everything you need to build a successful SaaS
          </p>
          <p className="mt-6 text-lg leading-8 text-zinc-400">
            Stop guessing what technologies to use. Follow a proven blueprint and use our AI tools to validate your work every step of the way.
          </p>
        </div>

        <div className="mx-auto max-w-7xl">
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-3 lg:grid-rows-2">
            
            {/* Feature 1: Architecture Generation (Large) */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-50px" }} transition={{ duration: 0.5 }}
              whileHover={{ scale: 1.01 }}
              className="lg:col-span-2 relative overflow-hidden rounded-3xl border border-zinc-800 bg-gradient-to-br from-zinc-900 to-zinc-950 shadow-sm transition-all hover:shadow-2xl hover:shadow-blue-500/10 hover:border-zinc-700 group flex flex-col md:flex-row"
            >
              <div className="absolute top-0 right-0 w-64 h-64 rounded-full blur-[80px] bg-blue-500/5 opacity-0 group-hover:opacity-100 transition duration-500 translate-x-1/2 -translate-y-1/2" />
              
              <div className="p-8 flex flex-col justify-between z-10 w-full md:w-1/2">
                <div>
                  <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-xl bg-zinc-900 border border-zinc-700 shadow-inner group-hover:bg-zinc-800 transition-colors">
                    <Layout className="h-6 w-6 text-zinc-300 group-hover:text-blue-400 transition-colors" />
                  </div>
                  <h3 className="text-xl font-semibold text-zinc-100 mb-2">AI Architecture Generation</h3>
                  <p className="text-zinc-400 text-sm leading-relaxed group-hover:text-zinc-300 transition-colors">
                    Describe your app, and our AI CTO will suggest the perfect frontend, backend, database, and hosting stack tailored to your exact needs. No more guessing—start building on solid ground.
                  </p>
                </div>
              </div>

              {/* Graphic container */}
              <div className="relative w-full md:w-1/2 min-h-[250px] bg-zinc-950/50 border-t md:border-t-0 md:border-l border-zinc-800/50 p-6 flex items-center justify-center overflow-hidden">
                <div className="relative w-full max-w-[280px] h-[200px]">
                  {/* Lines */}
                  <svg className="absolute inset-0 w-full h-full" style={{ zIndex: 0 }}>
                    <motion.path 
                      d="M140,40 L140,80 L70,80 L70,140 M140,80 L210,80 L210,140" 
                      stroke="rgba(255,255,255,0.1)" strokeWidth="2" fill="none" strokeDasharray="4 4"
                      initial={{ pathLength: 0 }}
                      whileInView={{ pathLength: 1 }}
                      transition={{ duration: 1.5, repeat: Infinity, repeatType: "loop", ease: "linear" }}
                    />
                  </svg>
                  {/* Nodes */}
                  <div className="absolute top-0 left-1/2 -translate-x-1/2 z-10 w-28 p-2 rounded-lg bg-zinc-900 border border-zinc-700 shadow-lg flex items-center gap-2 group-hover:border-blue-500/50 transition-colors">
                    <Globe className="w-4 h-4 text-zinc-400" />
                    <span className="text-[10px] font-medium text-zinc-200">Next.js Client</span>
                  </div>
                  <div className="absolute bottom-6 left-4 z-10 w-24 p-2 rounded-lg bg-zinc-900 border border-zinc-700 shadow-lg flex flex-col gap-1 group-hover:border-purple-500/50 transition-colors">
                    <Server className="w-4 h-4 text-zinc-400" />
                    <span className="text-[10px] font-medium text-zinc-200">NestJS API</span>
                  </div>
                  <div className="absolute bottom-6 right-4 z-10 w-24 p-2 rounded-lg bg-zinc-900 border border-zinc-700 shadow-lg flex flex-col gap-1 group-hover:border-orange-500/50 transition-colors">
                    <Database className="w-4 h-4 text-zinc-400" />
                    <span className="text-[10px] font-medium text-zinc-200">PostgreSQL</span>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Feature 2: Checklist (Small) */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-50px" }} transition={{ duration: 0.5, delay: 0.1 }}
              whileHover={{ scale: 1.01 }}
              className="lg:col-span-1 relative overflow-hidden rounded-3xl border border-zinc-800 bg-zinc-950 shadow-sm transition-all hover:shadow-2xl hover:shadow-purple-500/10 hover:border-zinc-700 group flex flex-col"
            >
              <div className="absolute top-0 right-0 w-64 h-64 rounded-full blur-[80px] bg-purple-500/5 opacity-0 group-hover:opacity-100 transition duration-500 translate-x-1/2 -translate-y-1/2" />
              
              <div className="p-8 flex-1 z-10">
                <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-xl bg-zinc-900 border border-zinc-700 shadow-inner group-hover:bg-zinc-800 transition-colors">
                  <CheckSquare className="h-6 w-6 text-zinc-300 group-hover:text-purple-400 transition-colors" />
                </div>
                <h3 className="text-xl font-semibold text-zinc-100 mb-2">Master Checklist</h3>
                <p className="text-zinc-400 text-sm leading-relaxed group-hover:text-zinc-300 transition-colors">
                  Track your progress from wireframing to CI/CD setup, ensuring every best practice is followed.
                </p>
              </div>

              {/* Graphic */}
              <div className="h-[140px] bg-zinc-900/40 border-t border-zinc-800/50 p-6 flex flex-col gap-3 relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-1 bg-zinc-800">
                  <motion.div 
                    className="h-full bg-purple-500"
                    initial={{ width: "30%" }}
                    whileHover={{ width: "100%" }}
                    transition={{ duration: 1 }}
                  />
                </div>
                {[1, 2, 3].map((i) => (
                  <motion.div 
                    key={i} 
                    className="flex items-center gap-3 bg-zinc-900 border border-zinc-800 rounded-md p-2 shadow-sm"
                    initial={{ x: 0 }}
                    whileHover={{ x: 5, transition: { delay: i * 0.1 } }}
                  >
                    <div className={`w-4 h-4 rounded border flex items-center justify-center ${i === 1 ? 'bg-purple-500/20 border-purple-500' : 'bg-zinc-950 border-zinc-700'}`}>
                      {i === 1 && <Check className="w-3 h-3 text-purple-500" />}
                    </div>
                    <div className={`h-2 rounded-full ${i === 1 ? 'w-full bg-zinc-700' : 'w-3/4 bg-zinc-600'}`} />
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* Feature 3: Scanner (Small) */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-50px" }} transition={{ duration: 0.5, delay: 0.2 }}
              whileHover={{ scale: 1.01 }}
              className="lg:col-span-1 relative overflow-hidden rounded-3xl border border-zinc-800 bg-zinc-950 shadow-sm transition-all hover:shadow-2xl hover:shadow-green-500/10 hover:border-zinc-700 group flex flex-col"
            >
              <div className="absolute top-0 right-0 w-64 h-64 rounded-full blur-[80px] bg-green-500/5 opacity-0 group-hover:opacity-100 transition duration-500 translate-x-1/2 -translate-y-1/2" />
              
              <div className="p-8 flex-1 z-10">
                <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-xl bg-zinc-900 border border-zinc-700 shadow-inner group-hover:bg-zinc-800 transition-colors">
                  <GitBranch className="h-6 w-6 text-zinc-300 group-hover:text-green-400 transition-colors" />
                </div>
                <h3 className="text-xl font-semibold text-zinc-100 mb-2">GitHub Scanner</h3>
                <p className="text-zinc-400 text-sm leading-relaxed group-hover:text-zinc-300 transition-colors">
                  Connect your public repository and get an instant production-readiness score and security audit.
                </p>
              </div>

              {/* Graphic */}
              <div className="h-[140px] bg-zinc-900/40 border-t border-zinc-800/50 p-6 flex flex-col justify-center font-mono text-[10px] leading-relaxed relative overflow-hidden text-zinc-500">
                <motion.div
                  initial={{ opacity: 0.5 }}
                  whileHover={{ opacity: 1 }}
                >
                  <p><span className="text-zinc-400">$</span> stackgen scan ./repo</p>
                  <motion.p initial={{ opacity: 0 }} whileHover={{ opacity: 1 }} transition={{ delay: 0.2 }} className="text-zinc-400 mt-2">Analyzing dependencies...</motion.p>
                  <motion.p initial={{ opacity: 0 }} whileHover={{ opacity: 1 }} transition={{ delay: 0.4 }} className="text-zinc-400">Checking security rules...</motion.p>
                  <motion.p initial={{ opacity: 0 }} whileHover={{ opacity: 1 }} transition={{ delay: 0.6 }} className="text-green-400 mt-2">✓ Production Readiness: 98/100</motion.p>
                </motion.div>
              </div>
            </motion.div>

            {/* Feature 4: Database (Large) */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-50px" }} transition={{ duration: 0.5, delay: 0.3 }}
              whileHover={{ scale: 1.01 }}
              className="lg:col-span-2 relative overflow-hidden rounded-3xl border border-zinc-800 bg-gradient-to-tr from-zinc-900 to-zinc-950 shadow-sm transition-all hover:shadow-2xl hover:shadow-orange-500/10 hover:border-zinc-700 group flex flex-col md:flex-row-reverse"
            >
              <div className="absolute top-0 right-0 w-64 h-64 rounded-full blur-[80px] bg-orange-500/5 opacity-0 group-hover:opacity-100 transition duration-500 translate-x-1/2 -translate-y-1/2" />
              
              <div className="p-8 flex flex-col justify-between z-10 w-full md:w-1/2">
                <div>
                  <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-xl bg-zinc-900 border border-zinc-700 shadow-inner group-hover:bg-zinc-800 transition-colors">
                    <Database className="h-6 w-6 text-zinc-300 group-hover:text-orange-400 transition-colors" />
                  </div>
                  <h3 className="text-xl font-semibold text-zinc-100 mb-2">Database Schema Design</h3>
                  <p className="text-zinc-400 text-sm leading-relaxed group-hover:text-zinc-300 transition-colors">
                    Automatically generate normalized relational database schemas with suggested constraints, relationships, and row-level security policies out of the box.
                  </p>
                </div>
              </div>

              {/* Graphic */}
              <div className="relative w-full md:w-1/2 min-h-[250px] bg-zinc-950/50 border-t md:border-t-0 md:border-r border-zinc-800/50 p-6 flex items-center justify-center overflow-hidden">
                <div className="flex items-start gap-8 z-10 relative">
                  {/* Table 1 */}
                  <motion.div 
                    whileHover={{ y: -5 }}
                    className="w-32 bg-zinc-900 border border-zinc-700 rounded-lg shadow-xl overflow-hidden"
                  >
                    <div className="bg-zinc-800 px-3 py-2 text-[10px] font-bold text-zinc-200 border-b border-zinc-700">users</div>
                    <div className="p-2 space-y-1">
                      <div className="flex justify-between text-[9px]"><span className="text-orange-400 font-mono">id (PK)</span> <span className="text-zinc-500">uuid</span></div>
                      <div className="flex justify-between text-[9px]"><span className="text-zinc-300">email</span> <span className="text-zinc-500">text</span></div>
                      <div className="flex justify-between text-[9px]"><span className="text-zinc-300">created</span> <span className="text-zinc-500">date</span></div>
                    </div>
                  </motion.div>

                  {/* Connecting Line */}
                  <svg className="absolute top-8 left-32 w-12 h-20" style={{ zIndex: -1 }}>
                    <path d="M0,0 L20,0 L20,60 L48,60" fill="none" stroke="#4b5563" strokeWidth="1.5" strokeDasharray="3 3" />
                  </svg>

                  {/* Table 2 */}
                  <motion.div 
                    whileHover={{ y: -5 }}
                    className="w-32 bg-zinc-900 border border-zinc-700 rounded-lg shadow-xl overflow-hidden mt-12"
                  >
                    <div className="bg-zinc-800 px-3 py-2 text-[10px] font-bold text-zinc-200 border-b border-zinc-700">projects</div>
                    <div className="p-2 space-y-1">
                      <div className="flex justify-between text-[9px]"><span className="text-orange-400 font-mono">id (PK)</span> <span className="text-zinc-500">uuid</span></div>
                      <div className="flex justify-between text-[9px]"><span className="text-purple-400 font-mono">user_id</span> <span className="text-zinc-500">uuid</span></div>
                      <div className="flex justify-between text-[9px]"><span className="text-zinc-300">name</span> <span className="text-zinc-500">text</span></div>
                    </div>
                  </motion.div>
                </div>
              </div>
            </motion.div>

            {/* Feature 5: Security (Full width banner) */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-50px" }} transition={{ duration: 0.5, delay: 0.4 }}
              whileHover={{ scale: 1.01 }}
              className="lg:col-span-3 relative overflow-hidden rounded-3xl border border-zinc-800 bg-zinc-900/50 shadow-sm transition-all hover:shadow-2xl hover:shadow-cyan-500/10 hover:border-zinc-700 group flex flex-col md:flex-row items-center gap-6"
            >
              <div className="absolute top-1/2 left-1/2 w-full h-64 rounded-full blur-[100px] bg-cyan-500/5 opacity-0 group-hover:opacity-100 transition duration-500 -translate-x-1/2 -translate-y-1/2" />
              
              <div className="p-8 flex-1 z-10 w-full md:w-1/2 order-2 md:order-1 text-center md:text-left">
                <div className="mb-6 mx-auto md:mx-0 flex h-12 w-12 items-center justify-center rounded-xl bg-zinc-900 border border-zinc-700 shadow-inner group-hover:bg-zinc-800 transition-colors">
                  <Shield className="h-6 w-6 text-zinc-300 group-hover:text-cyan-400 transition-colors" />
                </div>
                <h3 className="text-xl font-semibold text-zinc-100 mb-2">Security First & Enterprise Ready</h3>
                <p className="text-zinc-400 text-sm leading-relaxed group-hover:text-zinc-300 transition-colors max-w-xl mx-auto md:mx-0">
                  Built-in checklists and architectural scanners to ensure you are compliant, secure, and ready for real users without fear of basic exploits. Ship with absolute confidence.
                </p>
              </div>

              {/* Graphic */}
              <div className="relative w-full md:w-1/2 min-h-[200px] border-b md:border-b-0 md:border-l border-zinc-800/50 p-6 flex items-center justify-center overflow-hidden order-1 md:order-2">
                <div className="relative flex items-center justify-center w-32 h-32">
                  <motion.div 
                    animate={{ rotate: 360 }}
                    transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                    className="absolute inset-0 rounded-full border border-zinc-700/50 border-t-cyan-500/50"
                  />
                  <motion.div 
                    animate={{ rotate: -360 }}
                    transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
                    className="absolute inset-4 rounded-full border border-zinc-700/50 border-b-cyan-500/50"
                  />
                  <div className="w-16 h-16 rounded-full bg-zinc-900 border border-zinc-700 flex items-center justify-center shadow-[0_0_30px_rgba(6,182,212,0.1)] group-hover:shadow-[0_0_40px_rgba(6,182,212,0.2)] transition-shadow">
                    <Shield className="w-8 h-8 text-cyan-500" />
                  </div>
                </div>
              </div>
            </motion.div>

          </div>
        </div>
      </div>
    </div>
  );
}
