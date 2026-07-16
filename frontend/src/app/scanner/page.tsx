'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Search, ShieldAlert, Wrench, CheckCircle, ArrowLeft, Loader2, Code2, LayoutDashboard } from 'lucide-react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { ReactFlow, Background, Controls, Handle, Position } from '@xyflow/react';
import '@xyflow/react/dist/style.css';

interface ScanResult {
  score: { overall: number; security: number; devops: number; architecture: number };
  techStack?: Array<{ name: string; simpleIconSlug: string; category: string }>;
  findings: Array<{ category: string; issue: string; impact: string }>;
  checklist?: Array<{ id: string; category: string; title: string; description: string; relatedTech: string[]; status: string }>;
  nodes?: Array<any>;
  edges?: Array<any>;
}

function ScannerNode({ data }: { data: any }) {
  return (
    <div className="px-6 py-3 rounded-xl border border-zinc-800 bg-zinc-950/80 backdrop-blur text-zinc-300 font-semibold text-sm shadow-xl min-w-[120px] text-center">
      <Handle type="target" position={Position.Top} className="bg-zinc-700" />
      {data.label}
      <Handle type="source" position={Position.Bottom} className="bg-zinc-700" />
    </div>
  );
}

const nodeTypes = { scanner: ScannerNode };

