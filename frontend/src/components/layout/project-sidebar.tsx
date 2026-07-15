'use client';

import { useEffect, useState } from 'react';
import { useProjectStore, ComplexityLevel, TechItem, ProjectTask } from '@/store/project-store';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { FolderGit2, Loader2 } from 'lucide-react';
import { authClient } from '@/lib/auth-client';

interface SavedProject {
  id: string;
  name: string;
  description: string;
  level: ComplexityLevel;
  techStack: TechItem[];
  architectureNodes: unknown[];
  architectureEdges: unknown[];
  tasks: ProjectTask[];
}

export function ProjectSidebar() {
  const [isOpen, setIsOpen] = useState(false);
  const [projects, setProjects] = useState<SavedProject[]>([]);
  const [loading, setLoading] = useState(false);
  const { data: session } = authClient.useSession();
  const setGeneratedData = useProjectStore(state => state.setGeneratedData);
  const setProjectDetails = useProjectStore(state => state.setProjectDetails);
  const setProjectId = useProjectStore(state => state.setProjectId);

  useEffect(() => {
    let mounted = true;
    const fetchProjects = async () => {
      if (!session) return;
      setLoading(true);
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/projects`, {
          credentials: 'include'
        });
        const data = await res.json();
        if (mounted) {
          setProjects(Array.isArray(data) ? data : []);
        }
      } catch (err) {
        console.error('Failed to fetch projects', err);
      } finally {
        if (mounted) setLoading(false);
      }
    };

    if (isOpen) {
      fetchProjects();
    }
    
    return () => { mounted = false; };
  }, [isOpen, session]);

  const handleLoadProject = (proj: SavedProject) => {
    setProjectId(proj.id);
    setProjectDetails(proj.name, proj.description, proj.level);
    setGeneratedData({
      techStack: proj.techStack || [],
      checklist: proj.tasks || [],
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      nodes: (proj.architectureNodes || []) as any,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      edges: (proj.architectureEdges || []) as any
    });
    useProjectStore.getState().calculateProgress();
    setIsOpen(false);
  };

  if (!session) return null;

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger render={
        <Button variant="outline" className="border-zinc-800 bg-zinc-950 text-zinc-300 hover:bg-zinc-800 hover:text-zinc-100 flex items-center justify-center">
          <FolderGit2 className="w-4 h-4 mr-2" />
          My Projects
        </Button>
      } />
      <SheetContent side="left" className="bg-zinc-950 border-zinc-800 text-zinc-100">
        <SheetHeader>
          <SheetTitle className="text-zinc-100">Saved Projects</SheetTitle>
        </SheetHeader>
        
        <div className="mt-8 flex flex-col gap-4">
          {loading ? (
            <div className="flex justify-center p-8">
              <Loader2 className="w-6 h-6 animate-spin text-blue-500" />
            </div>
          ) : projects.length === 0 ? (
            <p className="text-zinc-500 text-sm text-center">No projects found. Create one!</p>
          ) : (
            projects.map(proj => (
              <div 
                key={proj.id} 
                className="p-4 rounded-lg bg-zinc-900 border border-zinc-800 hover:border-zinc-700 cursor-pointer transition-colors flex flex-col"
                onClick={() => handleLoadProject(proj)}
              >
                <h3 className="font-semibold text-zinc-200">{proj.name}</h3>
                <p className="text-xs text-zinc-500 mt-1 truncate">{proj.description}</p>
                <div className="mt-3 flex items-center justify-between">
                  <span className="text-xs font-medium text-blue-400">{proj.level}</span>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="h-6 text-[10px] text-zinc-400 hover:text-white hover:bg-zinc-800"
                    onClick={(e) => {
                      e.stopPropagation();
                      window.location.href = `/projects/${proj.id}/checklist`;
                    }}
                  >
                    View Checklist
                  </Button>
                </div>
              </div>
            ))
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}
