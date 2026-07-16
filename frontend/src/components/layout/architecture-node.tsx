'use client';

import { useMemo, useState } from 'react';
import { Handle, Position } from '@xyflow/react';
import { useProjectStore, TechItem } from '@/store/project-store';
import { TECH_ENCYCLOPEDIA } from '@/data/tech-stack-data';
import { LayoutDashboard, Server, Database, Cloud, Shield, Check, Trash2, ExternalLink, Plus } from 'lucide-react';
import { useRouter } from 'next/navigation';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function ArchitectureTierNode({ data, id }: { data: any; id: string }) {
  const router = useRouter();
  const techStack = useProjectStore(state => state.techStack);
  const checklist = useProjectStore(state => state.checklist);
  const nodes = useProjectStore(state => state.architectureNodes);
  const edges = useProjectStore(state => state.architectureEdges);
  const projectId = useProjectStore(state => state.projectId);
  const setGeneratedData = useProjectStore(state => state.setGeneratedData);

  const [isDragOver, setIsDragOver] = useState(false);

  // Map label to category
  const category = useMemo(() => {
    const label = data.label || '';
    const l = label.toLowerCase();
    if (l.includes('frontend') || l.includes('client') || l.includes('web') || l.includes('ui') || l.includes('app') || l.includes('next') || l.includes('react') || l.includes('mfe')) return 'Frontend';
    if (l.includes('backend') || l.includes('api') || l.includes('server') || l.includes('service') || l.includes('nest') || l.includes('express') || l.includes('worker') || l.includes('gateway') || l.includes('core')) return 'Backend';
    if (l.includes('database') || l.includes('db') || l.includes('data') || l.includes('postgres') || l.includes('mysql') || l.includes('mongodb') || l.includes('redis') || l.includes('sql') || l.includes('cache') || l.includes('kafka') || l.includes('cassandra') || l.includes('storage') || l.includes('bus')) return 'Database';
    if (l.includes('devops') || l.includes('deploy') || l.includes('docker') || l.includes('hosting') || l.includes('cloud') || l.includes('aws') || l.includes('gcp') || l.includes('cloudflare') || l.includes('ci/cd') || l.includes('k8s') || l.includes('infra') || l.includes('cluster')) return 'DevOps';
    if (l.includes('test') || l.includes('qa') || l.includes('jest') || l.includes('cypress') || l.includes('security') || l.includes('auth')) return 'Testing';
    return null;
  }, [data.label]);

  // Filter tech stack for this category
  const nodeTech = useMemo(() => {
    if (!category) return [];
    return techStack.filter(t => {
      // Map techStack categories to our keys
      const cat = t.category || 'Backend';
      if (cat === 'Frontend' && category === 'Frontend') return true;
      if (cat === 'Backend' && category === 'Backend') return true;
      if (cat === 'Database' && category === 'Database') return true;
      if (cat === 'DevOps' && category === 'DevOps') return true;
      if (cat === 'Testing' && category === 'Testing') return true;
      
      // Fallbacks in case category isn't set perfectly
      if (category === 'Database' && (t.rationale?.toLowerCase().includes('database') || t.name.toLowerCase().includes('postgres') || t.name.toLowerCase().includes('mongo') || t.name.toLowerCase().includes('redis'))) return true;
      return false;
    });
  }, [techStack, category]);

  // Handle Drag Over & Drop
  const handleDragOver = (e: React.DragEvent) => {
    if (!category) return;
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = () => {
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    if (!category) return;
    e.preventDefault();
    setIsDragOver(false);

    const techName = e.dataTransfer.getData('text/plain');
    if (!techName) return;

    // Check if already in techStack
    if (techStack.some(t => t.name === techName)) return;

    // Find in encyclopedia
    const entry = TECH_ENCYCLOPEDIA.find(t => t.name === techName);
    const newTech: TechItem = {
      id: Math.random().toString(36).substr(2, 9),
      name: techName,
      simpleIconSlug: entry?.slug || techName.toLowerCase(),
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      category: category as any,
      rationale: entry ? `${entry.subcategory} — ${entry.category}` : 'Added via architecture diagram drag-and-drop',
      optional: false,
    };

    setGeneratedData({
      techStack: [...techStack, newTech],
      checklist,
      nodes,
      edges,
    });
  };

  // Toggle optional state
  const toggleOptional = (techName: string) => {
    const updated = techStack.map(t => {
      if (t.name === techName) {
        return { ...t, optional: !t.optional };
      }
      return t;
    });
    setGeneratedData({ techStack: updated, checklist, nodes, edges });
  };

  // Remove technology
  const removeTech = (techName: string) => {
    const updated = techStack.filter(t => t.name !== techName);
    setGeneratedData({ techStack: updated, checklist, nodes, edges });
  };

  // Navigate to checklist with query filter
  const goToChecklist = () => {
    if (!projectId || !category) return;
    router.push(`/projects/${projectId}/checklist?category=${category.toLowerCase()}`);
  };

  // Icons based on category
  const categoryIcon = () => {
    switch (category) {
      case 'Frontend': return <LayoutDashboard className="w-4 h-4 text-pink-400" />;
      case 'Backend': return <Server className="w-4 h-4 text-green-400" />;
      case 'Database': return <Database className="w-4 h-4 text-blue-400" />;
      case 'DevOps': return <Cloud className="w-4 h-4 text-cyan-400" />;
      case 'Testing': return <Shield className="w-4 h-4 text-yellow-400" />;
      default: return null;
    }
  };

  // Render simple clean node if it doesn't map to a category
  if (!category) {
    return (
      <div className="px-6 py-3 rounded-xl border border-zinc-800 bg-zinc-950/80 backdrop-blur text-zinc-300 font-semibold text-sm shadow-xl min-w-[120px] text-center">
        <Handle type="target" position={Position.Top} className="bg-zinc-700" />
        {data.label}
        <Handle type="source" position={Position.Bottom} className="bg-zinc-700" />
      </div>
    );
  }

  return (
    <div
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      className={`p-4 rounded-xl border backdrop-blur transition-all duration-200 min-w-[220px] shadow-2xl flex flex-col gap-3 ${
        isDragOver
          ? 'border-blue-500 bg-blue-500/10 scale-105 ring-2 ring-blue-500/20'
          : 'border-zinc-800 bg-zinc-950/90 hover:border-zinc-700'
      }`}
    >
      <Handle type="target" position={Position.Top} className="bg-zinc-700" />

      {/* Header */}
      <div className="flex items-center justify-between border-b border-zinc-800/80 pb-2">
        <div className="flex items-center gap-2">
          {categoryIcon()}
          <span className="font-bold text-xs tracking-wider uppercase text-zinc-300">
            {data.label}
          </span>
        </div>
        {projectId && (
          <button
            onClick={goToChecklist}
            title="Open category checklist"
            className="text-zinc-500 hover:text-zinc-300 transition-colors p-0.5"
          >
            <ExternalLink className="w-3.5 h-3.5" />
          </button>
        )}
      </div>

      {/* Tech Stack List */}
      <div className="space-y-1.5 flex-1 h-auto">
        {nodeTech.length === 0 ? (
          <div className="text-center py-4 border border-dashed border-zinc-800/60 rounded-lg text-[10px] text-zinc-600 font-medium">
            Drag & drop tech here
          </div>
        ) : (
          nodeTech.map((tech, idx) => (
            <div
              key={idx}
              className="flex items-start justify-between gap-2 p-1.5 rounded bg-zinc-900/60 border border-zinc-800/40 text-xs hover:border-zinc-800 hover:bg-zinc-900 group/item transition-colors"
            >
              <div className="flex items-start gap-1.5 min-w-0 flex-1">
                {tech.simpleIconSlug && (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={`https://cdn.simpleicons.org/${tech.simpleIconSlug}/60a5fa`}
                    alt=""
                    className="w-3.5 h-3.5 shrink-0 mt-[1px]"
                    onError={(e) => { e.currentTarget.style.display = 'none'; }}
                  />
                )}
                <span className="text-[11px] leading-tight text-zinc-300 font-medium flex-1 min-w-0 break-words pr-1">{tech.name}</span>
              </div>

              <div className="flex items-start gap-1 opacity-60 group-hover/item:opacity-100 transition-opacity shrink-0">
                {/* Optional Toggle */}
                <button
                  onClick={() => toggleOptional(tech.name)}
                  className={`text-[8px] font-bold px-1 py-0.5 rounded transition-all ${
                    tech.optional
                      ? 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30'
                      : 'bg-zinc-950 text-zinc-500 hover:text-zinc-300 hover:bg-zinc-800 border border-zinc-800/80'
                  }`}
                >
                  OPT
                </button>
                {/* Remove Button */}
                <button
                  onClick={() => removeTech(tech.name)}
                  className="text-zinc-500 hover:text-red-400 p-0.5 transition-colors"
                >
                  <Trash2 className="w-3 h-3" />
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      <Handle type="source" position={Position.Bottom} className="bg-zinc-700" />
    </div>
  );
}