export default function ScannerPage() {
  const [url, setUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<ScanResult | null>(null);

  const handleScan = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!url) return;
    setLoading(true);
    setResult(null);

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/ai/scan-github`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ githubUrl: url })
      });
      const data = await res.json();
      setResult(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const getImpactColor = (impact: string) => {
    if (impact === 'High') return 'text-red-400 border-red-400/20 bg-red-400/10';
    if (impact === 'Medium') return 'text-yellow-400 border-yellow-400/20 bg-yellow-400/10';
    return 'text-blue-400 border-blue-400/20 bg-blue-400/10';
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 p-6 md:p-12 relative overflow-hidden">
      {/* Background Gradients */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-red-500/10 rounded-full blur-[128px]" />
      </div>

      <div className="relative z-10 max-w-6xl mx-auto space-y-8">
        <div className="flex items-center gap-4">
          <Link href="/">
            <Button variant="outline" size="icon" className="border-zinc-800 bg-zinc-900 hover:bg-zinc-800">
              <ArrowLeft className="w-4 h-4" />
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">GitHub Architecture Scanner</h1>
            <p className="text-zinc-400 mt-1">Paste a public repository URL to get a Production Readiness Score.</p>
          </div>
        </div>

        <Card className="bg-zinc-950/50 border-zinc-800">
          <CardContent className="pt-6">
            <form onSubmit={handleScan} className="flex gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-3 h-4 w-4 text-zinc-500" />
                <Input 
                  value={url}
                  onChange={e => setUrl(e.target.value)}
                  placeholder="https://github.com/facebook/react" 
                  className="pl-10 bg-zinc-900 border-zinc-800"
                />
              </div>
              <Button type="submit" disabled={loading} className="bg-blue-600 hover:bg-blue-500 px-8">
                {loading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : null}
                Scan Repository
              </Button>
            </form>
          </CardContent>
        </Card>

        {loading && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col items-center justify-center py-32 gap-4">
            <Loader2 className="w-12 h-12 text-blue-500 animate-spin" />
            <h2 className="text-xl font-medium">Analyzing Repository Structure...</h2>
            <p className="text-zinc-500">Extracting dependencies, reading package.json, and scoring architecture.</p>
          </motion.div>
        )}

        {result && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
            
            {/* Top Score Cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <Card className="bg-zinc-900/50 border-zinc-800">
                <CardHeader className="pb-2">
                  <CardDescription>Overall Score</CardDescription>
                  <CardTitle className="text-4xl text-blue-400">{result.score.overall}%</CardTitle>
                </CardHeader>
                <CardContent><Progress value={result.score.overall} className="bg-zinc-800 h-2" /></CardContent>
              </Card>
              <Card className="bg-zinc-900/50 border-zinc-800">
                <CardHeader className="pb-2">
                  <CardDescription>Security</CardDescription>
                  <CardTitle className="text-3xl text-zinc-200">{result.score.security}%</CardTitle>
                </CardHeader>
                <CardContent><Progress value={result.score.security} className="bg-zinc-800 h-1.5" /></CardContent>
              </Card>
              <Card className="bg-zinc-900/50 border-zinc-800">
                <CardHeader className="pb-2">
                  <CardDescription>DevOps</CardDescription>
                  <CardTitle className="text-3xl text-zinc-200">{result.score.devops}%</CardTitle>
                </CardHeader>
                <CardContent><Progress value={result.score.devops} className="bg-zinc-800 h-1.5" /></CardContent>
              </Card>
              <Card className="bg-zinc-900/50 border-zinc-800">
                <CardHeader className="pb-2">
                  <CardDescription>Architecture</CardDescription>
                  <CardTitle className="text-3xl text-zinc-200">{result.score.architecture}%</CardTitle>
                </CardHeader>
                <CardContent><Progress value={result.score.architecture} className="bg-zinc-800 h-1.5" /></CardContent>
              </Card>
            </div>

            {/* Inferred Tech Stack */}
            {result.techStack && result.techStack.length > 0 && (
              <Card className="bg-zinc-900/50 border-zinc-800">
                <CardHeader className="pb-4">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Code2 className="w-5 h-5 text-purple-400" />
                    Inferred Tech Stack
                  </CardTitle>
                </CardHeader>
                <CardContent className="flex flex-wrap gap-2">
                  {result.techStack.map((tech, idx) => (
                    <Badge key={idx} variant="outline" className="bg-zinc-950 border-zinc-700 text-zinc-300 py-1.5 px-3 flex items-center gap-2 shadow-sm">
                      {tech.simpleIconSlug && (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={`https://cdn.simpleicons.org/${tech.simpleIconSlug}/60a5fa`}
                          alt=""
                          className="w-4 h-4 shrink-0"
                          onError={(e) => { e.currentTarget.style.display = 'none'; }}
                        />
                      )}
                      <span className="font-medium text-sm">{tech.name}</span>
                      {tech.category && (
                        <span className="text-[10px] text-zinc-500 ml-1 uppercase tracking-wider bg-zinc-900 px-1.5 py-0.5 rounded-sm border border-zinc-800">
                          {tech.category}
                        </span>
                      )}
                    </Badge>
                  ))}
                </CardContent>
              </Card>
            )}

            <div className="grid md:grid-cols-2 gap-6">
              {/* Architecture Map (Left) */}
              <div className="space-y-6">
                {result.nodes && result.nodes.length > 0 ? (
                  <Card className="bg-zinc-950/50 border-zinc-800 flex flex-col h-[500px]">
                    <CardHeader>
                      <CardTitle className="text-lg flex items-center gap-2">
                        <LayoutDashboard className="w-5 h-5 text-blue-400" />
                        Architecture Map
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="flex-1 p-0 relative rounded-b-xl overflow-hidden border-t border-zinc-800 bg-zinc-950">
                      <ReactFlow 
                        nodes={result.nodes.map(n => ({ ...n, type: 'scanner' }))} 
                        edges={result.edges || []} 
                        nodeTypes={nodeTypes}
                        fitView
                        attributionPosition="bottom-right"
                      >
                        <Background color="#3f3f46" gap={20} size={1} />
                        <Controls className="bg-zinc-900 border-zinc-800 fill-zinc-400" />
                      </ReactFlow>
                    </CardContent>
                  </Card>
                ) : (
                  <Card className="bg-zinc-950/50 border-zinc-800">
                    <CardHeader>
                      <CardTitle className="text-lg flex items-center gap-2">
                        <ShieldAlert className="w-5 h-5 text-red-400" />
                        Critical Findings
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      {result.findings.map((finding, idx) => (
                        <div key={idx} className="flex flex-col gap-2 p-3 bg-zinc-900 rounded-lg border border-zinc-800">
                          <div className="flex justify-between items-start">
                            <span className="font-medium text-sm">{finding.issue}</span>
                            <span className={`text-xs px-2 py-0.5 rounded-full border ${getImpactColor(finding.impact)}`}>
                              {finding.impact}
                            </span>
                          </div>
                          <span className="text-xs text-zinc-500">{finding.category}</span>
                        </div>
                      ))}
                    </CardContent>
                  </Card>
                )}
              </div>

              {/* Actionable Remediation Checklist (Right) */}
              <div className="space-y-6">
                {result.checklist && result.checklist.length > 0 ? (
                  <Card className="bg-zinc-950/50 border-zinc-800 flex flex-col h-[500px]">
                    <CardHeader className="pb-4">
                      <CardTitle className="text-lg flex items-center gap-2">
                        <Wrench className="w-5 h-5 text-green-400" />
                        Actionable Remediation Checklist
                      </CardTitle>
                      <CardDescription>
                        AI generated tasks to fix vulnerabilities and improve architecture.
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="flex-1 overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-zinc-700">
                      <div className="space-y-6">
                        {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
                        {Object.entries(result.checklist.reduce((acc: any, task: any) => {
                          const cat = task.category || 'General';
                          if (!acc[cat]) acc[cat] = [];
                          acc[cat].push(task);
                          return acc;
                        }, {})).map(([category, tasks]: [string, any], catIdx) => (
                          <div key={catIdx} className="space-y-3">
                            <h4 className="text-xs font-bold text-purple-400 uppercase tracking-wider pl-1">{category}</h4>
                            <div className="space-y-3">
                              {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
                              {tasks.map((task: any, idx: number) => (
                                <div key={idx} className="flex items-start gap-3 p-3 bg-zinc-900 rounded-lg border border-zinc-800 hover:border-zinc-700 transition-colors shadow-sm">
                                  <div className="mt-0.5 border border-zinc-600 w-4 h-4 rounded-[3px] shrink-0 flex items-center justify-center bg-zinc-950 hover:border-zinc-400 cursor-pointer transition-colors" />
                                  <div className="flex flex-col gap-1 w-full">
                                    <div className="flex items-start justify-between gap-4">
                                      <span className="text-sm font-semibold text-zinc-200">
                                        {task.title}
                                      </span>
                                    </div>
                                    {task.description && (
                                      <p className="text-xs leading-relaxed mt-0.5 text-zinc-400">
                                        {task.description}
                                      </p>
                                    )}
                                    {task.relatedTech && task.relatedTech.length > 0 && (
                                      <div className="flex items-center gap-1.5 flex-wrap mt-2">
                                        {task.relatedTech.map((tech: string, i: number) => (
                                          <span key={i} className="text-[9px] font-medium bg-zinc-800 text-zinc-300 px-1.5 py-0.5 rounded border border-zinc-700 whitespace-nowrap">
                                            {tech}
                                          </span>
                                        ))}
                                      </div>
                                    )}
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                ) : (
                  <Card className="bg-zinc-950/50 border-zinc-800">
                    <CardHeader>
                      <CardTitle className="text-lg flex items-center gap-2">
                        <Wrench className="w-5 h-5 text-green-400" />
                        Recommended Improvements
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-3">
                        {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
                        {(result as any).improvements?.map((improvement: string, idx: number) => (
                          <li key={idx} className="flex items-start gap-3 text-sm text-zinc-300">
                            <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 shrink-0" />
                            {improvement}
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>
                )}
              </div>

            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}
