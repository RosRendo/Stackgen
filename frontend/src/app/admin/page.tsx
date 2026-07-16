'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { authClient } from '@/lib/auth-client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Code2, Loader2 } from 'lucide-react';
import { MasterChecklist } from '@/components/admin/master-checklist';

interface Project {
  id: string;
  name: string;
  description: string;
  level: string;
  createdAt: string;
  userId: string;
  techStack: { name: string; simpleIconSlug?: string }[];
  costEstimate?: { totalMonthly: number; breakdown: { service: string; cost: number }[] };
  tasks: unknown[];
}

export default function AdminDashboard() {
  const router = useRouter();
  const { data: session, isPending } = authClient.useSession();
  
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);

  useEffect(() => {
    // Admin Guard
    if (!isPending) {
      if (!session) {
        router.push('/');
        return;
      }
      const isAdmin = session.user.email === 'rousrendo@gmail.com';
      if (!isAdmin) {
        router.push('/');
        return;
      }
    }
  }, [session, isPending, router]);

  useEffect(() => {
    if (isPending || !session) return;
    
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/projects/admin/all`)
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) {
          setProjects(data);
        } else {
          console.error('Expected array from backend, got:', data);
          setProjects([]);
        }
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return <div className="flex h-screen items-center justify-center text-zinc-400">Loading all enterprise data...</div>;
  }

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        
        <div className="flex items-center justify-between">
          <h1 className="text-4xl font-bold tracking-tighter">CTO Control Center</h1>
          <Badge className="bg-purple-600">Enterprise Admin</Badge>
        </div>

        <AnimatePresence mode="wait">
          {!selectedProject ? (
            <motion.div 
              key="table"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="grid gap-4"
            >
              {projects.length === 0 ? (
                <div className="text-center text-zinc-500 py-12">No projects generated yet.</div>
              ) : (
                projects.map((proj) => (
                  <Card 
                    key={proj.id} 
                    className="bg-zinc-900 border-zinc-800 cursor-pointer hover:border-purple-500/50 transition-all"
                    onClick={() => setSelectedProject(proj)}
                  >
                    <CardHeader className="flex flex-row items-center justify-between">
                      <div>
                        <CardTitle className="text-xl">{proj.name}</CardTitle>
                        <p className="text-sm text-zinc-400 mt-1">{proj.description}</p>
                      </div>
                      <div className="flex flex-col items-end gap-2">
                        <Badge variant="outline" className="text-zinc-300 border-zinc-700">
                          {proj.level} Level
                        </Badge>
                        <span className="text-xs text-zinc-500">
                          {new Date(proj.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                    </CardHeader>
                  </Card>
                ))
              )}
            </motion.div>
          ) : (
            <motion.div 
              key="detail"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-8"
            >
              <Button 
                variant="ghost" 
                onClick={() => setSelectedProject(null)}
                className="text-zinc-400 hover:text-white"
              >
                <ArrowLeft className="w-4 h-4 mr-2" /> Back to all projects
              </Button>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Left Column: AI Generated Data */}
                <div className="lg:col-span-1 space-y-6">
                  
                  <Card className="bg-zinc-900 border-zinc-800">
                    <CardHeader>
                      <CardTitle className="text-xl text-purple-400">Project Profile</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4 text-sm text-zinc-300">
                      <div><strong>Name:</strong> {selectedProject.name}</div>
                      <div><strong>Level:</strong> {selectedProject.level}</div>
                      <div><strong>Generated:</strong> {new Date(selectedProject.createdAt).toLocaleString()}</div>
                      <div><strong>Owner ID:</strong> {selectedProject.userId}</div>
                    </CardContent>
                  </Card>

                  <Card className="bg-zinc-900 border-zinc-800">
                    <CardHeader>
                      <CardTitle className="text-xl flex items-center gap-2">
                        <Code2 className="w-5 h-5 text-blue-400"/> Selected Tech Stack
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="flex flex-wrap gap-2">
                        {selectedProject.techStack?.map((tech, idx) => (
                          <Badge key={idx} className="bg-zinc-800 text-zinc-200 flex items-center gap-2">
                            {tech.simpleIconSlug && (
                              // eslint-disable-next-line @next/next/no-img-element
                              <img 
                                src={`https://cdn.simpleicons.org/${tech.simpleIconSlug}/white`} 
                                alt={`${tech.name} logo`} 
                                className="w-4 h-4"
                                onError={(e) => {
                                  e.currentTarget.style.display = 'none';
                                }}
                              />
                            )}
                            {tech.name}
                          </Badge>
                        ))}
                      </div>
                    </CardContent>
                  </Card>

                  {selectedProject.costEstimate && (
                    <Card className="bg-zinc-900 border-zinc-800">
                      <CardHeader>
                        <CardTitle className="text-xl text-green-400">Financials</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="text-3xl font-bold">${selectedProject.costEstimate.totalMonthly}/mo</div>
                        <div className="mt-4 space-y-2">
                          {selectedProject.costEstimate.breakdown?.map((item, idx) => (
                            <div key={idx} className="flex justify-between text-sm">
                              <span className="text-zinc-400">{item.service}</span>
                              <span className="text-zinc-200">${item.cost}</span>
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  )}

                  <Card className="bg-zinc-900 border-zinc-800">
                    <CardHeader>
                      <CardTitle className="text-xl text-yellow-400">CLI Scaffold Commands</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <p className="text-sm text-zinc-400">Copy these to bootstrap the infrastructure.</p>
                      <div className="bg-black rounded-lg p-4 font-mono text-xs text-green-400 space-y-2 overflow-x-auto">
                        {selectedProject.level === "Enterprise" ? (
                          <>
                            <div>$ npx create-next-app@latest web --typescript --tailwind --app</div>
                            <div>$ npx create-expo-app mobile --template tabs</div>
                            <div>$ nest new api-gateway && nest new user-service && nest new payment-service</div>
                            <div>$ npm install prisma @prisma/client kafkajs @nestjs/microservices</div>
                            <div>$ npx prisma init</div>
                            <div>$ docker-compose up -d # (Postgres, Redis, Kafka, Elasticsearch)</div>
                            <div>$ minikube start && helm install my-release bitnami/postgresql</div>
                            <div>$ npm run dev</div>
                          </>
                        ) : selectedProject.level === "Professional" ? (
                          <>
                            <div>$ npx create-next-app@latest web --typescript --tailwind --app</div>
                            <div>$ nest new backend</div>
                            <div>$ cd backend && npm install prisma @prisma/client redis</div>
                            <div>$ npx prisma init</div>
                            <div>$ docker-compose up -d # (Postgres, Redis)</div>
                            <div>$ npm run dev</div>
                          </>
                        ) : (
                          <>
                            <div>$ npx create-next-app@latest web --typescript --tailwind --app</div>
                            <div>$ nest new backend</div>
                            <div>$ cd backend && npm install prisma @prisma/client</div>
                            <div>$ npx prisma init</div>
                            <div>$ docker-compose up -d</div>
                            <div>$ npm run dev</div>
                          </>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* Right Column: Master Checklist */}
                <div className="lg:col-span-2 space-y-6">
                  <MasterChecklist 
                    aiChecklist={selectedProject.tasks} 
                    projectName={selectedProject.name}
                    projectLevel={selectedProject.level} 
                  />
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
