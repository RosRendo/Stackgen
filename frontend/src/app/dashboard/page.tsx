'use client';

import { useProjectStore } from '@/store/project-store';
import { ProjectWizard } from '@/components/layout/project-wizard';
import { ProjectDashboard } from '@/components/layout/project-dashboard';
import { AiChatPanel } from '@/components/layout/ai-chat-panel';
import { Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { authClient } from '@/lib/auth-client';

export default function DashboardPage() {
  const { projectName, isGenerating } = useProjectStore();
  const { data: session } = authClient.useSession();

  return (
    <AnimatePresence mode="wait">
      {!projectName ? (
        <motion.div key="wizard" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="flex-1 flex flex-col items-center justify-center w-full h-full">
          <ProjectWizard />
        </motion.div>
      ) : isGenerating ? (
        <motion.div key="loading" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex-1 flex flex-col items-center justify-center min-h-[60vh] gap-4">
          <Loader2 className="w-12 h-12 text-blue-500 animate-spin" />
          <h2 className="text-2xl font-semibold text-zinc-200">Architecting your solution...</h2>
          <p className="text-zinc-400">Our AI CTO is designing the optimal stack and workflow.</p>
        </motion.div>
      ) : (
        <motion.div key="dashboard" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="h-full flex flex-col relative">
          <div className="flex-1 overflow-hidden relative">
            <ProjectDashboard />
            <AiChatPanel />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
