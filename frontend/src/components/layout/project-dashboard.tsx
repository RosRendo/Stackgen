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
import { ArrowRight, Save, Share2, Download, CheckCircle2, Circle, Clock, ChevronDown, Check, FolderGit2, Terminal, Code, Code2, Server, LayoutDashboard, Shield, Cloud, Loader2, Lock, CreditCard, Mail, HardDrive, Layers, BarChart2, Activity, Search, Bot, Eye, Zap, Database, DollarSign } from 'lucide-react';
import { TechStackBoard } from './tech-stack-board';
import { ArchitectureTierNode } from './architecture-node';
import { motion } from 'framer-motion';

import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { MASTER_CHECKLIST } from '@/data/master-checklist-data';

export type AppCategory =
  | 'Frontend' | 'Backend' | 'Database' | 'DevOps' | 'Testing'
  | 'Auth' | 'Payment' | 'Email' | 'Storage' | 'Queue'
  | 'Analytics' | 'Monitoring' | 'Security' | 'Search' | 'AI'
  | 'Observability';

export function getCategoryFromLabel(label: string): AppCategory | null {
  const l = label.toLowerCase();
  if (l.includes('auth') || l.includes('login') || l.includes('oauth') || l.includes('sso') || l.includes('identity') || l.includes('jwt') || l.includes('session') || l.includes('mfa')) return 'Auth';
  if (l.includes('payment') || l.includes('billing') || l.includes('stripe') || l.includes('paddle') || l.includes('subscription') || l.includes('checkout')) return 'Payment';
  if (l.includes('email') || l.includes('resend') || l.includes('sendgrid') || l.includes('ses') || l.includes('smtp') || l.includes('mailgun')) return 'Email';
  if (l.includes('storage') || l.includes('s3') || l.includes('upload') || l.includes('file') || l.includes('cdn') || l.includes('cloudinary') || l.includes('bucket')) return 'Storage';
  if (l.includes('queue') || l.includes('bullmq') || l.includes('kafka') || l.includes('rabbitmq') || l.includes('worker') || l.includes('job') || l.includes('message') || l.includes('stream')) return 'Queue';
  if (l.includes('analytics') || l.includes('posthog') || l.includes('mixpanel') || l.includes('funnel') || l.includes('track') || l.includes('segment') || l.includes('event')) return 'Analytics';
  if (l.includes('monitoring') || l.includes('sentry') || l.includes('error') || l.includes('uptime') || l.includes('alert')) return 'Monitoring';
  if (l.includes('observ') || l.includes('grafana') || l.includes('prometheus') || l.includes('datadog') || l.includes('otel') || l.includes('telemetry') || l.includes('tracing') || l.includes('loki') || l.includes('slo') || l.includes('metric')) return 'Observability';
  if (l.includes('search') || l.includes('elasticsearch') || l.includes('meilisearch') || l.includes('typesense') || l.includes('algolia') || l.includes('full-text') || l.includes('fulltext') || l.includes('audit log')) return 'Search';
  if (l.includes('ai') || l.includes('openai') || l.includes('langchain') || l.includes('vector') || l.includes('rag') || l.includes('llm') || l.includes('gpt') || l.includes('copilot') || l.includes('pinecone') || l.includes('classify') || l.includes('summariz')) return 'AI';
  if (l.includes('security') || l.includes('vault') || l.includes('opa') || l.includes('waf') || l.includes('helmet') || l.includes('istio') || l.includes('mtls') || l.includes('secret') || l.includes('cors') || l.includes('rate limit') || l.includes('soc2') || l.includes('gdpr') || l.includes('zero trust') || l.includes('compliance')) return 'Security';
  if (l.includes('frontend') || l.includes('client') || l.includes('web') || l.includes('ui') || l.includes('next') || l.includes('react') || l.includes('vue') || l.includes('storybook') || l.includes('mfe') || l.includes('design system') || l.includes('module federation') || l.includes('turbo') || l.includes('wcag') || l.includes('accessib') || l.includes('white-label') || l.includes('white label') || l.includes('tenant')) return 'Frontend';
  if (l.includes('backend') || l.includes('api') || l.includes('server') || l.includes('service') || l.includes('nest') || l.includes('express') || l.includes('spring') || l.includes('grpc') || l.includes('microservice') || l.includes('gateway') || l.includes('domain') || l.includes('cqrs') || l.includes('ddd') || l.includes('bounded') || l.includes('outbox') || l.includes('swagger') || l.includes('versioning')) return 'Backend';
  if (l.includes('database') || l.includes('db') || l.includes('postgres') || l.includes('mysql') || l.includes('mongodb') || l.includes('redis') || l.includes('sql') || l.includes('cache') || l.includes('cassandra') || l.includes('replica') || l.includes('schema') || l.includes('migration') || l.includes('index') || l.includes('pgbouncer') || l.includes('rls') || l.includes('row level') || l.includes('seed') || l.includes('rds')) return 'Database';
  if (l.includes('devops') || l.includes('deploy') || l.includes('docker') || l.includes('hosting') || l.includes('cloud') || l.includes('vercel') || l.includes('aws') || l.includes('gcp') || l.includes('ci/cd') || l.includes('k8s') || l.includes('kubernetes') || l.includes('nginx') || l.includes('terraform') || l.includes('helm') || l.includes('argocd') || l.includes('ecs') || l.includes('ekS') || l.includes('ssl') || l.includes('domain') || l.includes('github action') || l.includes('chaos') || l.includes('blue-green') || l.includes('canary') || l.includes('gitops')) return 'DevOps';
  if (l.includes('test') || l.includes('qa') || l.includes('jest') || l.includes('vitest') || l.includes('playwright') || l.includes('cypress') || l.includes('supertest') || l.includes('junit') || l.includes('coverage') || l.includes('load test') || l.includes('k6') || l.includes('testcontainer') || l.includes('unit') || l.includes('integrat') || l.includes('e2e')) return 'Testing';
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
    setGeneratedData,
    masterChecklist,
    toggleMasterChecklistItem
  } = useProjectStore();

  const [selectedTech, setSelectedTech] = useState<TechItem | null>(null);
  const [selectedTask, setSelectedTask] = useState<ProjectTask | null>(null);
  const [selectedTaskDetail, setSelectedTaskDetail] = useState<{ task: ProjectTask; stepNum: number; cat: string; allTasks: ProjectTask[] } | null>(null);
  const [generatedPrompt, setGeneratedPrompt] = useState<string>('');
  const [isGeneratingPrompt, setIsGeneratingPrompt] = useState(false);
  const [dashboardFilterCategory, setDashboardFilterCategory] = useState<AppCategory | null>(null);

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
    const cls = 'w-4 h-4';
    switch (category) {
      case 'Frontend':    return <LayoutDashboard className={`${cls} text-pink-400`} />;
      case 'Backend':     return <Server          className={`${cls} text-emerald-400`} />;
      case 'Database':    return <Database        className={`${cls} text-sky-400`} />;
      case 'Auth':        return <Lock            className={`${cls} text-violet-400`} />;
      case 'Payment':     return <CreditCard      className={`${cls} text-yellow-400`} />;
      case 'Email':       return <Mail            className={`${cls} text-orange-400`} />;
      case 'Storage':     return <HardDrive       className={`${cls} text-cyan-400`} />;
      case 'Queue':       return <Layers          className={`${cls} text-indigo-400`} />;
      case 'Analytics':   return <BarChart2       className={`${cls} text-lime-400`} />;
      case 'Monitoring':  return <Activity        className={`${cls} text-red-400`} />;
      case 'Observability': return <Eye           className={`${cls} text-teal-400`} />;
      case 'Search':      return <Search          className={`${cls} text-fuchsia-400`} />;
      case 'AI':          return <Bot             className={`${cls} text-blue-400`} />;
      case 'Security':    return <Shield          className={`${cls} text-amber-400`} />;
      case 'DevOps':      return <Cloud           className={`${cls} text-blue-500`} />;
      case 'Testing':     return <Zap             className={`${cls} text-green-400`} />;
      default:            return <Code            className={`${cls} text-zinc-500`} />;
    }
  };

  const getCategoryColor = (category: string): string => {
    switch (category) {
      case 'Frontend':    return 'border-pink-500/30 bg-pink-500/10 text-pink-300';
      case 'Backend':     return 'border-emerald-500/30 bg-emerald-500/10 text-emerald-300';
      case 'Database':    return 'border-sky-500/30 bg-sky-500/10 text-sky-300';
      case 'Auth':        return 'border-violet-500/30 bg-violet-500/10 text-violet-300';
      case 'Payment':     return 'border-yellow-500/30 bg-yellow-500/10 text-yellow-300';
      case 'Email':       return 'border-orange-500/30 bg-orange-500/10 text-orange-300';
      case 'Storage':     return 'border-cyan-500/30 bg-cyan-500/10 text-cyan-300';
      case 'Queue':       return 'border-indigo-500/30 bg-indigo-500/10 text-indigo-300';
      case 'Analytics':   return 'border-lime-500/30 bg-lime-500/10 text-lime-300';
      case 'Monitoring':  return 'border-red-500/30 bg-red-500/10 text-red-300';
      case 'Observability': return 'border-teal-500/30 bg-teal-500/10 text-teal-300';
      case 'Search':      return 'border-fuchsia-500/30 bg-fuchsia-500/10 text-fuchsia-300';
      case 'AI':          return 'border-blue-500/30 bg-blue-500/10 text-blue-300';
      case 'Security':    return 'border-amber-500/30 bg-amber-500/10 text-amber-300';
      case 'DevOps':      return 'border-blue-600/30 bg-blue-600/10 text-blue-400';
      case 'Testing':     return 'border-green-500/30 bg-green-500/10 text-green-300';
      default:            return 'border-zinc-500/30 bg-zinc-500/10 text-zinc-300';
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
        credentials: 'include',
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
  const [isExportingGuide, setIsExportingGuide] = useState(false);
  const [isEstimatingCost, setIsEstimatingCost] = useState(false);
  const [costEstimate, setCostEstimate] = useState<any>(null);
  const [isCostDialogOpen, setIsCostDialogOpen] = useState(false);

  const downloadFile = (filename: string, content: string) => {
    const element = document.createElement('a');
    const file = new Blob([content], {type: 'text/plain'});
    element.href = URL.createObjectURL(file);
    element.download = filename;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  const handleExportGuide = async () => {
    setIsExportingGuide(true);
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/ai/generate-guide`, {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          projectName,
          description: useProjectStore.getState().description,
          techStack,
          checklist
        })
      });
      const data = await res.json();
      if (data.guide) {
        downloadFile('IMPLEMENTATION_GUIDE.md', data.guide);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsExportingGuide(false);
    }
  };

  const handleEstimateCost = async () => {
    setIsEstimatingCost(true);
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/ai/estimate-cost`, {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          level: complexity,
          techStack
        })
      });
      const data = await res.json();
      setCostEstimate(data);
      setIsCostDialogOpen(true);
    } catch (err) {
      console.error(err);
    } finally {
      setIsEstimatingCost(false);
    }
  };

  const handleExportDocs = async () => {
    setIsExporting(true);
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/ai/generate-docs`, {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          projectName,
          description: useProjectStore.getState().description,
          techStack,
          nodes: architectureNodes
        })
      });
      const data = await res.json();
      
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
        credentials: 'include',
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
          <Button variant="outline" onClick={handleEstimateCost} disabled={isEstimatingCost} className="bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-400 border-emerald-600/50">
            {isEstimatingCost ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <DollarSign className="w-4 h-4 mr-2" />}
            Estimate Costs
          </Button>
          <Button variant="outline" onClick={handleGenerateZip} disabled={isZipping} className="bg-blue-600 hover:bg-blue-500 text-white border-blue-600">
            {isZipping ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : null}
            Download Boilerplate
          </Button>
          <Button variant="outline" onClick={handleExportGuide} disabled={isExportingGuide} className="bg-orange-600/20 hover:bg-orange-600/30 text-orange-400 border-orange-600/50">
            {isExportingGuide ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Terminal className="w-4 h-4 mr-2" />}
            Export Full Guide
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
                      Frontend:     { border: 'border-pink-500/30',    label: 'text-pink-400',    dot: 'bg-pink-500',    step: 'bg-pink-500/10 text-pink-300 border-pink-500/20' },
                      Backend:      { border: 'border-emerald-500/30', label: 'text-emerald-400', dot: 'bg-emerald-500', step: 'bg-emerald-500/10 text-emerald-300 border-emerald-500/20' },
                      Database:     { border: 'border-sky-500/30',     label: 'text-sky-400',     dot: 'bg-sky-500',     step: 'bg-sky-500/10 text-sky-300 border-sky-500/20' },
                      Auth:         { border: 'border-violet-500/30',  label: 'text-violet-400',  dot: 'bg-violet-500',  step: 'bg-violet-500/10 text-violet-300 border-violet-500/20' },
                      Payment:      { border: 'border-yellow-500/30',  label: 'text-yellow-400',  dot: 'bg-yellow-500',  step: 'bg-yellow-500/10 text-yellow-300 border-yellow-500/20' },
                      Email:        { border: 'border-orange-500/30',  label: 'text-orange-400',  dot: 'bg-orange-500',  step: 'bg-orange-500/10 text-orange-300 border-orange-500/20' },
                      Storage:      { border: 'border-cyan-500/30',    label: 'text-cyan-400',    dot: 'bg-cyan-500',    step: 'bg-cyan-500/10 text-cyan-300 border-cyan-500/20' },
                      Queue:        { border: 'border-indigo-500/30',  label: 'text-indigo-400',  dot: 'bg-indigo-500',  step: 'bg-indigo-500/10 text-indigo-300 border-indigo-500/20' },
                      Analytics:    { border: 'border-lime-500/30',    label: 'text-lime-400',    dot: 'bg-lime-500',    step: 'bg-lime-500/10 text-lime-300 border-lime-500/20' },
                      Monitoring:   { border: 'border-red-500/30',     label: 'text-red-400',     dot: 'bg-red-500',     step: 'bg-red-500/10 text-red-300 border-red-500/20' },
                      Observability:{ border: 'border-teal-500/30',    label: 'text-teal-400',    dot: 'bg-teal-500',    step: 'bg-teal-500/10 text-teal-300 border-teal-500/20' },
                      Search:       { border: 'border-fuchsia-500/30', label: 'text-fuchsia-400', dot: 'bg-fuchsia-500', step: 'bg-fuchsia-500/10 text-fuchsia-300 border-fuchsia-500/20' },
                      AI:           { border: 'border-blue-400/30',    label: 'text-blue-400',    dot: 'bg-blue-400',    step: 'bg-blue-400/10 text-blue-300 border-blue-400/20' },
                      Security:     { border: 'border-amber-500/30',   label: 'text-amber-400',   dot: 'bg-amber-500',   step: 'bg-amber-500/10 text-amber-300 border-amber-500/20' },
                      DevOps:       { border: 'border-blue-600/30',    label: 'text-blue-500',    dot: 'bg-blue-600',    step: 'bg-blue-600/10 text-blue-400 border-blue-600/20' },
                      Testing:      { border: 'border-green-500/30',   label: 'text-green-400',   dot: 'bg-green-500',   step: 'bg-green-500/10 text-green-300 border-green-500/20' },
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

                        {/* Phases & Tasks */}
                        <div className={`border-l-2 ${colors.border} ml-1 pl-5 space-y-8 mt-4`}>
                          {Object.entries(
                            tasks.reduce((pAcc, t) => {
                              const p = t.phase || 'Foundation';
                              if (!pAcc[p]) pAcc[p] = [];
                              pAcc[p].push(t);
                              return pAcc;
                            }, {} as Record<string, ProjectTask[]>)
                          ).map(([phase, phaseTasks]) => (
                            <div key={phase} className="space-y-4 relative">
                              {/* Phase Label inline */}
                              <div className="absolute -left-5 -top-1 w-10 border-t-2 border-zinc-800" />
                              <h5 className="text-[11px] font-bold uppercase tracking-widest text-zinc-500 mb-4 pl-7">
                                {phase}
                              </h5>
                              
                              <div className="space-y-4 pl-4">
                                {phaseTasks.map((task) => {
                                  const taskIdx = tasks.indexOf(task);
                                  const stepNum = taskIdx + 1;
                                  const isDone = task.status === 'DONE';
                            return (
                              <div 
                                key={task.id} 
                                className={`relative rounded-xl border transition-all duration-200 cursor-pointer ${
                                  isDone 
                                    ? 'border-zinc-800/40 bg-zinc-900/10 opacity-60' 
                                    : `border-zinc-800/60 bg-zinc-900/40 hover:bg-zinc-900/70 hover:border-zinc-700`
                                }`}
                                onClick={() => setSelectedTaskDetail({ task, stepNum, cat, allTasks: tasks })}
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
                                        onCheckedChange={() => { toggleTaskStatus(task.id); }}
                                        onClick={(e) => e.stopPropagation()}
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

                                  {/* Description — truncated preview */}
                                  {task.description && (
                                    <p className={`text-xs leading-relaxed mt-2 ml-7 line-clamp-2 ${isDone ? 'text-zinc-600' : 'text-zinc-400'}`}>
                                      {task.description}
                                    </p>
                                  )}

                                  {/* Footer: tech + hint */}
                                  <div className="flex items-center justify-between gap-4 mt-3 ml-7">
                                    {task.relatedTech && task.relatedTech.length > 0 && (
                                      <div className="flex items-center gap-1.5 flex-wrap">
                                        <span className="text-[9px] text-zinc-600 mr-0.5">Uses:</span>
                                        {task.relatedTech.slice(0, 3).map((tech, i) => (
                                          <span key={i} className={`text-[9px] font-medium px-1.5 py-0.5 rounded border whitespace-nowrap ${
                                            isDone ? 'bg-zinc-900/50 text-zinc-600 border-zinc-800' : 'bg-zinc-800/80 text-zinc-300 border-zinc-700'
                                          }`}>
                                            {tech}
                                          </span>
                                        ))}
                                        {task.relatedTech.length > 3 && <span className="text-[9px] text-zinc-600">+{task.relatedTech.length - 3} more</span>}
                                      </div>
                                    )}
                                    <span className="text-[10px] text-zinc-600 ml-auto">Click for details →</span>
                                  </div>
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      ))}
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

      {/* Task Detail Sidebar */}
      <Sheet open={!!selectedTaskDetail} onOpenChange={(open) => !open && setSelectedTaskDetail(null)}>
        <SheetContent className="bg-zinc-950 border-zinc-800 text-zinc-100 sm:max-w-lg w-full overflow-y-auto flex flex-col gap-0 p-0">
          {selectedTaskDetail && (() => {
            const { task, stepNum, cat, allTasks } = selectedTaskDetail;
            const isDone = task.status === 'DONE';
            const catColors: Record<string, { border: string; label: string; accent: string; step: string; dot: string }> = {
              Frontend:     { border: 'border-pink-500/30',    label: 'text-pink-400',    accent: 'bg-pink-500/10',    step: 'bg-pink-500/10 text-pink-300 border-pink-500/20',    dot: 'bg-pink-500' },
              Backend:      { border: 'border-emerald-500/30', label: 'text-emerald-400', accent: 'bg-emerald-500/10', step: 'bg-emerald-500/10 text-emerald-300 border-emerald-500/20', dot: 'bg-emerald-500' },
              Database:     { border: 'border-sky-500/30',     label: 'text-sky-400',     accent: 'bg-sky-500/10',     step: 'bg-sky-500/10 text-sky-300 border-sky-500/20',     dot: 'bg-sky-500' },
              Auth:         { border: 'border-violet-500/30',  label: 'text-violet-400',  accent: 'bg-violet-500/10',  step: 'bg-violet-500/10 text-violet-300 border-violet-500/20',  dot: 'bg-violet-500' },
              Payment:      { border: 'border-yellow-500/30',  label: 'text-yellow-400',  accent: 'bg-yellow-500/10',  step: 'bg-yellow-500/10 text-yellow-300 border-yellow-500/20',  dot: 'bg-yellow-500' },
              Email:        { border: 'border-orange-500/30',  label: 'text-orange-400',  accent: 'bg-orange-500/10',  step: 'bg-orange-500/10 text-orange-300 border-orange-500/20',  dot: 'bg-orange-500' },
              Storage:      { border: 'border-cyan-500/30',    label: 'text-cyan-400',    accent: 'bg-cyan-500/10',    step: 'bg-cyan-500/10 text-cyan-300 border-cyan-500/20',    dot: 'bg-cyan-500' },
              Queue:        { border: 'border-indigo-500/30',  label: 'text-indigo-400',  accent: 'bg-indigo-500/10',  step: 'bg-indigo-500/10 text-indigo-300 border-indigo-500/20',  dot: 'bg-indigo-500' },
              Analytics:    { border: 'border-lime-500/30',    label: 'text-lime-400',    accent: 'bg-lime-500/10',    step: 'bg-lime-500/10 text-lime-300 border-lime-500/20',    dot: 'bg-lime-500' },
              Monitoring:   { border: 'border-red-500/30',     label: 'text-red-400',     accent: 'bg-red-500/10',     step: 'bg-red-500/10 text-red-300 border-red-500/20',     dot: 'bg-red-500' },
              Observability:{ border: 'border-teal-500/30',    label: 'text-teal-400',    accent: 'bg-teal-500/10',    step: 'bg-teal-500/10 text-teal-300 border-teal-500/20',    dot: 'bg-teal-500' },
              Search:       { border: 'border-fuchsia-500/30', label: 'text-fuchsia-400', accent: 'bg-fuchsia-500/10', step: 'bg-fuchsia-500/10 text-fuchsia-300 border-fuchsia-500/20', dot: 'bg-fuchsia-500' },
              AI:           { border: 'border-blue-400/30',    label: 'text-blue-400',    accent: 'bg-blue-400/10',    step: 'bg-blue-400/10 text-blue-300 border-blue-400/20',    dot: 'bg-blue-400' },
              Security:     { border: 'border-amber-500/30',   label: 'text-amber-400',   accent: 'bg-amber-500/10',   step: 'bg-amber-500/10 text-amber-300 border-amber-500/20',   dot: 'bg-amber-500' },
              DevOps:       { border: 'border-blue-600/30',    label: 'text-blue-500',    accent: 'bg-blue-600/10',    step: 'bg-blue-600/10 text-blue-400 border-blue-600/20',    dot: 'bg-blue-600' },
              Testing:      { border: 'border-green-500/30',   label: 'text-green-400',   accent: 'bg-green-500/10',   step: 'bg-green-500/10 text-green-300 border-green-500/20',   dot: 'bg-green-500' },
            };
            const colors = catColors[cat] || { border: 'border-zinc-700', label: 'text-zinc-400', accent: 'bg-zinc-800', step: 'bg-zinc-800 text-zinc-300 border-zinc-700', dot: 'bg-zinc-500' };
            const prevTask = allTasks[stepNum - 2] || null;
            const nextTask = allTasks[stepNum] || null;

            return (
              <>
                {/* Header band */}
                <div className="px-6 pt-8 pb-5 border-b border-zinc-800/40">
                  <div className="flex items-center gap-2 mb-3">
                    <div className={`w-2 h-2 rounded-full ${colors.dot}`} />
                    <span className={`text-xs font-bold uppercase tracking-widest ${colors.label}`}>{cat}</span>
                    <span className="text-zinc-600 text-xs">•</span>
                    <span className="text-zinc-500 text-xs">Step {stepNum} of {allTasks.length}</span>
                  </div>
                  <SheetTitle className={`text-xl font-bold leading-snug ${isDone ? 'line-through text-zinc-500' : 'text-white'}`}>
                    {task.title}
                  </SheetTitle>
                  <div className="flex items-center gap-2 mt-3">
                    {isDone ? (
                      <span className="text-xs font-semibold text-green-400">✓ Completed</span>
                    ) : stepNum === 1 ? (
                      <span className={`text-xs font-semibold ${colors.label}`}>▶ Start here</span>
                    ) : (
                      <span className="text-xs font-semibold text-amber-400">Up next</span>
                    )}
                    <Checkbox
                      checked={isDone}
                      onCheckedChange={() => { toggleTaskStatus(task.id); setSelectedTaskDetail(prev => prev ? { ...prev, task: { ...prev.task, status: isDone ? 'TODO' : 'DONE' } } : null); }}
                      className="border-zinc-600 data-[state=checked]:bg-green-500 data-[state=checked]:border-green-500 ml-auto"
                    />
                    <span className="text-xs text-zinc-500">{isDone ? 'Mark incomplete' : 'Mark done'}</span>
                  </div>
                </div>

                {/* Body */}
                <div className="px-6 py-5 space-y-8 flex-1">
                  
                  {/* Stats Row */}
                  {(task.difficulty || task.estimatedTime) && (
                    <div className="flex items-center gap-4 text-xs font-medium text-zinc-400">
                      {task.difficulty && (
                        <div className="flex items-center gap-1.5 px-2 py-1 rounded-md bg-zinc-900/50">
                          <span className={task.difficulty.toLowerCase() === 'beginner' ? 'text-green-400' : task.difficulty.toLowerCase() === 'intermediate' ? 'text-amber-400' : 'text-red-400'}>
                            ■
                          </span>
                          Difficulty: {task.difficulty}
                        </div>
                      )}
                      {task.estimatedTime && (
                        <div className="flex items-center gap-1.5 px-2 py-1 rounded-md bg-zinc-900/50">
                          ⏱ Estimated Time: {task.estimatedTime}
                        </div>
                      )}
                    </div>
                  )}

                  {/* Tools used */}
                  {task.relatedTech && task.relatedTech.length > 0 && (
                    <div>
                      <h4 className="text-[10px] font-bold uppercase tracking-widest text-zinc-500 mb-2">Uses</h4>
                      <div className="flex flex-wrap gap-2">
                        {task.relatedTech.map((tech, i) => (
                          <span key={i} className="text-sm text-zinc-300 flex items-center gap-1.5">
                            <span className={colors.label}>✓</span> {tech}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Description */}
                  <div>
                    <h4 className="text-[10px] font-bold uppercase tracking-widest text-zinc-500 mb-2">Description</h4>
                    <p className="text-sm text-zinc-300 leading-relaxed">
                      {task.description || `Implement the core requirements for ${task.title}. Follow standard best practices for ${cat} development to ensure maintainability, security, and scalability.`}
                    </p>
                  </div>

                  {/* Task Internal Checklist */}
                  {task.checklist && task.checklist.length > 0 && (
                    <div>
                      <h4 className="text-[10px] font-bold uppercase tracking-widest text-zinc-500 mb-3">Checklist</h4>
                      <div className="space-y-3 pl-1">
                        {task.checklist.map((item, i) => (
                          <div key={i} className="flex items-start gap-3">
                            <div className="w-1.5 h-1.5 rounded-full mt-1.5 bg-zinc-600 shrink-0" />
                            <span className="text-sm text-zinc-300">{item}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Commands */}
                  {task.commands && task.commands.length > 0 && (
                    <div>
                      <h4 className="text-[10px] font-bold uppercase tracking-widest text-zinc-500 mb-3">Commands</h4>
                      <div className="bg-black/60 border border-zinc-800 rounded-lg p-4 font-mono text-xs text-zinc-300 space-y-2 overflow-x-auto">
                        {task.commands.map((cmd, i) => (
                          <div key={i} className="flex items-start gap-3">
                            <span className="text-zinc-600 select-none">$</span>
                            <span className="break-all whitespace-pre-wrap">{cmd}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Files Created */}
                  {task.files && task.files.length > 0 && (
                    <div>
                      <h4 className="text-[10px] font-bold uppercase tracking-widest text-zinc-500 mb-3">Files Created</h4>
                      <div className="flex flex-wrap gap-2">
                        {task.files.map((file, i) => (
                          <div key={i} className="flex items-center gap-2 text-sm text-zinc-300">
                            <span className="text-zinc-500 text-lg leading-none shrink-0">📄</span>
                            <span className="truncate">{file}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Learning Notes */}
                  {task.learningNotes && task.learningNotes.length > 0 && (
                    <div className="bg-transparent border-l-2 border-blue-500/50 pl-4 py-1">
                      <h4 className="text-[10px] font-bold uppercase tracking-widest text-blue-400 mb-3">Learning Notes</h4>
                      <ul className="space-y-2">
                        {task.learningNotes.map((note, i) => (
                          <li key={i} className="flex items-start gap-2 text-sm text-zinc-300">
                            <span className="text-blue-500 mt-0.5">•</span>
                            {note}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Expected Outcome */}
                  {task.expectedOutcome && task.expectedOutcome.length > 0 && (
                    <div className="bg-transparent border-l-2 border-green-500/50 pl-4 py-1">
                      <h4 className="text-[10px] font-bold uppercase tracking-widest text-green-400 mb-3">Expected Result</h4>
                      <ul className="space-y-2">
                        {task.expectedOutcome.map((outcome, i) => (
                          <li key={i} className="flex items-start gap-2 text-sm text-zinc-300">
                            <span className="text-green-500 mt-0.5">✓</span>
                            {outcome}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Master Checklist Match */}
                  {(() => {
                    // Find master checklist sections that match this task's category
                    const catKeywords: Record<string, string[]> = {
                      Frontend: ['frontend', 'design', 'ui', 'ux', 'layout', 'component', 'page', 'style', 'css', 'tailwind', 'next', 'react', 'routing'],
                      Backend:  ['backend', 'api', 'server', 'session', 'route', 'service', 'endpoint', 'rest', 'graphql', 'logic', 'microservice'],
                      Database: ['database', 'db', 'schema', 'sql', 'postgres', 'mysql', 'mongo', 'redis', 'orm', 'prisma', 'migration', 'data'],
                      Auth:     ['auth', 'authentication', 'login', 'signup', 'sso', 'oauth', 'jwt', 'session', 'cookie', 'clerk', 'supabase auth'],
                      Payment:  ['payment', 'stripe', 'billing', 'subscription', 'checkout', 'invoice', 'paddle'],
                      Email:    ['email', 'resend', 'sendgrid', 'ses', 'smtp', 'mail', 'notification'],
                      Storage:  ['storage', 's3', 'bucket', 'upload', 'file', 'image', 'asset', 'cdn', 'cloudinary'],
                      Queue:    ['queue', 'bullmq', 'kafka', 'rabbitmq', 'pubsub', 'sqs', 'worker', 'job', 'background', 'event'],
                      Analytics: ['analytics', 'mixpanel', 'posthog', 'segment', 'google analytics', 'tracking', 'event'],
                      Monitoring: ['monitoring', 'sentry', 'error', 'uptime', 'datadog', 'new relic', 'health'],
                      Observability: ['observability', 'grafana', 'prometheus', 'loki', 'tracing', 'opentelemetry', 'logs', 'metrics', 'trace'],
                      Search:   ['search', 'elasticsearch', 'algolia', 'meilisearch', 'typesense', 'query', 'index'],
                      AI:       ['ai', 'llm', 'openai', 'claude', 'vector', 'pinecone', 'embedding', 'rag', 'prompt'],
                      Security: ['security', 'permission', 'rbac', 'rate limit', 'csrf', 'xss', 'https', 'ssl', 'secret', 'vault', 'encryption', 'waf', 'cors'],
                      DevOps:   ['devops', 'deploy', 'docker', 'ci/cd', 'pipeline', 'cloud', 'server', 'host', 'domain', 'ssl', 'k8s', 'kubernetes', 'terraform'],
                      Testing:  ['test', 'qa', 'e2e', 'unit', 'jest', 'cypress', 'spec', 'mock', 'coverage', 'playwright', 'vitest', 'k6'],
                    };
                    const keywords = catKeywords[cat] || [];
                    const matchedSections: { phaseId: string; sectionTitle: string; items: { label: string; required: boolean }[] }[] = [];

                    MASTER_CHECKLIST.forEach(phase => {
                      phase.sections.forEach((section: any) => {
                        const stl = section.title.toLowerCase();
                        if (keywords.some(kw => stl.includes(kw))) {
                          matchedSections.push({
                            phaseId: phase.id,
                            sectionTitle: section.title,
                            items: section.items.slice(0, 6), // max 6 items
                          });
                        }
                      });
                    });

                    if (matchedSections.length === 0) return null;

                    return (
                      <div>
                        <h4 className="text-xs font-bold uppercase tracking-widest text-zinc-500 mb-3">✅ Master Checklist — Foundation Steps</h4>
                        <div className="space-y-6">
                          {matchedSections.slice(0, 3).map((section, si) => (
                            <div key={si}>
                              <div className={`text-xs font-bold uppercase tracking-widest ${colors.label} mb-2`}>
                                {section.sectionTitle}
                              </div>
                              <ul className="space-y-2">
                                {section.items.map((item: any, ii: number) => {
                                  const itemKey = `${section.phaseId}|${section.sectionTitle}|${item.label}`;
                                  const isChecked = masterChecklist[itemKey];
                                  return (
                                    <li key={ii} className="flex items-start gap-2.5">
                                      <Checkbox
                                        checked={isChecked}
                                        onCheckedChange={() => toggleMasterChecklistItem(itemKey)}
                                        className="mt-1 w-4 h-4 border-zinc-700 data-[state=checked]:bg-green-500 data-[state=checked]:border-green-500 shrink-0"
                                      />
                                      <span className={`text-sm leading-relaxed ${isChecked ? 'text-zinc-600 line-through' : item.required ? 'text-zinc-300' : 'text-zinc-500'}`}>
                                        {item.label}
                                        {!item.required && <span className="ml-1 text-[10px] text-zinc-500 italic">optional</span>}
                                      </span>
                                    </li>
                                  );
                                })}
                              </ul>
                            </div>
                          ))}
                          {matchedSections.length > 3 && (
                            <p className="text-xs text-zinc-600 text-center">
                              +{matchedSections.length - 3} more sections in the{' '}
                              <button onClick={() => { setSelectedTaskDetail(null); if (projectId) router.push(`/projects/${projectId}/checklist`); }} className="text-blue-400 underline hover:text-blue-300">
                                Full Checklist
                              </button>
                            </p>
                          )}
                        </div>
                      </div>
                    );
                  })()}

                  {/* Step context (prev / next) */}
                  <div>
                    <h4 className="text-xs font-bold uppercase tracking-widest text-zinc-500 mb-3">🗺️ Step Context</h4>
                    <div className="space-y-1">
                      {prevTask && (
                        <div className="flex items-start gap-3 py-2 opacity-70">
                          <span className="text-[10px] text-zinc-500 font-bold w-8 shrink-0">PREV</span>
                          <span className={`text-xs ${prevTask.status === 'DONE' ? 'line-through text-zinc-600' : 'text-zinc-400'}`}>{prevTask.title}</span>
                          {prevTask.status === 'DONE' && <span className="text-green-500 text-xs ml-auto shrink-0">✓</span>}
                        </div>
                      )}
                      <div className={`flex items-start gap-3 py-2 border-l-2 ${colors.border} pl-3 -ml-3.5`}>
                        <span className={`text-[10px] font-bold ${colors.label} w-8 shrink-0`}>NOW</span>
                        <span className="text-xs text-zinc-200 font-medium">{task.title}</span>
                      </div>
                      {nextTask && (
                        <div className="flex items-start gap-3 py-2 opacity-50">
                          <span className="text-[10px] text-zinc-500 font-bold w-8 shrink-0">NEXT</span>
                          <span className="text-xs text-zinc-500">{nextTask.title}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Footer CTA */}
                <div className="px-6 py-5 border-t border-zinc-800 bg-zinc-950 space-y-3">
                  <button
                    disabled={isDone}
                    onClick={() => { setSelectedTaskDetail(null); handleGeneratePrompt(task); }}
                    className={`w-full flex items-center justify-center gap-2 py-3 rounded-lg font-semibold text-sm transition-all ${
                      isDone 
                        ? 'opacity-30 cursor-not-allowed bg-zinc-800 text-zinc-600 border border-zinc-700'
                        : `bg-zinc-800/50 hover:bg-zinc-800 border border-zinc-700 text-zinc-200 hover:text-white hover:border-zinc-600`
                    }`}
                  >
                    <Terminal className="w-4 h-4" />
                    Get AI Instructions for this Step
                  </button>
                  <p className="text-[11px] text-zinc-600 text-center">
                    Generates a ready-to-paste prompt for Cursor, Copilot, or ChatGPT tailored to your full project stack.
                  </p>
                </div>
              </>
            );
          })()}
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

      {/* Cost Estimator Dialog */}
      <Dialog open={isCostDialogOpen} onOpenChange={setIsCostDialogOpen}>
        <DialogContent className="bg-zinc-950 border-zinc-800 text-zinc-100 max-w-xl max-h-[85vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-xl">
              <DollarSign className="w-5 h-5 text-emerald-400" />
              Projected Infrastructure Costs
            </DialogTitle>
            <DialogDescription className="text-zinc-400 mt-1">
              Estimated monthly costs to run this stack in production.
            </DialogDescription>
          </DialogHeader>

          {costEstimate && (
            <div className="space-y-6 mt-4">
              <div className="flex items-center justify-between p-4 rounded-lg bg-emerald-500/10 border border-emerald-500/20">
                <span className="text-sm font-medium text-emerald-400">Total Estimated Monthly Cost</span>
                <span className="text-2xl font-bold text-emerald-300">${costEstimate.totalMonthly}</span>
              </div>

              <div className="space-y-3">
                <h4 className="text-sm font-semibold text-zinc-300">Cost Breakdown</h4>
                {costEstimate.breakdown?.map((item: any, idx: number) => (
                  <div key={idx} className="flex items-start justify-between p-3 rounded-md bg-zinc-900 border border-zinc-800">
                    <div>
                      <div className="text-sm font-medium text-zinc-200">{item.service}</div>
                      <div className="text-xs text-zinc-500 mt-0.5">{item.description}</div>
                    </div>
                    <div className="text-sm font-bold text-zinc-300">${item.cost}</div>
                  </div>
                ))}
              </div>

              {costEstimate.notes && (
                <div className="p-3 rounded-md bg-blue-500/10 border border-blue-500/20">
                  <div className="text-xs text-blue-400 font-medium mb-1">AI Recommendation</div>
                  <div className="text-sm text-blue-300/80">{costEstimate.notes}</div>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
