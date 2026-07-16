'use client';

import { useState, useEffect, Suspense } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { MasterChecklist } from '@/components/admin/master-checklist';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Loader2 } from 'lucide-react';
import Link from 'next/link';

interface Project {
  id: string;
  name: string;
  description: string;
  level: string;
  tasks: unknown[];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  techStack?: any[];
}

export default function ProjectChecklistPage() {
  const { id } = useParams();
  const router = useRouter();
  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/projects/${id}`, {
      credentials: 'include'
    })
      .then(res => {
        if (!res.ok) throw new Error('Failed to fetch');
        return res.json();
      })
      .then(data => {
        setProject(data || null);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, [id]);

  if (loading) {
    return <div className="min-h-screen bg-zinc-950 flex items-center justify-center text-zinc-400">
      <Loader2 className="w-8 h-8 animate-spin" />
    </div>;
  }

  if (!project) {
    return <div className="min-h-screen bg-zinc-950 flex flex-col items-center justify-center text-zinc-400 gap-4">
      <p>Project not found.</p>
      <Link href="/"><Button variant="outline" className="border-zinc-800">Return Home</Button></Link>
    </div>;
  }

  return (
    <div className="min-h-screen bg-zinc-950 p-6 md:p-12 flex flex-col">
      <div className="max-w-5xl mx-auto w-full space-y-6 flex-1 flex flex-col h-full">
        <div className="flex items-center gap-4">
          <Button variant="ghost" className="text-zinc-400" onClick={() => router.push('/dashboard')}>
            <ArrowLeft className="w-4 h-4 mr-2" /> Back to Dashboard
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-white tracking-tight">{project.name}</h1>
            <p className="text-sm text-zinc-400">{project.level} Tier Checklist</p>
          </div>
        </div>
        
        <div className="flex-1 overflow-hidden">
          <Suspense fallback={<div className="text-zinc-400">Loading checklist...</div>}>
            <MasterChecklist 
              aiChecklist={project.tasks} 
              projectName={project.name} 
              projectLevel={project.level} 
              techStack={project.techStack}
            />
          </Suspense>
        </div>
      </div>
    </div>
  );
}
