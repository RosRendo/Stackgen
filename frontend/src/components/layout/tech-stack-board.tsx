'use client';

import { useState, useEffect, useMemo } from 'react';
import { TechItem, useProjectStore, ComplexityLevel, ProjectTask } from '@/store/project-store';
import { TECH_ENCYCLOPEDIA, TECH_CATEGORIES, TechEntry } from '@/data/tech-stack-data';
import { validateTechAddition, TIER_RECOMMENDATIONS } from '@/data/tech-templates';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Check, Search, X, ChevronDown, ChevronRight } from 'lucide-react';

export function TechStackBoard() {
  const techStack = useProjectStore(state => state.techStack);
  const setGeneratedData = useProjectStore(state => state.setGeneratedData);
  const checklist = useProjectStore(state => state.checklist);
  const nodes = useProjectStore(state => state.architectureNodes);
  const edges = useProjectStore(state => state.architectureEdges);
  const complexity = useProjectStore(state => state.complexity);
  const setComplexity = useProjectStore(state => state.setComplexity);

  // Selected tech IDs (by name, since that's unique enough)
  const selectedTech = useMemo(() => new Set(techStack.map(t => t.name)), [techStack]);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [expandedSubcats, setExpandedSubcats] = useState<Set<string>>(new Set());
  const [isMounted, setIsMounted] = useState(false);
  const [toastError, setToastError] = useState<string | null>(null);

  // eslint-disable-next-line react-hooks/set-state-in-effect
  useEffect(() => { setIsMounted(true); }, []);

  const triggerError = (msg: string) => {
    setToastError(msg);
    setTimeout(() => setToastError(null), 3500);
  };



  const toggleTech = (name: string) => {
    const existingIdx = techStack.findIndex(t => t.name === name);
    
    if (existingIdx >= 0) {
      // Remove it
      const newStack = [...techStack];
      newStack.splice(existingIdx, 1);
      setGeneratedData({ techStack: newStack, checklist, nodes, edges });
    } else {
      // Validation Check
      const currentNames = techStack.map(t => t.name);
      const validation = validateTechAddition(name, complexity, currentNames);
      
      if (!validation.valid) {
        triggerError(validation.error!);
        return;
      }

      // Find in encyclopedia
      const entry = TECH_ENCYCLOPEDIA.find(e => e.name === name);
      // Add it
      const newTech: TechItem = {
        // eslint-disable-next-line react-hooks/purity
        id: Math.random().toString(36).substr(2, 9),
        name,
        rationale: entry ? `${entry.subcategory} — ${entry.category}` : 'Selected from encyclopedia',
        simpleIconSlug: entry?.slug,
        category: ((): TechItem['category'] => {
          const cat = entry?.category || '';
          const sub = entry?.subcategory || '';
          if (cat === 'Web Frontend' || cat === 'Mobile' || cat === 'Design & UI') return 'Frontend';
          if (cat === 'Web Backend' || cat === 'Programming Languages') return 'Backend';
          if (cat === 'Databases') return 'Database';
          if (cat === 'Testing') return 'Testing';
          if (cat === 'Security') return 'Security';
          if (cat === 'DevOps & Infrastructure' || cat === 'Cloud Platforms') return 'DevOps';
          if (cat === 'Messaging & Queues' || sub.toLowerCase().includes('queue') || sub.toLowerCase().includes('kafka') || sub.toLowerCase().includes('bullmq') || sub.toLowerCase().includes('rabbit')) return 'Queue';
          if (cat === 'Monitoring' || sub.toLowerCase().includes('grafana') || sub.toLowerCase().includes('prometheus') || sub.toLowerCase().includes('datadog') || sub.toLowerCase().includes('opentelemetry') || sub.toLowerCase().includes('loki') || sub.toLowerCase().includes('observ')) return 'Observability';
          if (sub.toLowerCase().includes('error') || sub.toLowerCase().includes('sentry') || sub.toLowerCase().includes('uptime') || sub.toLowerCase().includes('monitor')) return 'Monitoring';
          if (sub.toLowerCase().includes('auth') || sub.toLowerCase().includes('oauth') || sub.toLowerCase().includes('sso') || sub.toLowerCase().includes('identity') || sub.toLowerCase().includes('jwt')) return 'Auth';
          if (sub.toLowerCase().includes('payment') || sub.toLowerCase().includes('stripe') || sub.toLowerCase().includes('billing') || sub.toLowerCase().includes('paddle')) return 'Payment';
          if (sub.toLowerCase().includes('email') || sub.toLowerCase().includes('resend') || sub.toLowerCase().includes('sendgrid') || sub.toLowerCase().includes('ses')) return 'Email';
          if (sub.toLowerCase().includes('storage') || sub.toLowerCase().includes('s3') || sub.toLowerCase().includes('cdn') || sub.toLowerCase().includes('cloudinary') || sub.toLowerCase().includes('file')) return 'Storage';
          if (sub.toLowerCase().includes('analytics') || sub.toLowerCase().includes('posthog') || sub.toLowerCase().includes('mixpanel') || sub.toLowerCase().includes('segment')) return 'Analytics';
          if (sub.toLowerCase().includes('search') || sub.toLowerCase().includes('elasticsearch') || sub.toLowerCase().includes('meili') || sub.toLowerCase().includes('algolia')) return 'Search';
          if (sub.toLowerCase().includes('ai') || sub.toLowerCase().includes('openai') || sub.toLowerCase().includes('langchain') || sub.toLowerCase().includes('vector') || sub.toLowerCase().includes('llm') || sub.toLowerCase().includes('rag')) return 'AI';
          return 'Backend';
        })(),
        optional: false,
      };
      const techCategory = newTech.category || 'Backend';
      
      let updatedNodes = [...nodes];
      let updatedEdges = [...edges];
      
      const categoryExists = nodes.some(n => {
        const l = (n.data?.label as string || '').toLowerCase();
        if (techCategory === 'Frontend') return l.includes('frontend') || l.includes('client') || l.includes('web') || l.includes('ui') || l.includes('app') || l.includes('next') || l.includes('react') || l.includes('mfe');
        if (techCategory === 'Backend') return l.includes('backend') || l.includes('api') || l.includes('server') || l.includes('service') || l.includes('nest') || l.includes('express') || l.includes('worker') || l.includes('gateway') || l.includes('core');
        if (techCategory === 'Database') return l.includes('database') || l.includes('db') || l.includes('data') || l.includes('postgres') || l.includes('mysql') || l.includes('mongodb') || l.includes('redis') || l.includes('sql') || l.includes('cache') || l.includes('kafka') || l.includes('cassandra') || l.includes('storage') || l.includes('bus');
        if (techCategory === 'DevOps') return l.includes('devops') || l.includes('deploy') || l.includes('docker') || l.includes('hosting') || l.includes('cloud') || l.includes('aws') || l.includes('gcp') || l.includes('cloudflare') || l.includes('ci/cd') || l.includes('k8s') || l.includes('infra') || l.includes('cluster');
        if (techCategory === 'Testing') return l.includes('test') || l.includes('qa') || l.includes('jest') || l.includes('cypress') || l.includes('security') || l.includes('auth');
        return false;
      });

      if (!categoryExists) {
        const maxY = nodes.length > 0 ? Math.max(...nodes.map(n => n.position.y)) : 0;
        const newNodeId = `dyn-node-${techCategory.toLowerCase()}-${Date.now()}`;
        
        updatedNodes.push({
          id: newNodeId,
          type: 'tier',
          position: { x: 250, y: maxY + 150 },
          data: { label: `${techCategory} Tier` }
        });

        // Smart Edge Connections
        if (techCategory === 'Database') {
          // Connect Backend -> Database
          const backendNode = updatedNodes.find(n => {
            const l = (n.data?.label as string || '').toLowerCase();
            return l.includes('backend') || l.includes('api') || l.includes('server') || l.includes('service');
          });
          if (backendNode) {
            updatedEdges.push({ id: `e-${backendNode.id}-${newNodeId}`, source: backendNode.id, target: newNodeId });
          }
        } else if (techCategory === 'Backend') {
          // Connect Frontend -> Backend
          const frontendNode = updatedNodes.find(n => {
            const l = (n.data?.label as string || '').toLowerCase();
            return l.includes('frontend') || l.includes('client') || l.includes('web') || l.includes('ui');
          });
          if (frontendNode) {
            updatedEdges.push({ id: `e-${frontendNode.id}-${newNodeId}`, source: frontendNode.id, target: newNodeId });
          }
        } else if (techCategory === 'DevOps' || techCategory === 'Testing') {
          // Connect from the topmost node (usually Frontend or API) -> DevOps/Testing
          const topNode = updatedNodes.find(n => n.position.y === 0) || updatedNodes[0];
          if (topNode) {
            updatedEdges.push({ id: `e-${topNode.id}-${newNodeId}`, source: topNode.id, target: newNodeId });
          }
        }
      }

      setGeneratedData({ techStack: [...techStack, newTech], checklist, nodes: updatedNodes, edges: updatedEdges });
    }
  };

  const toggleSubcat = (key: string) => {
    setExpandedSubcats(prev => {
      const next = new Set(prev);
      if (next.has(key)) next.delete(key);
      else next.add(key);
      return next;
    });
  };

  // Group and filter encyclopedia
  const filteredData = useMemo(() => {
    let entries = TECH_ENCYCLOPEDIA;

    // Search filter
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      entries = entries.filter(e =>
        e.name.toLowerCase().includes(q) ||
        e.category.toLowerCase().includes(q) ||
        e.subcategory.toLowerCase().includes(q)
      );
    }

    // Category filter
    if (activeCategory) {
      entries = entries.filter(e => e.category === activeCategory);
    }

    // Group by category > subcategory
    const grouped: Record<string, Record<string, TechEntry[]>> = {};
    for (const entry of entries) {
      if (!grouped[entry.category]) grouped[entry.category] = {};
      if (!grouped[entry.category][entry.subcategory]) grouped[entry.category][entry.subcategory] = [];
      grouped[entry.category][entry.subcategory].push(entry);
    }

    return grouped;
  }, [searchQuery, activeCategory]);

  // Count selected per category
  const selectedCount = useMemo(() => {
    const counts: Record<string, number> = {};
    for (const entry of TECH_ENCYCLOPEDIA) {
      if (selectedTech.has(entry.name)) {
        counts[entry.category] = (counts[entry.category] || 0) + 1;
      }
    }
    return counts;
  }, [selectedTech]);

  if (!isMounted) return null;

  return (
    <Card className="bg-zinc-950/50 border-zinc-800 flex-1 flex flex-col">
      <CardHeader className="pb-3">
        <div className="flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg">Tech Stack Encyclopedia</CardTitle>
            <Badge variant="outline" className="border-blue-500/30 text-blue-400 text-xs">
              {selectedTech.size} selected
            </Badge>
          </div>

          {/* Selected Tech Preview */}
          {selectedTech.size > 0 && (
            <div className="flex flex-wrap gap-1.5 p-2 bg-zinc-900/50 rounded-lg border border-zinc-800/50">
              {Array.from(selectedTech).map(name => {
                const entry = TECH_ENCYCLOPEDIA.find(e => e.name === name);
                return (
                  <button
                    key={name}
                    onClick={() => toggleTech(name)}
                    className="flex items-center gap-1.5 px-2 py-1 rounded-md bg-blue-500/10 border border-blue-500/20 text-blue-300 text-xs hover:bg-red-500/10 hover:border-red-500/20 hover:text-red-300 transition-all group"
                  >
                    {entry?.slug && (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={`https://cdn.simpleicons.org/${entry.slug}/white`}
                        alt=""
                        className="w-3 h-3"
                        onError={(e) => { e.currentTarget.style.display = 'none'; }}
                      />
                    )}
                    {name}
                    <X className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </button>
                );
              })}
            </div>
          )}

          {/* Toast Error Notification */}
          {toastError && (
            <div className="fixed bottom-6 right-6 z-50 animate-in slide-in-from-bottom-5 fade-in duration-300">
              <div className="bg-red-500/20 border border-red-500/50 text-red-200 px-4 py-3 rounded-lg shadow-2xl flex items-start gap-3 max-w-sm backdrop-blur-md">
                <X className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
                <p className="text-sm font-medium leading-tight">{toastError}</p>
              </div>
            </div>
          )}



          {/* Tier Recommendations */}
          <div className="flex flex-col gap-2 pt-3 pb-2 border-t border-zinc-800/50 mt-2">
            <div className="flex items-center gap-2">
              <span className="text-xs text-orange-400 font-bold uppercase tracking-wider">
                {complexity} Tier Recommendations
              </span>
              <span className="text-[10px] text-zinc-500 italic">Optional Ideas</span>
            </div>
            <div className="flex flex-col gap-3">
              {(TIER_RECOMMENDATIONS[complexity] || []).map(group => (
                <div key={group.groupName} className="flex flex-col gap-1.5">
                  <span className="text-[10px] font-semibold text-zinc-500 uppercase">{group.groupName}</span>
                  <div className="flex flex-wrap gap-1.5">
                    {group.technologies.map(techName => {
                      const entry = TECH_ENCYCLOPEDIA.find(e => e.name === techName);
                      const isSelected = selectedTech.has(techName);
                      return (
                        <button
                          key={techName}
                          onClick={() => toggleTech(techName)}
                          className={`relative flex items-center gap-1.5 px-2 py-1 rounded-md border transition-all text-xs ${
                            isSelected
                              ? 'bg-orange-500/10 border-orange-500/30 text-orange-200'
                              : 'bg-zinc-900 border-zinc-700 text-zinc-300 hover:border-zinc-500 hover:text-white'
                          }`}
                        >
                          {entry?.slug && (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img
                              src={`https://cdn.simpleicons.org/${entry.slug}/${isSelected ? 'fb923c' : 'a1a1aa'}`}
                              alt=""
                              className="w-3 h-3 shrink-0"
                              onError={(e) => { e.currentTarget.style.display = 'none'; }}
                            />
                          )}
                          <span className="text-[10px] font-medium whitespace-nowrap">{techName}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
            <input
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="Search 200+ technologies..."
              className="w-full bg-zinc-900 border border-zinc-800 rounded-lg pl-9 pr-3 py-2 text-sm text-zinc-200 placeholder-zinc-600 focus:outline-none focus:border-blue-500/50"
            />
          </div>

          {/* Category Tabs */}
          <div className="flex flex-wrap gap-1.5">
            <button
              onClick={() => setActiveCategory(null)}
              className={`text-[11px] font-medium px-2.5 py-1 rounded-full border transition-all ${
                !activeCategory
                  ? 'text-white bg-zinc-800 border-zinc-700'
                  : 'text-zinc-500 bg-zinc-900 border-zinc-800 hover:text-zinc-300'
              }`}
            >
              All
            </button>
            {TECH_CATEGORIES.map(cat => {
              const count = selectedCount[cat] || 0;
              return (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(activeCategory === cat ? null : cat)}
                  className={`text-[11px] font-medium px-2.5 py-1 rounded-full border transition-all ${
                    activeCategory === cat
                      ? 'text-white bg-zinc-800 border-zinc-700'
                      : 'text-zinc-500 bg-zinc-900 border-zinc-800 hover:text-zinc-300'
                  }`}
                >
                  {cat} {count > 0 && <span className="text-blue-400 ml-0.5">({count})</span>}
                </button>
              );
            })}
          </div>
        </div>
      </CardHeader>

      <CardContent className="flex-1 overflow-y-auto pb-6 space-y-3">
        {Object.keys(filteredData).length === 0 ? (
          <div className="text-center text-zinc-500 py-8 text-sm italic">
            No technologies match your search.
          </div>
        ) : (
          Object.entries(filteredData).map(([category, subcats]) => (
            <div key={category} className="space-y-2">
              {/* Category Header */}
              {!activeCategory && (
                <h3 className="text-xs font-bold text-zinc-400 uppercase tracking-wider px-1 pt-2 border-b border-zinc-800/50 pb-1.5">
                  {category}
                </h3>
              )}

              {Object.entries(subcats).map(([subcategory, entries]) => {
                const subcatKey = `${category}-${subcategory}`;
                const isExpanded = expandedSubcats.has(subcatKey) || !!searchQuery || !!activeCategory;
                const selectedInSubcat = entries.filter(e => selectedTech.has(e.name)).length;

                return (
                  <div key={subcatKey} className="rounded-lg border border-zinc-800/50 bg-zinc-900/30 overflow-hidden">
                    {/* Subcategory Header */}
                    <button
                      onClick={() => toggleSubcat(subcatKey)}
                      className="w-full flex items-center gap-2 px-3 py-2 text-left hover:bg-zinc-800/30 transition-colors"
                    >
                      {isExpanded ? (
                        <ChevronDown className="w-3.5 h-3.5 text-zinc-500 shrink-0" />
                      ) : (
                        <ChevronRight className="w-3.5 h-3.5 text-zinc-500 shrink-0" />
                      )}
                      <span className="text-xs font-medium text-zinc-400">{subcategory}</span>
                      <span className="text-[10px] text-zinc-600 ml-auto">
                        {selectedInSubcat > 0 && (
                          <span className="text-blue-400 mr-1">{selectedInSubcat} selected ·</span>
                        )}
                        {entries.length} items
                      </span>
                    </button>

                    {/* Tech List */}
                    {isExpanded && (
                      <div className="px-2 pb-2 flex flex-wrap gap-1.5">
                        {entries.map(entry => {
                          const isSelected = selectedTech.has(entry.name);
                          return (
                            <button
                              key={entry.name}
                              onClick={() => toggleTech(entry.name)}
                              className={`relative flex items-center gap-2 px-2.5 py-2 rounded-lg border transition-all text-xs ${
                                isSelected
                                  ? 'bg-blue-500/10 border-blue-500/30 text-blue-200'
                                  : 'bg-zinc-950/50 border-zinc-800 text-zinc-400 hover:border-zinc-700 hover:text-zinc-200'
                              }`}
                            >
                              {/* eslint-disable-next-line @next/next/no-img-element */}
                              <img
                                src={`https://cdn.simpleicons.org/${entry.slug}/${isSelected ? '60a5fa' : '71717a'}`}
                                alt=""
                                className="w-4 h-4 shrink-0"
                                onError={(e) => { e.currentTarget.style.display = 'none'; }}
                              />
                              <span className="text-[11px] font-medium whitespace-nowrap">{entry.name}</span>
                              {isSelected && (
                                <Check className="w-3 h-3 text-blue-400 ml-1 shrink-0" />
                              )}
                            </button>
                          );
                        })}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          ))
        )}
      </CardContent>
    </Card>
  );
}
