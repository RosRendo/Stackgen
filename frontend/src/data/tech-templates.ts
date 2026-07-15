import { ComplexityLevel } from '@/store/project-store';

export const TECH_TEMPLATES: Record<ComplexityLevel, string[]> = {
  MVP: [
    'Next.js',
    'Tailwind CSS',
    'Supabase',
    'Vercel'
  ],
  Startup: [
    'Next.js',
    'Tailwind CSS',
    'Fastify',
    'PostgreSQL',
    'Prisma',
    'Redis',
    'AWS'
  ],
  Professional: [
    'React',
    'Tailwind CSS',
    'NestJS',
    'PostgreSQL',
    'Redis',
    'RabbitMQ',
    'Docker',
    'GitHub Actions',
    'AWS'
  ],
  Enterprise: [
    'React',
    'Tailwind CSS',
    'Spring Boot',
    'PostgreSQL',
    'Redis',
    'Apache Kafka',
    'Kubernetes',
    'Terraform',
    'Datadog',
    'AWS'
  ]
};

// Groups of mutually exclusive technologies
const EXCLUSIVE_GROUPS = [
  {
    name: 'Primary SQL Database',
    items: ['PostgreSQL', 'MySQL', 'MariaDB', 'SQL Server', 'Oracle DB']
  },
  {
    name: 'Primary Frontend Framework',
    items: ['React', 'Vue.js', 'Angular', 'Svelte', 'SolidJS'] // Next.js/Nuxt can co-exist with React/Vue
  },
  {
    name: 'Cloud Provider',
    items: ['AWS', 'Google Cloud', 'Azure'] // For simplicity, assume they pick one primary big cloud if any
  }
];

// Complex tech that is banned in lower tiers
const TIER_BANS: Record<ComplexityLevel, string[]> = {
  MVP: [
    'Kubernetes', 'Docker', 'Podman', 'Helm', 'Istio', 'Rancher',
    'Apache Kafka', 'RabbitMQ', 'Amazon SQS', 'NATS', 'Celery',
    'Terraform', 'Pulumi', 'Ansible', 'ArgoCD'
  ],
  Startup: [
    'Kubernetes', 'Helm', 'Istio', 'Rancher', 'Apache Kafka'
  ],
  Professional: [],
  Enterprise: []
};

export function validateTechAddition(
  newTechName: string,
  currentTier: ComplexityLevel,
  currentStackNames: string[]
): { valid: boolean; error?: string } {
  // 1. Check Tier Bans
  const bans = TIER_BANS[currentTier] || [];
  if (bans.includes(newTechName)) {
    return {
      valid: false,
      error: `Cannot add ${newTechName}. It is too complex for an ${currentTier} architecture.`
    };
  }

  // 2. Check Exclusivity Groups
  for (const group of EXCLUSIVE_GROUPS) {
    if (group.items.includes(newTechName)) {
      // Find if we already have an item from this group
      const existing = currentStackNames.find(t => group.items.includes(t) && t !== newTechName);
      if (existing) {
        return {
          valid: false,
          error: `Cannot add ${newTechName}. You already selected ${existing} as your ${group.name}.`
        };
      }
    }
  }

  return { valid: true };
}

export interface TechRecommendationGroup {
  groupName: string;
  technologies: string[];
}

