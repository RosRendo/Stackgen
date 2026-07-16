import { create } from 'zustand';
import { Node, Edge } from '@xyflow/react';

export type TaskStatus = 'TODO' | 'IN_PROGRESS' | 'DONE';

export interface ProjectTask {
  id: string;
  category: string;
  title: string;
  description?: string;
  status: TaskStatus;
  
  // Rich details
  phase?: string;
  difficulty?: string;
  estimatedTime?: string;
  relatedTech?: string[];
  checklist?: string[];
  commands?: string[];
  files?: string[];
  learningNotes?: string[];
  expectedOutcome?: string[];
  commonErrors?: string[];
  resources?: { title: string; url: string }[];
}

export type ComplexityLevel = 'MVP' | 'Startup' | 'Professional' | 'Enterprise';

export interface TechItem {
  id?: string; // added id for dnd mapping
  name: string;
  rationale: string;
  simpleIconSlug?: string;
  category?: 'Frontend' | 'Backend' | 'Database' | 'DevOps' | 'Testing'
           | 'Auth' | 'Payment' | 'Email' | 'Storage' | 'Queue'
           | 'Analytics' | 'Monitoring' | 'Security' | 'Search' | 'AI'
           | 'Observability';
  optional?: boolean;
}

interface ProjectState {
  projectId: string | null;
  projectName: string;
  description: string;
  complexity: ComplexityLevel;
  isGenerating: boolean;
  
  // Generated Data
  techStack: TechItem[];
  checklist: ProjectTask[];
  architectureNodes: Node[];
  architectureEdges: Edge[];
  progress: number;

  // Actions
  setProjectId: (id: string | null) => void;
  setProjectDetails: (name: string, desc: string, level: ComplexityLevel) => void;
  setComplexity: (level: ComplexityLevel) => void;
  setGenerating: (isGenerating: boolean) => void;
  setGeneratedData: (data: {
    techStack: TechItem[];
    checklist: ProjectTask[];
    nodes: Node[];
    edges: Edge[];
  }) => void;
  toggleTaskStatus: (taskId: string) => void;
  calculateProgress: () => void;
}

export const useProjectStore = create<ProjectState>((set, get) => ({
  projectId: null,
  projectName: '',
  description: '',
  complexity: 'MVP',
  isGenerating: false,
  
  techStack: [],
  checklist: [],
  architectureNodes: [],
  architectureEdges: [],
  progress: 0,

  setProjectId: (id) => set({ projectId: id }),

  setProjectDetails: (name, desc, level) => 
    set({ projectName: name, description: desc, complexity: level }),
    
  setComplexity: (level) => set({ complexity: level }),

  setGenerating: (isGenerating) => 
    set({ isGenerating }),

  setGeneratedData: (data) => 
    set({
      techStack: data.techStack,
      checklist: data.checklist,
      architectureNodes: data.nodes,
      architectureEdges: data.edges,
      progress: 0,
      isGenerating: false
    }),

  toggleTaskStatus: (taskId) => {
    set((state) => {
      const newChecklist = state.checklist.map((task) => {
        if (task.id === taskId) {
          return {
            ...task,
            status: task.status === 'DONE' ? 'TODO' : 'DONE'
          } as ProjectTask;
        }
        return task;
      });
      return { checklist: newChecklist };
    });
    get().calculateProgress();
  },

  calculateProgress: () => {
    set((state) => {
      if (state.checklist.length === 0) return { progress: 0 };
      const completed = state.checklist.filter(t => t.status === 'DONE').length;
      return { progress: Math.round((completed / state.checklist.length) * 100) };
    });
  }
}));
