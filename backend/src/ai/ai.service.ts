import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { GoogleGenAI } from '@google/genai';

@Injectable()
export class AiService {
  private ai: GoogleGenAI;

  constructor() {
    this.ai = new GoogleGenAI({
      apiKey: process.env.GEMINI_API_KEY || 'dummy_key',
    });
  }

  async generateBlueprint(projectName: string, description: string, level: string, useMock: boolean = false) {
    if (useMock || !process.env.GEMINI_API_KEY) {
      // Mock response if no key is provided, so the UI still works
      const mockResponses: Record<string, any> = {
        MVP: {
          techStack: [
            { name: 'Next.js', simpleIconSlug: 'nextdotjs', rationale: 'Fast, SEO-friendly React framework.', category: 'Frontend' },
            { name: 'Supabase', simpleIconSlug: 'supabase', rationale: 'All-in-one Backend-as-a-Service for rapid MVP delivery.', category: 'Database' },
            { name: 'Vercel', simpleIconSlug: 'vercel', rationale: 'Zero-config deployment.', category: 'DevOps' }
          ],
          checklist: [
            { id: '1', category: 'Frontend', title: 'Setup Next.js with App Router & Tailwind', description: 'Initialize the Next.js workspace using create-next-app. Configure Tailwind CSS design tokens (colors, typography) in tailwind.config.ts. Setup the global RootLayout and implement a responsive navigation header.', relatedTech: ['Next.js', 'Tailwind CSS'], status: 'TODO' },
            { id: '2', category: 'Frontend', title: 'Implement Base UI Components', description: 'Create atomic, accessible UI components (Buttons, Inputs, Cards, Modals) using Shadcn UI. Ensure all components support dark mode and strictly follow WCAG accessibility guidelines.', relatedTech: ['React', 'Tailwind CSS', 'Radix UI'], status: 'TODO' },
            { id: '3', category: 'Database', title: 'Configure Supabase Auth & Schema', description: 'Create a new Supabase project. Setup email/password authentication and OAuth providers (Google/GitHub). Design the initial PostgreSQL schema and write Row Level Security (RLS) policies to protect user data.', relatedTech: ['Supabase', 'PostgreSQL'], status: 'TODO' },
            { id: '4', category: 'DevOps', title: 'Configure Vercel CI/CD Pipeline', description: 'Link the GitHub repository to a new Vercel project. Configure build settings, set up production environment variables securely, and verify the automated preview deployments on pull requests.', relatedTech: ['Vercel', 'GitHub Actions'], status: 'TODO' }
          ],
          nodes: [
            { id: '1', position: { x: 250, y: 0 }, data: { label: 'User Client' } },
            { id: '2', position: { x: 250, y: 150 }, data: { label: 'Next.js App' } },
            { id: '3', position: { x: 250, y: 300 }, data: { label: 'Supabase (BaaS)' } }
          ],
          edges: [
            { id: 'e1-2', source: '1', target: '2' },
            { id: 'e2-3', source: '2', target: '3' }
          ]
        },
        Startup: {
          techStack: [
            { name: 'Next.js', simpleIconSlug: 'nextdotjs', rationale: 'React framework.', category: 'Frontend' },
            { name: 'NestJS', simpleIconSlug: 'nestjs', rationale: 'Scalable backend API.', category: 'Backend' },
            { name: 'PostgreSQL', simpleIconSlug: 'postgresql', rationale: 'Relational DB.', category: 'Database' },
            { name: 'Redis', simpleIconSlug: 'redis', rationale: 'Session caching.', category: 'Database' },
            { name: 'Docker', simpleIconSlug: 'docker', rationale: 'Containerization.', category: 'DevOps' }
          ],
          checklist: [
            { id: '1', category: 'Frontend', title: 'Bootstrap Next.js SSR Frontend', description: 'Initialize the frontend workspace with Next.js App Router. Implement secure session handling and API request interceptors using Axios to communicate with the NestJS backend.', relatedTech: ['Next.js', 'Tailwind CSS', 'Axios'], status: 'TODO' },
            { id: '2', category: 'Backend', title: 'Initialize NestJS API Gateway', description: 'Setup NestJS core modules. Implement global exception filters, validation pipes (using class-validator), and configure Swagger UI for automatic API documentation generation.', relatedTech: ['NestJS', 'TypeScript', 'Swagger'], status: 'TODO' },
            { id: '3', category: 'Backend', title: 'Design Prisma Database Schema', description: 'Write the schema.prisma file defining Users, Sessions, and core business models. Generate the Prisma Client and write initial seed scripts for local development data.', relatedTech: ['Prisma', 'PostgreSQL'], status: 'TODO' },
            { id: '4', category: 'Database', title: 'Provision PostgreSQL & Redis', description: 'Deploy managed PostgreSQL and Redis instances. Configure connection pooling using PgBouncer to handle high concurrent connections, and set up Redis for session caching and rate limiting.', relatedTech: ['PostgreSQL', 'Redis', 'PgBouncer'], status: 'TODO' },
            { id: '5', category: 'DevOps', title: 'Docker Compose Local Development Parity', description: 'Write a comprehensive docker-compose.yml to containerize the database, cache, and API. Ensure local developers can spin up the entire infrastructure stack with a single command.', relatedTech: ['Docker', 'Docker Compose'], status: 'TODO' }
          ],
          nodes: [
            { id: '1', position: { x: 250, y: 0 }, data: { label: 'User Client' } },
            { id: '2', position: { x: 250, y: 150 }, data: { label: 'Frontend App' } },
            { id: '3', position: { x: 250, y: 300 }, data: { label: 'NestJS API' } },
            { id: '4', position: { x: 150, y: 450 }, data: { label: 'PostgreSQL DB' } },
            { id: '5', position: { x: 350, y: 450 }, data: { label: 'Redis Cache' } }
          ],
          edges: [
            { id: 'e1-2', source: '1', target: '2' },
            { id: 'e2-3', source: '2', target: '3' },
            { id: 'e3-4', source: '3', target: '4' },
            { id: 'e3-5', source: '3', target: '5' }
          ]
        },
        Professional: {
          techStack: [
            { name: 'React', simpleIconSlug: 'react', rationale: 'SPA Architecture.', category: 'Frontend' },
            { name: 'NestJS', simpleIconSlug: 'nestjs', rationale: 'API Gateway.', category: 'Backend' },
            { name: 'RabbitMQ', simpleIconSlug: 'rabbitmq', rationale: 'Message queues.', category: 'Backend' },
            { name: 'PostgreSQL', simpleIconSlug: 'postgresql', rationale: 'Primary DB.', category: 'Database' },
            { name: 'Terraform', simpleIconSlug: 'terraform', rationale: 'IaC.', category: 'DevOps' },
            { name: 'GitHub Actions', simpleIconSlug: 'githubactions', rationale: 'CI/CD.', category: 'DevOps' }
          ],
          checklist: [
            { id: '1', category: 'Frontend', title: 'Architect React SPA with Module Federation', description: 'Configure Vite with React and implement Webpack Module Federation to allow independent deployment of distinct feature areas (micro-frontends) without breaking the shell app.', relatedTech: ['React', 'Vite', 'Webpack'], status: 'TODO' },
            { id: '2', category: 'Backend', title: 'Initialize NestJS API Gateway & Auth', description: 'Setup NestJS gateway to intelligently route requests to internal microservices via TCP/Redis transport. Implement JWT authentication guards and Role-Based Access Control (RBAC).', relatedTech: ['NestJS', 'JWT'], status: 'TODO' },
            { id: '3', category: 'Backend', title: 'Implement RabbitMQ Event Bus', description: 'Deploy RabbitMQ exchanges and queues. Implement an async, event-driven communication pattern between the API Gateway and Worker services to handle heavy background processing.', relatedTech: ['RabbitMQ', 'AMQP'], status: 'TODO' },
            { id: '4', category: 'Database', title: 'Provision High Availability PostgreSQL Cluster', description: 'Deploy a multi-AZ PostgreSQL cluster. Configure asynchronous read-replicas for heavy reporting queries and implement automated daily snapshot backups.', relatedTech: ['PostgreSQL', 'AWS RDS'], status: 'TODO' },
            { id: '5', category: 'DevOps', title: 'Dockerize Microservices with Multi-stage Builds', description: 'Create highly optimized, multi-stage Dockerfiles for all Node.js services. Ensure the final production images use distroless Alpine linux to minimize security vulnerabilities and image size.', relatedTech: ['Docker', 'Alpine'], status: 'TODO' },
            { id: '6', category: 'DevOps', title: 'Provision AWS Infrastructure via Terraform', description: 'Write modular Terraform IaC scripts to provision a custom VPC, private/public subnets, NAT Gateways, and an ECS Fargate cluster with Application Load Balancers.', relatedTech: ['Terraform', 'AWS ECS'], status: 'TODO' }
          ],
          nodes: [
            { id: '1', position: { x: 250, y: 0 }, data: { label: 'Web Client' } },
            { id: '2', position: { x: 250, y: 150 }, data: { label: 'API Gateway' } },
            { id: '3', position: { x: 100, y: 300 }, data: { label: 'Auth Service' } },
            { id: '4', position: { x: 400, y: 300 }, data: { label: 'Worker Service' } },
            { id: '5', position: { x: 250, y: 450 }, data: { label: 'RabbitMQ' } },
            { id: '6', position: { x: 250, y: 600 }, data: { label: 'PostgreSQL Cluster' } }
          ],
          edges: [
            { id: 'e1-2', source: '1', target: '2' },
            { id: 'e2-3', source: '2', target: '3' },
            { id: 'e2-4', source: '2', target: '4' },
            { id: 'e3-5', source: '3', target: '5' },
            { id: 'e4-5', source: '4', target: '5' },
            { id: 'e3-6', source: '3', target: '6' },
            { id: 'e4-6', source: '4', target: '6' }
          ]
        },
        Enterprise: {
          techStack: [
            { name: 'React Microfrontends', simpleIconSlug: 'react', rationale: 'Decoupled UI.', category: 'Frontend' },
            { name: 'Spring Boot', simpleIconSlug: 'springboot', rationale: 'Core services.', category: 'Backend' },
            { name: 'Go', simpleIconSlug: 'go', rationale: 'High performance workers.', category: 'Backend' },
            { name: 'Cassandra', simpleIconSlug: 'apachecassandra', rationale: 'Distributed NoSQL.', category: 'Database' },
            { name: 'Apache Kafka', simpleIconSlug: 'apachekafka', rationale: 'Event streaming.', category: 'Database' },
            { name: 'Kubernetes', simpleIconSlug: 'kubernetes', rationale: 'Container orchestration.', category: 'DevOps' },
            { name: 'Datadog', simpleIconSlug: 'datadog', rationale: 'APM Observability.', category: 'DevOps' }
          ],
          checklist: [
            { id: '1', category: 'Frontend', title: 'Setup Distributed Micro-frontend Architecture', description: 'Implement Webpack Module Federation across decoupled Next.js applications. Establish strict TypeScript contracts for cross-MFE communication and deploy a centralized NPM package for shared design system components.', relatedTech: ['Next.js', 'React', 'Webpack'], status: 'TODO' },
            { id: '2', category: 'Backend', title: 'Initialize Spring Boot Core & Go Workers', description: 'Bootstrap the core domain services using Spring Boot 3 with JPA. Simultaneously initialize high-throughput, memory-efficient Go microservices to handle real-time analytics stream processing.', relatedTech: ['Spring Boot', 'Go', 'gRPC'], status: 'TODO' },
            { id: '3', category: 'Database', title: 'Setup Apache Kafka Event Streaming Platform', description: 'Deploy a multi-broker Kafka cluster. Configure idempotent producers, partitioned topics for domain events, and implement the Outbox Pattern in Spring Boot to ensure guaranteed message delivery.', relatedTech: ['Apache Kafka', 'Zookeeper'], status: 'TODO' },
            { id: '4', category: 'Database', title: 'Deploy Multi-Region Cassandra Ring', description: 'Provision a distributed Apache Cassandra database across multiple geographic regions to handle massive write-heavy telemetry data with zero downtime and eventual consistency.', relatedTech: ['Cassandra', 'NoSQL'], status: 'TODO' },
            { id: '5', category: 'DevOps', title: 'Provision highly-available Kubernetes Cluster (EKS)', description: 'Write Helm charts for all services. Use Terraform to deploy an Amazon EKS cluster with autoscaling node groups, ingress controllers, and cluster autoscaler across 3 Availability Zones.', relatedTech: ['Kubernetes', 'Helm', 'Terraform'], status: 'TODO' },
            { id: '6', category: 'Security', title: 'Implement mTLS and HashiCorp Vault', description: 'Setup Istio Service Mesh to enforce strict mTLS encryption between all pods. Deploy HashiCorp Vault to dynamically generate short-lived database credentials and rotate API keys automatically.', relatedTech: ['Istio', 'HashiCorp Vault'], status: 'TODO' },
            { id: '7', category: 'DevOps', title: 'Implement Datadog APM & Distributed Tracing', description: 'Inject Datadog agents as DaemonSets in the Kubernetes cluster. Configure OpenTelemetry to propagate trace IDs across Spring Boot, Go, and Kafka to achieve 100% observability of requests.', relatedTech: ['Datadog', 'OpenTelemetry'], status: 'TODO' }
          ],
          nodes: [
            { id: '1', position: { x: 250, y: 0 }, data: { label: 'CDN / API Gateway' } },
            { id: '2', position: { x: 100, y: 150 }, data: { label: 'MFE: Core' } },
            { id: '3', position: { x: 400, y: 150 }, data: { label: 'MFE: Admin' } },
            { id: '4', position: { x: 250, y: 300 }, data: { label: 'Kafka Event Bus' } },
            { id: '5', position: { x: 100, y: 450 }, data: { label: 'Spring Service (Core)' } },
            { id: '6', position: { x: 400, y: 450 }, data: { label: 'Go Worker (Analytics)' } },
            { id: '7', position: { x: 100, y: 600 }, data: { label: 'PostgreSQL (Core DB)' } },
            { id: '8', position: { x: 400, y: 600 }, data: { label: 'Cassandra (Big Data)' } }
          ],
          edges: [
            { id: 'e1-2', source: '1', target: '2' },
            { id: 'e1-3', source: '1', target: '3' },
            { id: 'e2-5', source: '2', target: '5' },
            { id: 'e3-5', source: '3', target: '5' },
            { id: 'e5-4', source: '5', target: '4' },
            { id: 'e4-6', source: '4', target: '6' },
            { id: 'e5-7', source: '5', target: '7' },
            { id: 'e6-8', source: '6', target: '8' }
          ]
        }
      };

      return { 
        data: mockResponses[level] || mockResponses['MVP'],
        usage: 0 
      };
    }

    const prompt = `
      You are an expert Software Architect. A user wants to build a project called "${projectName}".
      Description: "${description}"
      Complexity Level: "${level}" (MVP, Startup, Professional, Enterprise).

      Please generate a highly detailed system architecture blueprint.
      
      You MUST return exactly a JSON object (and nothing else, no markdown wrappers) matching this schema:
      {
        "techStack": [
          { "name": "string", "simpleIconSlug": "string (lowercase icon slug for simpleicons.org)", "rationale": "string", "category": "Frontend, Backend, Database, DevOps, Security, or Testing" }
        ],
        "checklist": [
          { "id": "string", "category": "string", "title": "string", "description": "string", "relatedTech": ["string"], "status": "TODO" }
        ],
        "nodes": [
          { "id": "string", "position": { "x": number, "y": number }, "data": { "label": "string" } }
        ],
        "edges": [
          { "id": "string", "source": "string", "target": "string" }
        ]
      }
      
      For nodes, ensure distinct IDs and sequential positioning on the Y axis (y: 0, 150, 300, 450) and X axis (x: 250). Do NOT return empty arrays.
    `;

    try {
      const response = await this.ai.models.generateContent({
        model: 'gemini-3.5-flash',
        contents: prompt,
        config: {
          responseMimeType: "application/json"
        }
      });

      const parsedData = JSON.parse(response.text || '{}');

      return {
        data: parsedData,
        usage: 1000 // Mock usage for now
      };
    } catch (error) {
      console.error(error);
      throw new HttpException('Failed to generate blueprint', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async generateTaskPrompt(taskTitle: string, techStack: string[], useMock: boolean = false) {
    if (useMock || !process.env.GEMINI_API_KEY) {
      const isDevOps = taskTitle.toLowerCase().includes('docker') || taskTitle.toLowerCase().includes('kubernetes') || taskTitle.toLowerCase().includes('cluster');
      const isDb = taskTitle.toLowerCase().includes('postgres') || taskTitle.toLowerCase().includes('redis') || taskTitle.toLowerCase().includes('schema');
      
      let dynamicTree = '';
      if (isDevOps) {
        dynamicTree = `project-root/
├── docker/
│   ├── Dockerfile
│   └── docker-compose.yml
└── kubernetes/
    ├── deployment.yaml
    └── service.yaml`;
      } else if (isDb) {
        dynamicTree = `project-root/
├── prisma/
│   └── schema.prisma
└── src/
    ├── database/
    │   └── db.module.ts
    └── services/
        └── cache.service.ts`;
      } else {
        dynamicTree = `project-root/
├── src/
│   ├── components/
│   │   └── FeatureUI.tsx
│   ├── services/
│   │   └── feature.service.ts
│   └── utils/
│       └── helpers.ts
└── tests/
    └── feature.spec.ts`;
      }

      return {
        data: {
          prompt: `[NOTE: This is a mocked AI response because you are on the Free Tier or GEMINI_API_KEY is not set. Upgrade to a paid plan for dynamic, task-specific AI generation!]

You are an expert developer using ${techStack.join(', ')}.

Please implement the following task: "${taskTitle}"

Ensure you follow best practices for ${techStack.join(', ')} and break down the requirements into the following detailed tree structure:

\`\`\`text
${dynamicTree}
\`\`\`

### Step-by-Step Instructions:
1. **Prepare Environment for ${taskTitle}**
  - [ ] Initialize necessary files based on the tree above.
  - [ ] Configure environment variables.

2. **Execute Core Logic**
  - [ ] Implement the main functionality for ${taskTitle}.
  - [ ] Integrate with the existing ${techStack[0] || 'framework'} architecture.

3. **Verify and Deploy**
  - [ ] Write tests covering edge cases.
  - [ ] Ensure everything runs smoothly in the pipeline.`
        },
        usage: 0
      };
    }

    const prompt = `
      You are an expert Developer Assistant. The user needs to implement the following task: "${taskTitle}".
      They are using the following tech stack: ${techStack.join(', ')}.

      Please generate a highly detailed, perfect prompt that the user can copy and paste into an AI coding assistant (like Cursor or GitHub Copilot) to execute this task perfectly.
      The generated prompt MUST:
      1. Instruct the AI to act as a senior engineer.
      2. Explicitly mention the tech stack and specify best practices for them.
      3. Deeply break down the requirements into a literal markdown file tree structure (using text-based tree characters like ├── and └──) showing the exact file paths to create/modify.
      4. Provide a step-by-step implementation checklist.
      
      Return a JSON object ONLY with the following schema:
      { "prompt": "the generated detailed prompt string containing the file tree structure and step-by-step checklist" }
    `;

    try {
      const response = await this.ai.models.generateContent({
        model: 'gemini-3.5-flash',
        contents: prompt,
        config: {
          responseMimeType: 'application/json'
        }
      });

      const parsed = JSON.parse(response.text || '{}');
      return {
        data: parsed,
        usage: 1000
      };
    } catch (error) {
      console.error(error);
      throw new HttpException('Failed to generate task prompt', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async chat(message: string, context: any) {
    if (!process.env.GEMINI_API_KEY) {
      return { reply: `I am your CTO Assistant. You said: "${message}". Please add a Gemini API Key to get real AI responses!` };
    }

    const systemPrompt = `
      You are DevArchitect AI, an expert CTO and Software Architect. 
      The user is currently building a project with the following context:
      ${JSON.stringify(context, null, 2)}
      
      Answer their questions about software engineering, architecture, code, or general knowledge. Be highly technical, concise, and helpful. Use markdown formatting.
    `;

    try {
      const response = await this.ai.models.generateContent({
        model: 'gemini-3.5-flash',
        contents: `${systemPrompt}\n\nUser: ${message}`
      });

      return { reply: response.text };
    } catch (error) {
      console.error(error);
      throw new HttpException('Failed to chat', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async generateDocs(projectName: string, description: string, techStack: any[], nodes: any[]) {
    if (!process.env.GEMINI_API_KEY) {
      return {
        readme: `# ${projectName}\n\n${description}\n\n## Tech Stack\n${techStack.map(t => `- ${t.name}`).join('\n')}`,
        architecture: `# Architecture\n\nGenerated for ${projectName}.`
      };
    }

    const prompt = `
      You are an expert technical writer and Software Architect. 
      Generate a standard README.md and ARCHITECTURE.md for the following project:
      Project: ${projectName}
      Description: ${description}
      Tech Stack: ${JSON.stringify(techStack)}
      Architecture Nodes: ${JSON.stringify(nodes)}

      Return a JSON object ONLY with the following schema:
      {
        "readme": "markdown string for README.md",
        "architecture": "markdown string for ARCHITECTURE.md"
      }
    `;

    try {
      const response = await this.ai.models.generateContent({
        model: 'gemini-3.5-flash',
        contents: prompt,
        config: {
          responseMimeType: 'application/json'
        }
      });

      return JSON.parse(response.text || '{}');
    } catch (error) {
      console.error(error);
      throw new HttpException('Failed to generate docs', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async scanGithub(githubUrl: string) {
    if (!process.env.GEMINI_API_KEY) {
      return {
        score: { overall: 75, security: 60, devops: 80, architecture: 85 },
        findings: [
          { category: 'Security', issue: 'Missing security best practices', impact: 'High' }
        ],
        improvements: ['Add Dependabot', 'Setup GitHub Actions for CI']
      };
    }

    try {
      let owner = '';
      let repo = '';
      const urlParts = githubUrl.split('github.com/');
      if (urlParts.length > 1) {
        const pathParts = urlParts[1].split('/');
        owner = pathParts[0];
        repo = pathParts[1].replace('.git', '');
      } else {
        throw new Error('Invalid GitHub URL');
      }

      let packageJsonContent = '';
      try {
        const pkgUrl = `https://raw.githubusercontent.com/${owner}/${repo}/main/package.json`;
        const res = await fetch(pkgUrl);
        if (res.ok) {
          packageJsonContent = await res.text();
        } else {
          const masterRes = await fetch(`https://raw.githubusercontent.com/${owner}/${repo}/master/package.json`);
          if (masterRes.ok) {
            packageJsonContent = await masterRes.text();
          }
        }
      } catch (err) {
        console.warn('Could not fetch package.json', err);
      }

      const prompt = `
        You are an expert DevSecOps and Software Architect. I want you to evaluate a GitHub repository for Production Readiness.
        Repo: ${owner}/${repo}
        Package.json content: ${packageJsonContent ? packageJsonContent : 'Not found or not a Node project.'}

        Based on standard best practices for ${packageJsonContent ? 'Node.js/JavaScript' : 'software engineering'}, generate a Production Readiness Score.
        
        Return ONLY valid JSON with this schema:
        {
          "score": { "overall": number, "security": number, "devops": number, "architecture": number },
          "findings": [
            { "category": "Security|DevOps|Architecture", "issue": "string", "impact": "High|Medium|Low" }
          ],
          "improvements": ["string"]
        }
      `;

      const response = await this.ai.models.generateContent({
        model: 'gemini-3.5-flash',
        contents: prompt,
        config: {
          responseMimeType: 'application/json'
        }
      });

      return JSON.parse(response.text || '{}');
    } catch (error) {
      console.error(error);
      throw new HttpException('Failed to scan GitHub repo', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async estimateCost(level: string, techStack: any[]) {
    if (!process.env.GEMINI_API_KEY) {
      return {
        totalMonthly: 45,
        breakdown: [
          { service: 'Vercel Pro', cost: 20, description: 'Frontend Hosting & Serverless APIs' },
          { service: 'Neon/Supabase DB', cost: 25, description: 'PostgreSQL Database' }
        ],
        notes: 'This is a mock estimation.'
      };
    }

    const prompt = `
      You are a Cloud Infrastructure Expert. The user is building a "${level}" software project using the following tech stack:
      ${JSON.stringify(techStack.map(t => t.name))}

      Provide a realistic, modern monthly cost estimation for running this stack in production. 
      Use modern Serverless/PaaS providers where appropriate (e.g. Vercel, Supabase, AWS, Render).

      Return ONLY valid JSON with this schema:
      {
        "totalMonthly": number,
        "breakdown": [
          { "service": "string", "cost": number, "description": "string" }
        ],
        "notes": "string (brief summary or advice on saving costs)"
      }
    `;

    try {
      const response = await this.ai.models.generateContent({
        model: 'gemini-3.5-flash',
        contents: prompt,
        config: {
          responseMimeType: 'application/json'
        }
      });

      return JSON.parse(response.text || '{}');
    } catch (error) {
      console.error(error);
      throw new HttpException('Failed to estimate costs', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async generateBoilerplate(projectName: string, techStack: any[]) {
    if (!process.env.GEMINI_API_KEY) {
      return {
        files: [
          { path: 'package.json', content: '{\n  "name": "mock-app"\n}' },
          { path: 'README.md', content: '# Mock App\nGenerated by AI.' }
        ]
      };
    }

    const prompt = `
      You are an expert developer. The user wants to download a boilerplate starter for a project named "${projectName}".
      The tech stack they selected is: ${JSON.stringify(techStack.map(t => t.name))}.
      
      Generate a realistic, production-ready starting codebase (e.g. package.json, docker-compose.yml, basic server configuration file, .gitignore, README.md). Do not generate hundreds of files, just the core 5-8 root structural files that define the project.

      Return ONLY valid JSON with this schema:
      {
        "files": [
          { "path": "string (e.g. 'package.json')", "content": "string (the full file content)" }
        ]
      }
    `;

    try {
      const response = await this.ai.models.generateContent({
        model: 'gemini-3.5-flash',
        contents: prompt,
        config: {
          responseMimeType: 'application/json'
        }
      });

      return JSON.parse(response.text || '{}');
    } catch (error) {
      console.error(error);
      throw new HttpException('Failed to generate boilerplate', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