export const TIER_RECOMMENDATIONS: Record<ComplexityLevel, TechRecommendationGroup[]> = {
  MVP: [
    { groupName: "Frontend", technologies: ["React", "Next.js", "Vue.js", "Svelte"] },
    { groupName: "Styling & UI", technologies: ["Tailwind CSS", "Shadcn/ui", "Bootstrap"] },
    { groupName: "Backend & BaaS", technologies: ["Supabase", "Firebase", "Express.js", "Fastify"] },
    { groupName: "Database", technologies: ["PostgreSQL", "MongoDB", "SQLite"] },
    { groupName: "Deployment", technologies: ["Vercel", "Netlify", "Render", "Railway"] }
  ],
  Startup: [
    { groupName: "Frontend", technologies: ["Next.js", "Nuxt.js", "React"] },
    { groupName: "Styling & UI", technologies: ["Tailwind CSS", "Shadcn/ui", "Material UI"] },
    { groupName: "Backend", technologies: ["NestJS", "Fastify", "Django", "Laravel"] },
    { groupName: "Database & ORM", technologies: ["PostgreSQL", "MySQL", "MongoDB", "Redis", "Prisma", "Drizzle"] },
    { groupName: "Cloud & Deployment", technologies: ["AWS", "DigitalOcean", "Vercel", "Docker"] }
  ],
  Professional: [
    { groupName: "Frontend", technologies: ["React", "Next.js", "Angular"] },
    { groupName: "Styling & UI", technologies: ["Tailwind CSS", "Shadcn/ui", "Ant Design"] },
    { groupName: "Backend", technologies: ["NestJS", "Spring Boot", "Go", "ASP.NET Core"] },
    { groupName: "Database & Cache", technologies: ["PostgreSQL", "Redis", "Elasticsearch"] },
    { groupName: "Messaging", technologies: ["RabbitMQ", "Amazon SQS", "Redis Streams"] },
    { groupName: "Infrastructure", technologies: ["Docker", "AWS", "GitHub Actions", "Terraform"] }
  ],
  Enterprise: [
    { groupName: "Frontend Core", technologies: ["React", "Angular"] },
    { groupName: "Styling & UI", technologies: ["Tailwind CSS", "Material UI", "Ant Design"] },
    { groupName: "Backend Microservices", technologies: ["Spring Boot", "Go", "NestJS", "Rust"] },
    { groupName: "Data Layer", technologies: ["PostgreSQL", "Redis", "Cassandra", "MongoDB"] },
    { groupName: "Event Streaming", technologies: ["Apache Kafka", "RabbitMQ"] },
    { groupName: "Orchestration & IaC", technologies: ["Kubernetes", "Terraform", "Helm", "Istio"] },
    { groupName: "Observability", technologies: ["Datadog", "Prometheus", "Grafana", "OpenTelemetry"] },
    { groupName: "Security & Testing", technologies: ["Snyk", "Auth0", "Vault", "Playwright"] }
  ]
};

export const TASK_TEMPLATES: Record<ComplexityLevel, { category: string; title: string }[]> = {
  MVP: [
    { category: 'Frontend', title: 'Setup Next.js with Tailwind CSS' },
    { category: 'Database', title: 'Configure Supabase Auth & Database' },
    { category: 'Frontend', title: 'Build core UI components' },
    { category: 'DevOps', title: 'Deploy to Vercel' }
  ],
  Startup: [
    { category: 'Frontend', title: 'Setup Next.js with Tailwind CSS' },
    { category: 'Backend', title: 'Initialize Fastify API server' },
    { category: 'Database', title: 'Provision PostgreSQL & Prisma ORM' },
    { category: 'Database', title: 'Setup Redis for session caching' },
    { category: 'DevOps', title: 'Setup Docker Compose for local dev' },
    { category: 'DevOps', title: 'Deploy infrastructure to AWS' }
  ],
  Professional: [
    { category: 'Frontend', title: 'Setup React SPA architecture' },
    { category: 'Backend', title: 'Initialize NestJS API Gateway' },
    { category: 'Database', title: 'Provision PostgreSQL & Redis clusters' },
    { category: 'Backend', title: 'Setup RabbitMQ message queues' },
    { category: 'DevOps', title: 'Dockerize all microservices' },
    { category: 'DevOps', title: 'Setup GitHub Actions CI/CD pipelines' },
    { category: 'DevOps', title: 'Provision AWS Infrastructure via Terraform' }
  ],
  Enterprise: [
    { category: 'Frontend', title: 'Setup React Micro-frontend architecture' },
    { category: 'Backend', title: 'Initialize Spring Boot & Go microservices' },
    { category: 'Database', title: 'Provision PostgreSQL High Availability Cluster' },
    { category: 'Database', title: 'Setup Apache Kafka Event Streaming' },
    { category: 'DevOps', title: 'Provision Kubernetes Cluster (EKS/GKE)' },
    { category: 'DevOps', title: 'Implement Datadog APM & OpenTelemetry' },
    { category: 'Security', title: 'Implement mTLS between services' },
    { category: 'Security', title: 'Setup HashiCorp Vault for Secrets' },
    { category: 'Testing', title: 'Implement DAST & SAST CI pipelines' }
  ]
};
