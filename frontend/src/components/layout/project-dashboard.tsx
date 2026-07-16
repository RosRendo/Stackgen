'use client';

import { useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { useProjectStore, ProjectTask, TechItem } from '@/store/project-store';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ReactFlow, Background, Controls, applyNodeChanges, type NodeChange } from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { ArrowRight, Save, Share2, Download, CheckCircle2, Circle, Clock, ChevronDown, Check, FolderGit2, Terminal, Code, Code2, Server, LayoutDashboard, Shield, Cloud, Loader2 } from 'lucide-react';
import { TechStackBoard } from './tech-stack-board';
import { ArchitectureTierNode } from './architecture-node';
import { motion } from 'framer-motion';

import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@/components/ui/sheet";

export function getCategoryFromLabel(label: string): 'Frontend' | 'Backend' | 'Database' | 'DevOps' | 'Testing' | null {
  const l = label.toLowerCase();
  if (l.includes('frontend') || l.includes('client') || l.includes('web') || l.includes('ui') || l.includes('app') || l.includes('next') || l.includes('react')) return 'Frontend';
  if (l.includes('backend') || l.includes('api') || l.includes('server') || l.includes('service') || l.includes('nest') || l.includes('express')) return 'Backend';
  if (l.includes('database') || l.includes('db') || l.includes('postgres') || l.includes('mysql') || l.includes('mongodb') || l.includes('redis') || l.includes('sql') || l.includes('cache')) return 'Database';
  if (l.includes('devops') || l.includes('deploy') || l.includes('docker') || l.includes('hosting') || l.includes('cloud') || l.includes('aws') || l.includes('gcp') || l.includes('cloudflare') || l.includes('ci/cd') || l.includes('k8s')) return 'DevOps';
  if (l.includes('test') || l.includes('qa') || l.includes('jest') || l.includes('cypress')) return 'Testing';
  return null;
}

