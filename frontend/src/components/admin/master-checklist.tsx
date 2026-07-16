'use client';

import { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Checkbox } from '@/components/ui/checkbox';
import { 
  CheckSquare, Settings, FolderTree, Database, Globe, Shield, Terminal, 
  Check, Code, TestTubes, CheckCircle2, Circle, Clock, Search, Bot
} from 'lucide-react';
import { TECH_ENCYCLOPEDIA } from '@/data/tech-stack-data';
import { MASTER_CHECKLIST } from '@/data/master-checklist-data';
import { useSearchParams } from 'next/navigation';

const LEVEL_WEIGHTS: Record<string, number> = {
  "MVP": 1,
  "Startup": 2,
  "Professional": 3,
  "Enterprise": 4
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const IconComponents: Record<string, any> = {
  Settings,
  FolderTree,
  Database,
  Globe,
  Shield,
  Terminal,
  CheckCircle2,
  Circle,
  Clock,
  Check,
  Code,
  TestTubes,
  CheckSquare
};

// --- Category auto-detection from section titles ---
const FILTER_CATEGORIES = [
  { key: 'frontend', label: 'Frontend', color: 'text-pink-400 bg-pink-500/10 border-pink-500/30', keywords: ['frontend', 'ui', 'ux', 'design', 'css', 'tailwind', 'react', 'next', 'component', 'storybook'] },
  { key: 'backend', label: 'Backend', color: 'text-green-400 bg-green-500/10 border-green-500/30', keywords: ['backend', 'api', 'server', 'nest', 'fastify', 'express', 'auth', 'jwt', 'edge function', 'trpc', 'graphql'] },
  { key: 'database', label: 'Database', color: 'text-blue-400 bg-blue-500/10 border-blue-500/30', keywords: ['database', 'db', 'postgres', 'prisma', 'supabase', 'migration', 'schema', 'redis', 'cache', 'queue', 'indexing', 'rls'] },
  { key: 'devops', label: 'DevOps', color: 'text-cyan-400 bg-cyan-500/10 border-cyan-500/30', keywords: ['devops', 'ci/cd', 'deploy', 'docker', 'kubernetes', 'k8s', 'github actions', 'eas', 'ota', 'environment', 'hosting', 'dns', 'cdn', 'infra', 'cloud', 'terraform', 'helm', 'gitops'] },
  { key: 'testing', label: 'Testing', color: 'text-yellow-400 bg-yellow-500/10 border-yellow-500/30', keywords: ['testing', 'test', 'vitest', 'jest', 'playwright', 'e2e', 'unit', 'integration', 'load', 'coverage', 'qa', 'accessibility'] },
  { key: 'security', label: 'Security', color: 'text-red-400 bg-red-500/10 border-red-500/30', keywords: ['security', 'auth', 'owasp', 'gdpr', 'compliance', 'privacy', 'ssl', 'cors', 'rate limit', 'helmet', 'vulnerability', 'soc', 'penetration', 'encryption', 'hardening'] },
  { key: 'monitoring', label: 'Monitoring', color: 'text-purple-400 bg-purple-500/10 border-purple-500/30', keywords: ['monitoring', 'observability', 'sentry', 'logging', 'metrics', 'alert', 'uptime', 'apm', 'grafana', 'prometheus', 'incident'] },
  { key: 'mobile', label: 'Mobile', color: 'text-indigo-400 bg-indigo-500/10 border-indigo-500/30', keywords: ['mobile', 'expo', 'react native', 'app store', 'testflight', 'push notification', 'biometric', 'offline', 'aso'] },
  { key: 'payments', label: 'Payments', color: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30', keywords: ['payment', 'stripe', 'billing', 'invoice', 'tax', 'escrow', 'payout', 'refund'] },
] as const;

type FilterKey = typeof FILTER_CATEGORIES[number]['key'];

function detectSectionCategory(sectionTitle: string, phaseTitle: string): FilterKey[] {
  const combined = `${phaseTitle} ${sectionTitle}`.toLowerCase();
  const matches: FilterKey[] = [];
  for (const cat of FILTER_CATEGORIES) {
    if (cat.keywords.some(kw => combined.includes(kw))) {
      matches.push(cat.key);
    }
  }
  return matches; // strict matching without fallback
}

function itemHasCommand(label: string): boolean {
  return label.includes('`') || label.includes('npm ') || label.includes('npx ') || label.includes('docker') || label.includes('$ ');
}

export function MasterChecklist({ aiChecklist, projectName, projectLevel = "MVP", techStack = [] }: { 
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  aiChecklist: any[], projectName: string, projectLevel?: string, techStack?: any[] 
}) {
  const searchParams = useSearchParams();
  const initialCategory = searchParams.get('category') as FilterKey | null;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [localAiChecklist, setLocalAiChecklist] = useState<any[]>(aiChecklist || []);

  const [activeTab, setActiveTab] = useState<string>('ai-tasks');
  const [checkedItems, setCheckedItems] = useState<Record<string, boolean>>({});

  const toggleItem = (key: string) => setCheckedItems(prev => ({ ...prev, [key]: !prev[key] }));
  const toggleAiTask = (taskId: string) => {
    setLocalAiChecklist(prev => prev.map(t => t.id === taskId ? { ...t, status: t.status === 'DONE' ? 'TODO' : 'DONE' } : t));
  };

  // --- Filters ---
  const [activeCategories, setActiveCategories] = useState<Set<FilterKey>>(() => {
    const s = new Set<FilterKey>();
    if (initialCategory && FILTER_CATEGORIES.some(c => c.key === initialCategory)) s.add(initialCategory);
    return s;
  });
  const [searchQuery, setSearchQuery] = useState('');
  const [showCommandsOnly, setShowCommandsOnly] = useState(false);
  const [showRequiredOnly, setShowRequiredOnly] = useState(false);
  const [showOptionalOnly, setShowOptionalOnly] = useState(false);

  const toggleCategory = (key: FilterKey) => {
    setActiveCategories(prev => {
      const next = new Set(prev);
      if (next.has(key)) next.delete(key);
      else next.add(key);
      return next;
    });
  };

  const clearAllFilters = () => {
    setActiveCategories(new Set());
    setSearchQuery('');
    setShowCommandsOnly(false);
    setShowRequiredOnly(false);
    setShowOptionalOnly(false);
  };

  const hasAnyFilter = activeCategories.size > 0 || searchQuery || showCommandsOnly || showRequiredOnly || showOptionalOnly;

  // --- Filter Logic ---
  const baseFilteredPhases = useMemo(() => {
    return MASTER_CHECKLIST
      .filter(phase => (phase.minLevel || 1) <= (LEVEL_WEIGHTS[projectLevel] || 1))
      .map(phase => {
        const filteredSections = phase.sections
          .map(section => {
            const sectionCategories = detectSectionCategory(section.title, phase.title);

            // Strict Section-Level Tech Stack Pruning
            if (techStack && techStack.length > 0) {
              const techNames = techStack.map(t => t.name.toLowerCase());
              
              const hasMobileTool = techNames.some(t => ['react native', 'expo', 'flutter', 'swift', 'kotlin', 'ios', 'android'].some(m => t.includes(m)));
              if (!hasMobileTool && sectionCategories.includes('mobile')) return null;

              const hasCICDTool = techNames.some(t => ['github actions', 'jenkins', 'gitlab', 'docker', 'kubernetes', 'circleci', 'travis', 'argocd', 'terraform'].some(c => t.includes(c)));
              const isCICDSection = section.title.toLowerCase().includes('ci/cd') || phase.title.toLowerCase().includes('ci/cd deep dive');
              if (!hasCICDTool && isCICDSection) return null;

              const hasDatabase = techStack.some(t => (t.category || '').toLowerCase().includes('database') || ['sql', 'mongo', 'redis', 'prisma', 'supabase'].some(db => techNames.some(n => n.includes(db))));
              if (!hasDatabase && sectionCategories.includes('database')) return null;

              const hasTesting = techNames.some(t => ['jest', 'cypress', 'playwright', 'vitest', 'mocha', 'selenium', 'puppeteer'].some(test => t.includes(test)));
              if (!hasTesting && sectionCategories.includes('testing')) return null;

              const hasMonitoring = techNames.some(t => ['sentry', 'datadog', 'new relic', 'grafana', 'prometheus', 'log', 'analytics', 'posthog'].some(m => t.includes(m)));
              if (!hasMonitoring && sectionCategories.includes('monitoring')) return null;

              const hasPayments = techNames.some(t => ['stripe', 'paypal', 'braintree', 'razorpay', 'paddle'].some(p => t.includes(p)));
              if (!hasPayments && sectionCategories.includes('payments')) return null;
            }

            const filteredItems = section.items.filter(item => {
              if (techStack && techStack.length > 0) {
                const userTechNames = techStack.map(t => t.name.toLowerCase());
                const itemText = (item.label + " " + item.desc).toLowerCase();
                let mentionsTech = false;
                let hasMatchingTech = false;

                for (const knownTech of TECH_ENCYCLOPEDIA) {
                  const techName = knownTech.name.toLowerCase();
                  if (techName.length <= 2) continue; 
                  if (itemText.includes(techName)) {
                    mentionsTech = true;
                    if (userTechNames.includes(techName)) hasMatchingTech = true;
                  }
                }
                if (mentionsTech && !hasMatchingTech) return false;
              }
              return true;
            });

            if (filteredItems.length === 0) return null;
            return { ...section, items: filteredItems, _categories: sectionCategories };
          })
          .filter(Boolean) as (typeof phase.sections[number] & { _categories: FilterKey[] })[];

        if (filteredSections.length === 0) return null;
        return { ...phase, sections: filteredSections };
      })
      .filter(Boolean) as (Omit<typeof MASTER_CHECKLIST[number], "sections"> & { sections: (typeof MASTER_CHECKLIST[number]["sections"][number] & { _categories: FilterKey[] })[] })[];
  }, [projectLevel, techStack]);

  const availableCategories = useMemo(() => {
    const set = new Set<FilterKey>();
    baseFilteredPhases.forEach(p => p.sections.forEach(s => s._categories.forEach(c => set.add(c))));
    return set;
  }, [baseFilteredPhases]);

  const finalFilteredPhases = useMemo(() => {
    return baseFilteredPhases.map(phase => {
       const finalSections = phase.sections.map(section => {
          if (activeCategories.size > 0 && !section._categories.some(c => activeCategories.has(c))) return null;

          const finalItems = section.items.filter(item => {
             if (searchQuery) {
               const q = searchQuery.toLowerCase();
               if (!item.label.toLowerCase().includes(q) && !item.desc.toLowerCase().includes(q)) return false;
             }
             if (showCommandsOnly && !itemHasCommand(item.label)) return false;
             if (showRequiredOnly && !item.required) return false;
             if (showOptionalOnly && !item.optional) return false;
             return true;
          });

          if (finalItems.length === 0) return null;
          return { ...section, items: finalItems };
       }).filter(Boolean);

       if (finalSections.length === 0) return null;
       return { ...phase, sections: finalSections };
    }).filter(Boolean) as typeof baseFilteredPhases;
  }, [baseFilteredPhases, activeCategories, searchQuery, showCommandsOnly, showRequiredOnly, showOptionalOnly]);

  const totalFilteredItems = finalFilteredPhases.reduce((acc, p) => acc + p.sections.reduce((a, s) => a + s.items.length, 0), 0);

  // Filter AI tasks using the same search query
  const filteredAiTasks = localAiChecklist.filter(task => {
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      if (!task.title?.toLowerCase().includes(q) && !task.description?.toLowerCase().includes(q)) return false;
    }
    return true;
  });

  return (
    <Card className="bg-zinc-950 border-zinc-800 h-[calc(100vh-120px)] flex flex-col shadow-2xl">
      <CardHeader className="border-b border-zinc-800/60 pb-4 bg-zinc-900/20">
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-3">
              <div className="p-2 bg-orange-500/10 rounded-lg">
                <CheckSquare className="w-5 h-5 text-orange-500" />
              </div>
              <CardTitle className="text-xl tracking-tight text-white">The Master Checklist</CardTitle>
            </div>
            <CardDescription className="mt-2 text-zinc-400">
              Your customized action plan for {projectName} based on the CTO Master Guide.
            </CardDescription>
          </div>
          <div className="hidden md:block">
             <span className="inline-flex items-center rounded-full border border-orange-500/20 bg-orange-500/10 px-2.5 py-0.5 text-xs font-semibold text-orange-400">
              {projectLevel} Tier
            </span>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="flex-1 flex flex-col md:flex-row p-0 overflow-hidden">
        
        {/* --- Sidebar Navigation --- */}
        <div className="w-full md:w-64 border-r border-zinc-800/60 bg-zinc-900/30 flex flex-col shrink-0">
          <div className="flex-1 overflow-y-auto px-3 py-4 scrollbar-thin scrollbar-thumb-zinc-700">
            <div className="space-y-1">
              
              {/* AI Tasks Nav Item */}
              <button
                onClick={() => setActiveTab('ai-tasks')}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${
                  activeTab === 'ai-tasks' 
                    ? 'bg-purple-500/10 text-purple-400 border border-purple-500/20' 
                    : 'text-zinc-400 hover:bg-zinc-800/50 hover:text-zinc-200 border border-transparent'
                }`}
              >
                <Bot className={`w-4 h-4 ${activeTab === 'ai-tasks' ? 'text-purple-400' : 'text-zinc-500'}`} />
                AI Architecture Tasks
                {localAiChecklist.length > 0 && (
                  <span className="ml-auto bg-purple-500/20 text-purple-300 text-[10px] px-1.5 py-0.5 rounded-full">
                    {localAiChecklist.filter(t => t.status === 'DONE').length}/{localAiChecklist.length}
                  </span>
                )}
              </button>

              <div className="my-4 border-t border-zinc-800/60" />
              
              <div className="px-3 pb-2 text-[10px] font-bold uppercase tracking-wider text-zinc-500">
                CTO Foundation Phases
              </div>

              {/* Dynamic Phases Nav Items */}
              {finalFilteredPhases.map((phase, idx) => {
                const isActive = activeTab === phase.id;
                const Icon = IconComponents[phase.iconName] || Settings;
                const cleanTitle = phase.title.replace(/^PART \d+\s*[-—]\s*/i, '');
                
                return (
                  <button
                    key={phase.id}
                    onClick={() => setActiveTab(phase.id)}
                    className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${
                      isActive 
                        ? 'bg-orange-500/10 text-orange-400 border border-orange-500/20' 
                        : 'text-zinc-400 hover:bg-zinc-800/50 hover:text-zinc-200 border border-transparent'
                    }`}
                  >
                    <Icon className={`w-4 h-4 ${isActive ? 'text-orange-400' : 'text-zinc-500'}`} />
                    <span className="truncate text-left flex-1">Phase {idx + 1}: {cleanTitle.split(' ')[0]}</span>
                    
                    {/* Progress indicator */}
                    {(() => {
                      const totalItems = phase.sections.reduce((acc, sec) => acc + sec.items.length, 0);
                      let doneItems = 0;
                      phase.sections.forEach((sec, sIdx) => {
                        sec.items.forEach((_, iIdx) => {
                           if (checkedItems[`${phase.id}-${sIdx}-${iIdx}`]) doneItems++;
                        });
                      });
                      if (doneItems > 0) {
                        return (
                          <span className={`text-[10px] px-1.5 py-0.5 rounded-full ${isActive ? 'bg-orange-500/20 text-orange-300' : 'bg-zinc-800 text-zinc-400'}`}>
                            {doneItems}/{totalItems}
                          </span>
                        );
                      }
                      return null;
                    })()}
                  </button>
                );
              })}

            </div>
          </div>
        </div>

        {/* --- Main Content Area --- */}
        <div className="flex-1 flex flex-col bg-zinc-950 min-w-0">
          
          {/* Top Filter Bar */}
          <div className="border-b border-zinc-800/60 p-4 space-y-3 bg-zinc-900/10">
            <div className="flex items-center gap-2">
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  placeholder="Search tasks..."
                  className="w-full bg-zinc-900 border border-zinc-800 rounded-lg pl-9 pr-3 py-2 text-sm text-zinc-200 placeholder-zinc-600 focus:outline-none focus:border-orange-500/50 transition-colors"
                />
              </div>
              {hasAnyFilter && (
                <button
                  onClick={clearAllFilters}
                  className="text-xs text-zinc-500 hover:text-red-400 transition-colors px-3 py-2 rounded-md hover:bg-red-500/10"
                >
                  Clear filters
                </button>
              )}
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <span className="text-[10px] font-bold text-zinc-600 uppercase tracking-wider mr-2">Filters:</span>
              <button
                onClick={() => setShowCommandsOnly(!showCommandsOnly)}
                className={`text-[11px] font-medium px-2.5 py-1 rounded-full border transition-all ${showCommandsOnly ? 'text-cyan-400 bg-cyan-500/10 border-cyan-500/30' : 'text-zinc-500 border-zinc-800 hover:text-zinc-300'}`}
              >
                ⌘ Commands
              </button>
              <button
                onClick={() => { setShowRequiredOnly(!showRequiredOnly); if (showOptionalOnly) setShowOptionalOnly(false); }}
                className={`text-[11px] font-medium px-2.5 py-1 rounded-full border transition-all ${showRequiredOnly ? 'text-red-400 bg-red-500/10 border-red-500/30' : 'text-zinc-500 border-zinc-800 hover:text-zinc-300'}`}
              >
                Required
              </button>
              <button
                onClick={() => { setShowOptionalOnly(!showOptionalOnly); if (showRequiredOnly) setShowRequiredOnly(false); }}
                className={`text-[11px] font-medium px-2.5 py-1 rounded-full border transition-all ${showOptionalOnly ? 'text-yellow-400 bg-yellow-500/10 border-yellow-500/30' : 'text-zinc-500 border-zinc-800 hover:text-zinc-300'}`}
              >
                Optional
              </button>
              
              <div className="w-px h-4 bg-zinc-800 mx-2" />
              
              {FILTER_CATEGORIES.filter(cat => availableCategories.has(cat.key)).map(cat => {
                const isActive = activeCategories.has(cat.key);
                return (
                  <button
                    key={cat.key}
                    onClick={() => toggleCategory(cat.key)}
                    className={`text-[11px] font-medium px-2.5 py-1 rounded-full border transition-all ${
                      isActive ? `${cat.color} border-current` : 'text-zinc-500 bg-zinc-900 border-zinc-800 hover:border-zinc-700 hover:text-zinc-300'
                    }`}
                  >
                    {cat.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Checklist Items */}
          <div className="flex-1 overflow-y-auto p-6 scrollbar-thin scrollbar-thumb-zinc-700">
            
            {activeTab === 'ai-tasks' && (
              <div className="space-y-6 max-w-4xl pb-12">
                <div className="mb-6">
                  <h2 className="text-2xl font-bold text-white tracking-tight">AI Generated Architecture Tasks</h2>
                  <p className="text-zinc-400 text-sm mt-1">Specific recommendations tailored for your repository's stack.</p>
                </div>

                {filteredAiTasks.length > 0 ? (
                  Object.entries(
                    filteredAiTasks.reduce((acc: any, task: any) => {
                      const cat = task.category || 'Uncategorized';
                      if (!acc[cat]) acc[cat] = [];
                      acc[cat].push(task);
                      return acc;
                    }, {})
                  ).map(([category, tasks]: [string, any], catIdx) => (
                    <div key={catIdx} className="space-y-4">
                      <h3 className="text-xs font-bold text-purple-400 uppercase tracking-widest pl-1 border-b border-zinc-800/50 pb-2">{category}</h3>
                      <div className="grid grid-cols-1 gap-3">
                        {tasks.map((task: any, idx: number) => (
                          <div key={task.id || idx} className="flex items-start gap-4 p-4 bg-zinc-900/50 rounded-xl border border-zinc-800 hover:border-purple-500/30 transition-all group shadow-sm">
                            <Checkbox 
                              checked={task.status === 'DONE'} 
                              onCheckedChange={() => task.id && toggleAiTask(task.id)}
                              className="mt-1 w-5 h-5 border-zinc-700 data-[state=checked]:bg-purple-500 data-[state=checked]:border-purple-500 shrink-0 rounded-[4px]"
                            />
                            <div className="flex flex-col gap-1 w-full">
                              <div className="flex items-start justify-between gap-4">
                                <span className={`text-base font-semibold transition-all ${task.status === 'DONE' ? 'line-through text-zinc-500' : 'text-zinc-200 group-hover:text-purple-300'}`}>
                                  {task.title}
                                </span>
                                {task.relatedTech && task.relatedTech.length > 0 && (
                                  <div className="flex gap-1">
                                    {task.relatedTech.map((tech: string, i: number) => (
                                      <span key={i} className="text-[10px] font-medium bg-zinc-800 text-zinc-300 px-2 py-0.5 rounded border border-zinc-700 whitespace-nowrap">
                                        {tech}
                                      </span>
                                    ))}
                                  </div>
                                )}
                              </div>
                              {task.description && (
                                <p className={`text-sm leading-relaxed mt-1 ${task.status === 'DONE' ? 'text-zinc-600' : 'text-zinc-400'}`}>
                                  {task.description}
                                </p>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center text-zinc-500 py-12 border border-dashed border-zinc-800 rounded-xl bg-zinc-900/20">
                    No custom AI tasks generated or matching your search.
                  </div>
                )}
              </div>
            )}

            {activeTab !== 'ai-tasks' && finalFilteredPhases.map(phase => {
              if (phase.id !== activeTab) return null;
              const cleanTitle = phase.title.replace(/^PART \d+\s*[-—]\s*/i, '');

              return (
                <div key={phase.id} className="space-y-8 max-w-4xl pb-12">
                  <div className="mb-8">
                    <h2 className="text-2xl font-bold text-white tracking-tight">{cleanTitle}</h2>
                    <p className="text-zinc-400 text-sm mt-1">Foundation requirements for standard engineering practices.</p>
                  </div>

                  {phase.sections.map((section, sIdx) => (
                    <div key={sIdx} className="space-y-4">
                      <h3 className="text-sm font-bold text-orange-400/80 uppercase tracking-widest pl-1 border-b border-zinc-800/50 pb-2">
                        {section.title}
                      </h3>
                      <div className="space-y-3">
                        {section.items.map((item, iIdx) => {
                          const itemKey = `${phase.id}-${sIdx}-${iIdx}`;
                          const isChecked = checkedItems[itemKey];
                          const isCmd = itemHasCommand(item.label);
                          
                          return (
                            <div 
                              key={iIdx} 
                              className={`flex items-start gap-4 p-4 rounded-xl border transition-all cursor-pointer group shadow-sm ${
                                isChecked 
                                  ? 'bg-zinc-900/30 border-zinc-800/50' 
                                  : 'bg-zinc-900/80 border-zinc-800 hover:border-orange-500/30 hover:bg-zinc-800/50'
                              }`}
                              onClick={() => toggleItem(itemKey)}
                            >
                              <div className="mt-0.5 shrink-0">
                                <div className={`w-5 h-5 rounded-[4px] border flex items-center justify-center transition-colors ${isChecked ? 'bg-orange-500 border-orange-500' : 'bg-zinc-950 border-zinc-600 group-hover:border-orange-500/50'}`}>
                                  {isChecked && <Check className="w-3.5 h-3.5 text-white" />}
                                </div>
                              </div>
                              <div className="flex flex-col gap-1 w-full">
                                <div className="flex items-center gap-2 flex-wrap mb-1">
                                  {item.required && <span className="text-[10px] font-bold bg-red-500/10 text-red-400 px-1.5 py-0.5 rounded">REQ</span>}
                                  {item.optional && <span className="text-[10px] font-bold bg-yellow-500/10 text-yellow-400 px-1.5 py-0.5 rounded">OPT</span>}
                                  {isCmd && <span className="text-[10px] font-bold bg-cyan-500/10 text-cyan-400 px-1.5 py-0.5 rounded">CMD</span>}
                                </div>
                                <span className={`text-base font-medium transition-all ${isChecked ? 'text-zinc-600 line-through' : 'text-zinc-200 group-hover:text-white'}`}>
                                  {item.label}
                                </span>
                                {item.desc && (
                                  <span className={`text-sm mt-0.5 ${isChecked ? 'text-zinc-700 line-through' : 'text-zinc-400 group-hover:text-zinc-300'}`}>
                                    {item.desc}
                                  </span>
                                )}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  ))}
                </div>
              );
            })}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