export function ProjectDashboard() {
  const router = useRouter();
  const { 
    projectId,
    projectName, 
    complexity, 
    progress, 
    checklist, 
    techStack,
    architectureNodes,
    architectureEdges,
    toggleTaskStatus,
    setProjectDetails,
    setGeneratedData
  } = useProjectStore();

  const [selectedTech, setSelectedTech] = useState<TechItem | null>(null);
  const [selectedTask, setSelectedTask] = useState<ProjectTask | null>(null);
  const [generatedPrompt, setGeneratedPrompt] = useState<string>('');
  const [isGeneratingPrompt, setIsGeneratingPrompt] = useState(false);
  const [dashboardFilterCategory, setDashboardFilterCategory] = useState<'Frontend' | 'Backend' | 'Database' | 'DevOps' | 'Testing' | null>(null);

  const nodeTypes = useMemo(() => ({ tier: ArchitectureTierNode }), []);

  const flowNodes = useMemo(() => {
    return architectureNodes.map((node) => ({
      ...node,
      type: 'tier',
    }));
  }, [architectureNodes]);

  const flowEdges = useMemo(() => {
    return architectureEdges.map(edge => ({
      ...edge,
      animated: true,
      style: { stroke: '#60a5fa', strokeWidth: 2, opacity: 0.8 },
    }));
  }, [architectureEdges]);

  const filteredChecklist = useMemo(() => {
    if (!dashboardFilterCategory) return checklist;
    return checklist.filter(task => {
      const cat = task.category?.toLowerCase() || '';
      const filter = dashboardFilterCategory.toLowerCase();
      if (filter === 'database' && (cat.includes('database') || cat.includes('db') || cat.includes('backend'))) return true;
      return cat.includes(filter);
    });
  }, [checklist, dashboardFilterCategory]);

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'Frontend': return <LayoutDashboard className="w-4 h-4 text-pink-500" />;
      case 'Backend': return <Server className="w-4 h-4 text-green-500" />;
      case 'Security': return <Shield className="w-4 h-4 text-yellow-500" />;
      case 'DevOps': return <Cloud className="w-4 h-4 text-blue-500" />;
      default: return <Code className="w-4 h-4 text-zinc-500" />;
    }
  };

  const handleGeneratePrompt = async (task: ProjectTask) => {
    // ... existing ...
    setSelectedTask(task);
    setGeneratedPrompt('');
    setIsGeneratingPrompt(true);

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/ai/generate-task-prompt`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          taskTitle: task.title,
          taskDescription: task.description,
          techStack: techStack,
          checklist: checklist,
          projectName: projectName,
          projectDescription: useProjectStore.getState().description,
        }),
      });
      const data = await res.json();
      setGeneratedPrompt(data.prompt);
    } catch (err) {
      console.error(err);
      setGeneratedPrompt('Failed to generate prompt. Please check your API key.');
    } finally {
      setIsGeneratingPrompt(false);
    }
  };

  const [isExporting, setIsExporting] = useState(false);
  const [isZipping, setIsZipping] = useState(false);

  const handleExportDocs = async () => {
    setIsExporting(true);
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/ai/generate-docs`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          projectName,
          description: useProjectStore.getState().description,
          techStack,
          nodes: architectureNodes
        })
      });
      const data = await res.json();
      
      const downloadFile = (filename: string, content: string) => {
        const element = document.createElement('a');
        const file = new Blob([content], {type: 'text/plain'});
        element.href = URL.createObjectURL(file);
        element.download = filename;
        document.body.appendChild(element);
        element.click();
        document.body.removeChild(element);
      };

      downloadFile('README.md', data.readme);
      downloadFile('ARCHITECTURE.md', data.architecture);
    } catch (err) {
      console.error(err);
    } finally {
      setIsExporting(false);
    }
  };

  const handleGenerateZip = async () => {
    setIsZipping(true);
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/ai/generate-zip`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ projectName, techStack })
      });
      const data = await res.json();
      
      // Dynamically import jszip and file-saver
      const JSZip = (await import('jszip')).default;
      const { saveAs } = await import('file-saver');

      const zip = new JSZip();
      
      // Add files to the zip
      data.files.forEach((file: { path: string, content: string }) => {
        zip.file(file.path, file.content);
      });

      // Generate and download
      const content = await zip.generateAsync({ type: 'blob' });
      saveAs(content, `${projectName.replace(/\s+/g, '-').toLowerCase()}-boilerplate.zip`);

    } catch (err) {
      console.error(err);
    } finally {
      setIsZipping(false);
    }
  };

  return (
    <div className="container mx-auto p-4 space-y-6 pb-24">
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between"
      >
        <div>
          <h1 className="text-3xl font-bold tracking-tight">{projectName}</h1>
          <div className="flex items-center gap-2 mt-2">
            <Badge variant="outline" className="text-blue-400 border-blue-400/20 bg-blue-400/10">
              {complexity} Level
            </Badge>
            <span className="text-sm text-zinc-500">Status: Development Phase</span>
          </div>
        </div>
        <div className="flex gap-4">
          <Button variant="outline" onClick={handleGenerateZip} disabled={isZipping} className="bg-blue-600 hover:bg-blue-500 text-white border-blue-600">
            {isZipping ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : null}
            Download Boilerplate
          </Button>
          <Button variant="outline" onClick={handleExportDocs} disabled={isExporting} className="bg-zinc-900 border-zinc-700 hover:bg-zinc-800 text-zinc-300">
            {isExporting ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : null}
            Export Docs
          </Button>
          <Button variant="outline" onClick={() => setProjectDetails('', '', 'MVP')} className="border-zinc-800 hover:bg-zinc-900">
            New Project
          </Button>
        </div>
      </motion.div>

      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.1 }}
      >
        <Card className="bg-zinc-950/50 border-zinc-800">
          <CardHeader>
            <CardTitle className="text-sm font-medium text-zinc-400 uppercase tracking-wider">Overall Progress</CardTitle>
            <div className="flex items-center justify-between mt-2">
              <Progress value={progress} className="h-3 flex-1 bg-zinc-900 mr-4" />
              <span className="font-bold text-lg">{progress}%</span>
            </div>
          </CardHeader>
        </Card>
      </motion.div>

      <div className="grid lg:grid-cols-3 gap-6">
        <motion.div 
          className="lg:col-span-2 space-y-6"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
        >
          {/* Architecture Diagram */}
          <Card className="bg-zinc-950/50 border-zinc-800 overflow-hidden h-[400px] flex flex-col">
            <CardHeader className="pb-2 z-10 bg-zinc-950/80 backdrop-blur border-b border-zinc-800">
              <CardTitle className="text-lg">System Architecture</CardTitle>
            </CardHeader>
            <CardContent className="p-0 flex-1 relative">
              <ReactFlow 
                nodes={flowNodes} 
                edges={flowEdges} 
                nodeTypes={nodeTypes}
                onNodesChange={(changes) => {
                  setGeneratedData({
                    techStack,
                    checklist,
                    nodes: applyNodeChanges(changes, architectureNodes),
                    edges: architectureEdges
                  });
                }}
                onNodeClick={(event, node) => {
                  // eslint-disable-next-line @typescript-eslint/no-explicit-any
                  const label = (node.data as any)?.label || '';
                  const category = getCategoryFromLabel(label);
                  if (category) {
                    setDashboardFilterCategory(prev => prev === category ? null : category);
                  }
                }}
                fitView
                colorMode="dark"
              >
                <Background color="#3f3f46" gap={16} />
                <Controls />
              </ReactFlow>
            </CardContent>
          </Card>

          {/* Your Selected Stack Summary */}
          {techStack.length > 0 && (
            <Card className="bg-zinc-950/50 border-zinc-800">
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg">Your Selected Stack</CardTitle>
                  <Badge variant="outline" className="border-blue-500/30 text-blue-400 text-xs">
                    {techStack.length} technologies
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {techStack.map((tech, idx) => (
                    <button
                      key={idx}
                      onClick={() => setSelectedTech(tech)}
                      className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-zinc-900/80 border border-zinc-800 text-sm hover:bg-zinc-800 hover:border-zinc-700 transition-colors text-left"
                    >
                      {tech.simpleIconSlug && (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={`https://cdn.simpleicons.org/${tech.simpleIconSlug}/60a5fa`}
                          alt=""
                          className="w-4 h-4 shrink-0"
                          onError={(e) => { e.currentTarget.style.display = 'none'; }}
                        />
                      )}
                      <span className="text-zinc-200 font-medium">{tech.name}</span>
                      {tech.optional && (
                        <span className="text-[9px] text-yellow-500/70 bg-yellow-500/10 px-1 rounded shrink-0">OPT</span>
                      )}
                    </button>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Checklist */}
          <Card className="bg-zinc-950/50 border-zinc-800">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
              <div>
                <CardTitle className="text-lg">🗺️ Your Build Roadmap</CardTitle>
                <p className="text-xs text-zinc-500 mt-1">Step-by-step tasks to build your project, grouped by area. Complete them in order for the smoothest experience.</p>
                {dashboardFilterCategory && (
                  <div className="flex items-center gap-2 mt-2">
                    <span className="text-xs text-blue-400 bg-blue-500/10 px-2 py-0.5 rounded border border-blue-500/20">
                      Showing: {dashboardFilterCategory} only
                    </span>
                    <button 
                      onClick={() => setDashboardFilterCategory(null)}
                      className="text-[10px] text-zinc-500 hover:text-red-400 underline"
                    >
                      Show all
                    </button>
                  </div>
                )}
              </div>
              {projectId && (
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="h-8 border-zinc-800 hover:bg-zinc-800 text-zinc-400 hover:text-white shrink-0"
                  onClick={() => router.push(`/projects/${projectId}/checklist`)}
                >
                  Full Checklist →
                </Button>
              )}
            </CardHeader>
            <CardContent>
              <div className="space-y-8">
                {filteredChecklist.length === 0 ? (
                  <div className="text-zinc-500 text-sm italic py-8 text-center bg-zinc-900/10 rounded border border-dashed border-zinc-800">
                    No tasks found for {dashboardFilterCategory}.
                  </div>
                ) : (
                  Object.entries(
                    filteredChecklist.reduce((acc, task) => {
                      const cat = task.category || 'General';
                      if (!acc[cat]) acc[cat] = [];
                      acc[cat].push(task);
                      return acc;
                    }, {} as Record<string, ProjectTask[]>)
                  ).map(([cat, tasks], groupIdx) => {
                    const catColors: Record<string, { border: string; label: string; dot: string; step: string }> = {
                      Frontend: { border: 'border-pink-500/30', label: 'text-pink-400', dot: 'bg-pink-500', step: 'bg-pink-500/10 text-pink-300 border-pink-500/20' },
                      Backend:  { border: 'border-green-500/30', label: 'text-green-400', dot: 'bg-green-500', step: 'bg-green-500/10 text-green-300 border-green-500/20' },
                      Database: { border: 'border-blue-500/30',  label: 'text-blue-400',  dot: 'bg-blue-500',  step: 'bg-blue-500/10 text-blue-300 border-blue-500/20' },
                      DevOps:   { border: 'border-yellow-500/30',label: 'text-yellow-400',dot: 'bg-yellow-500',step: 'bg-yellow-500/10 text-yellow-300 border-yellow-500/20' },
                      Security: { border: 'border-orange-500/30',label: 'text-orange-400',dot: 'bg-orange-500',step: 'bg-orange-500/10 text-orange-300 border-orange-500/20' },
                      Testing:  { border: 'border-purple-500/30',label: 'text-purple-400',dot: 'bg-purple-500',step: 'bg-purple-500/10 text-purple-300 border-purple-500/20' },
                    };
                    const colors = catColors[cat] || { border: 'border-zinc-700', label: 'text-zinc-400', dot: 'bg-zinc-500', step: 'bg-zinc-800 text-zinc-300 border-zinc-700' };
                    const doneCount = tasks.filter(t => t.status === 'DONE').length;
                    return (
                      <div key={cat}>
                        {/* Category Header */}
                        <div className="flex items-center gap-3 mb-4">
                          <div className={`w-2.5 h-2.5 rounded-full ${colors.dot} shrink-0`} />
                          <div className="flex items-center gap-3 flex-1">
                            <h4 className={`font-bold text-sm uppercase tracking-widest ${colors.label}`}>{cat}</h4>
                            <span className="text-[10px] text-zinc-500">{doneCount}/{tasks.length} done</span>
                          </div>
                          <div className="flex-1 h-px bg-zinc-800/60" />
                        </div>

                        {/* Task Cards */}
                        <div className={`border-l-2 ${colors.border} ml-1 pl-5 space-y-4`}>
                          {tasks.map((task, taskIdx) => {
                            const stepNum = taskIdx + 1;
                            const isDone = task.status === 'DONE';
                            return (
                              <div 
                                key={task.id} 
                                className={`relative rounded-xl border transition-all duration-200 ${
                                  isDone 
                                    ? 'border-zinc-800/40 bg-zinc-900/10 opacity-60' 
                                    : `border-zinc-800/60 bg-zinc-900/40 hover:bg-zinc-900/70 hover:${colors.border}`
                                }`}
                              >
                                {/* Step Number Badge */}
                                <div className={`absolute -left-8 top-4 w-5 h-5 rounded-full border flex items-center justify-center text-[10px] font-bold ${
                                  isDone ? 'bg-green-500/20 border-green-500/40 text-green-400' : `${colors.step} border`
                                }`}>
                                  {isDone ? '✓' : stepNum}
                                </div>

                                <div className="p-4">
                                  {/* Task header row */}
                                  <div className="flex items-start justify-between gap-3">
                                    <div className="flex items-start gap-3 flex-1 min-w-0">
                                      <Checkbox 
                                        checked={isDone} 
                                        onCheckedChange={() => toggleTaskStatus(task.id)}
                                        className={`mt-0.5 border-zinc-700 data-[state=checked]:bg-green-500 data-[state=checked]:border-green-500 shrink-0`}
                                      />
                                      <div>
                                        <div className={`font-semibold text-sm leading-snug ${isDone ? 'line-through text-zinc-500' : 'text-zinc-100'}`}>
                                          {task.title}
                                        </div>
                                      </div>
                                    </div>
                                    {/* Status badge */}
                                    {isDone ? (
                                      <span className="text-[10px] font-semibold text-green-400 bg-green-500/10 border border-green-500/20 px-2 py-0.5 rounded-full shrink-0">Done ✓</span>
                                    ) : stepNum === 1 && doneCount === 0 ? (
                                      <span className={`text-[10px] font-semibold border px-2 py-0.5 rounded-full shrink-0 ${colors.step}`}>Start here</span>
                                    ) : doneCount === taskIdx ? (
                                      <span className="text-[10px] font-semibold text-amber-400 bg-amber-500/10 border border-amber-500/20 px-2 py-0.5 rounded-full shrink-0">Up next</span>
                                    ) : null}
                                  </div>

                                  {/* Description */}
                                  {task.description && (
                                    <p className={`text-xs leading-relaxed mt-2 ml-7 ${isDone ? 'text-zinc-600' : 'text-zinc-400'}`}>
                                      {task.description}
                                    </p>
                                  )}

                                  {/* Footer: tech + CTA */}
                                  <div className="flex items-center justify-between gap-4 mt-3 ml-7">
                                    {task.relatedTech && task.relatedTech.length > 0 && (
                                      <div className="flex items-center gap-1.5 flex-wrap">
                                        <span className="text-[9px] text-zinc-600 mr-0.5">Uses:</span>
                                        {task.relatedTech.map((tech, i) => (
                                          <span key={i} className={`text-[9px] font-medium px-1.5 py-0.5 rounded border whitespace-nowrap ${
                                            isDone ? 'bg-zinc-900/50 text-zinc-600 border-zinc-800' : 'bg-zinc-800/80 text-zinc-300 border-zinc-700'
                                          }`}>
                                            {tech}
                                          </span>
                                        ))}
                                      </div>
                                    )}
                                    <button
                                      disabled={isDone}
                                      onClick={() => handleGeneratePrompt(task)}
                                      className={`flex items-center gap-1.5 text-[11px] font-medium px-3 py-1.5 rounded-lg border transition-all shrink-0 ${
                                        isDone 
                                          ? 'opacity-30 cursor-not-allowed border-zinc-800 text-zinc-600' 
                                          : `${colors.step} border hover:opacity-80`
                                      }`}
                                    >
                                      <Terminal className="w-3 h-3" />
                                      Get AI Instructions
                                    </button>
                                  </div>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div 
          className="space-y-6"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
        >
          {/* Tech Stack Board */}
          <TechStackBoard />

          {/* Core Features */}
          {/* <CostEstimator /> */}
        </motion.div>
      </div>

      {/* Tech Stack Explanation Sheet */}
      <Sheet open={!!selectedTech} onOpenChange={() => setSelectedTech(null)}>
        <SheetContent className="bg-zinc-950 border-zinc-800 text-zinc-100 sm:max-w-md overflow-y-auto">
          <SheetHeader>
            <SheetTitle className="text-2xl text-zinc-100 flex items-center gap-3">
              {selectedTech?.simpleIconSlug && (
                <img
                  src={`https://cdn.simpleicons.org/${selectedTech.simpleIconSlug}/white`}
                  alt=""
                  className="w-8 h-8"
                  onError={(e) => { e.currentTarget.style.display = 'none'; }}
                />
              )}
              {selectedTech?.name}
            </SheetTitle>
            <SheetDescription className="text-zinc-400 mt-4 leading-relaxed">
              {selectedTech?.rationale}
            </SheetDescription>
          </SheetHeader>
          <div className="mt-8 space-y-6">
            <div>
              <h4 className="font-semibold text-zinc-300 mb-2 flex items-center gap-2">
                <Terminal className="w-4 h-4 text-blue-400" />
                Setup Command
              </h4>
              <div className="relative group">
                <pre className="p-4 rounded-lg bg-zinc-900 border border-zinc-800 text-sm text-zinc-300 whitespace-pre-wrap font-mono overflow-x-auto">
                  {(() => {
                    const slug = selectedTech?.simpleIconSlug?.toLowerCase() || '';
                    if (slug === 'docker') return 'docker-compose up -d';
                    if (slug === 'nextdotjs') return 'npx create-next-app@latest .\nnpm run dev';
                    if (slug === 'nestjs') return 'npm i -g @nestjs/cli\nnest new project-name';
                    if (slug === 'postgresql') return 'docker run --name my-postgres -e POSTGRES_PASSWORD=mysecretpassword -p 5432:5432 -d postgres';
                    if (slug === 'tailwindcss') return 'npm install -D tailwindcss postcss autoprefixer\nnpx tailwindcss init -p';
                    if (slug === 'prisma') return 'npm install prisma --save-dev\nnpx prisma init';
                    if (slug === 'redis') return 'docker run --name my-redis -p 6379:6379 -d redis';
                    if (slug === 'react') return 'npx create-react-app my-app\ncd my-app\nnpm start';
                    if (slug === 'nodedotjs') return 'npm init -y\nnpm i express';
                    if (slug === 'mongodb') return 'docker run --name mongodb -p 27017:27017 -d mongo';
                    if (slug === 'stripe') return 'npm i stripe';
                    return `npm install ${slug || selectedTech?.name?.toLowerCase()}`;
                  })()}
                </pre>
                <Button 
                  className="absolute top-2 right-2 h-7 px-2 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 text-xs opacity-0 group-hover:opacity-100 transition-opacity"
                  onClick={() => {
                    const slug = selectedTech?.simpleIconSlug?.toLowerCase() || '';
                    let cmd = `npm install ${slug || selectedTech?.name?.toLowerCase()}`;
                    if (slug === 'docker') cmd = 'docker-compose up -d';
                    if (slug === 'nextdotjs') cmd = 'npx create-next-app@latest .\nnpm run dev';
                    if (slug === 'nestjs') cmd = 'npm i -g @nestjs/cli\nnest new project-name';
                    if (slug === 'postgresql') cmd = 'docker run --name my-postgres -e POSTGRES_PASSWORD=mysecretpassword -p 5432:5432 -d postgres';
                    if (slug === 'tailwindcss') cmd = 'npm install -D tailwindcss postcss autoprefixer\nnpx tailwindcss init -p';
                    if (slug === 'prisma') cmd = 'npm install prisma --save-dev\nnpx prisma init';
                    if (slug === 'redis') cmd = 'docker run --name my-redis -p 6379:6379 -d redis';
                    if (slug === 'react') cmd = 'npx create-react-app my-app\ncd my-app\nnpm start';
                    if (slug === 'nodedotjs') cmd = 'npm init -y\nnpm i express';
                    if (slug === 'mongodb') cmd = 'docker run --name mongodb -p 27017:27017 -d mongo';
                    if (slug === 'stripe') cmd = 'npm i stripe';
                    navigator.clipboard.writeText(cmd);
                  }}
                >
                  Copy
                </Button>
              </div>
            </div>

            <div>
              <h4 className="font-semibold text-zinc-300 mb-2">Why this matters for your app:</h4>
              <p className="text-sm text-zinc-500 leading-relaxed">
                The AI selected this specifically because it matches your requirement of a <strong className="text-zinc-300">{complexity}</strong> level architecture. It provides the necessary scalability and features required for your feature set.
              </p>
            </div>
          </div>
        </SheetContent>
      </Sheet>

      {/* Generate Prompt Dialog */}
      <Dialog open={!!selectedTask} onOpenChange={(open) => !open && setSelectedTask(null)}>
        <DialogContent className="bg-zinc-950 border-zinc-800 text-zinc-100 max-w-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-xl">
              <Terminal className="w-5 h-5 text-blue-400" />
              AI Coding Instructions
            </DialogTitle>
            <DialogDescription className="text-zinc-400 mt-1 leading-relaxed">
              Below is a ready-to-use prompt you can paste into <strong className="text-zinc-200">Cursor, GitHub Copilot, Claude, or ChatGPT</strong>. The AI will read your full project structure and guide you through implementing this step.
            </DialogDescription>
          </DialogHeader>

          {/* Task context reminder */}
          <div className="flex items-start gap-3 p-3 rounded-lg bg-zinc-900/60 border border-zinc-800 mt-1">
            <div className="w-1.5 h-full min-h-[40px] rounded-full bg-blue-500/50 shrink-0" />
            <div>
              <div className="text-xs text-zinc-500 mb-0.5 uppercase tracking-wider">Task to implement</div>
              <div className="text-sm font-semibold text-zinc-200">{selectedTask?.title}</div>
              {selectedTask?.description && (
                <p className="text-xs text-zinc-400 mt-1 leading-relaxed">{selectedTask?.description}</p>
              )}
            </div>
          </div>
          
          <div className="mt-2">
            {isGeneratingPrompt ? (
              <div className="flex flex-col items-center justify-center py-12 space-y-4">
                <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />
                <p className="text-zinc-400 text-sm">Reading your project architecture and crafting instructions...</p>
                <p className="text-zinc-600 text-xs">This includes your full tech stack, all planned steps, and the specific context for this task.</p>
              </div>
            ) : (
              <div className="relative">
                <pre className="p-4 rounded-lg bg-zinc-900 border border-zinc-800 text-sm text-zinc-300 whitespace-pre-wrap font-mono h-72 overflow-y-auto">
                  {generatedPrompt}
                </pre>
                <Button 
                  className="absolute top-2 right-2 h-8 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 text-xs"
                  onClick={() => navigator.clipboard.writeText(generatedPrompt)}
                >
                  Copy ✓
                </Button>
              </div>
            )}
            {!isGeneratingPrompt && generatedPrompt && (
              <p className="text-xs text-zinc-600 mt-2 text-center">
                💡 Paste this into your AI coding assistant and it will implement the task step by step.
              </p>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
