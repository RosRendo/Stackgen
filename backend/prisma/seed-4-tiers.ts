import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient({
  datasources: {
    db: {
      url: process.env.DATABASE_URL
    },
  },
});

async function main() {
  console.log('Seeding 4 tier projects...');

  // Clean the database before seeding
  await prisma.task.deleteMany({});
  await prisma.project.deleteMany({});
  console.log('Cleared existing projects and tasks.');

  let user = await prisma.user.findFirst();
  if (!user) {
    user = await prisma.user.create({
      data: {
        name: 'Enterprise Admin',
        email: 'admin@servicefinder.com',
      },
    });
  }

  // MVP
  await prisma.project.create({
    data: {
      name: 'Simple Blog (MVP)',
      description: 'A simple blog application to validate the market.',
      level: 'MVP',
      userId: user.id,
      techStack: [
        { name: 'Next.js', simpleIconSlug: 'nextdotjs', category: 'Frontend' },
        { name: 'PostgreSQL', simpleIconSlug: 'postgresql', category: 'Database' }
      ],
      architectureNodes: [
        { id: '1', position: { x: 250, y: 0 }, data: { label: 'User Client' } },
        { id: '2', position: { x: 250, y: 150 }, data: { label: 'Frontend App' } },
        { id: '3', position: { x: 250, y: 300 }, data: { label: 'Database Node' } }
      ],
      architectureEdges: [
        { id: 'e1-2', source: '1', target: '2', animated: true, style: { stroke: '#0ea5e9' } },
        { id: 'e2-3', source: '2', target: '3', animated: true, style: { stroke: '#0ea5e9' } }
      ],
      tasks: {
        create: [
          { category: 'Frontend', title: 'Setup Next.js Routes', status: 'DONE', priority: 'HIGH' },
          { category: 'Database', title: 'Connect to Postgres via Prisma', status: 'TODO', priority: 'HIGH' }
        ]
      }
    }
  });

  // Startup
  await prisma.project.create({
    data: {
      name: 'SaaS App (Startup)',
      description: 'A growing SaaS application with authentication and state management.',
      level: 'Startup',
      userId: user.id,
      techStack: [
        { name: 'Next.js', simpleIconSlug: 'nextdotjs', category: 'Frontend' },
        { name: 'NestJS', simpleIconSlug: 'nestjs', category: 'Backend' },
        { name: 'PostgreSQL', simpleIconSlug: 'postgresql', category: 'Database' }
      ],
      architectureNodes: [
        { id: '1', position: { x: 250, y: 0 }, data: { label: 'User Client' } },
        { id: '2', position: { x: 250, y: 150 }, data: { label: 'Frontend App' } },
        { id: '3', position: { x: 250, y: 300 }, data: { label: 'Backend API' } },
        { id: '4', position: { x: 250, y: 450 }, data: { label: 'Database Node' } }
      ],
      architectureEdges: [
        { id: 'e1-2', source: '1', target: '2', animated: true, style: { stroke: '#0ea5e9' } },
        { id: 'e2-3', source: '2', target: '3', animated: true, style: { stroke: '#0ea5e9' } },
        { id: 'e3-4', source: '3', target: '4', animated: true, style: { stroke: '#0ea5e9' } }
      ],
      tasks: {
        create: [
          { category: 'Frontend', title: 'Build Next.js Landing Page', status: 'TODO', priority: 'HIGH' },
          { category: 'Backend', title: 'Setup JWT Auth in NestJS', status: 'DONE', priority: 'HIGH' },
          { category: 'Database', title: 'Run PostgreSQL Migrations', status: 'TODO', priority: 'HIGH' }
        ]
      }
    }
  });

  // Professional
  await prisma.project.create({
    data: {
      name: 'E-Commerce Platform (Professional)',
      description: 'A professional e-commerce platform with caching and load balancing.',
      level: 'Professional',
      userId: user.id,
      techStack: [
        { name: 'Next.js', simpleIconSlug: 'nextdotjs', category: 'Frontend' },
        { name: 'NestJS', simpleIconSlug: 'nestjs', category: 'Backend' },
        { name: 'PostgreSQL', simpleIconSlug: 'postgresql', category: 'Database' },
        { name: 'Redis', simpleIconSlug: 'redis', category: 'Database' }
      ],
      architectureNodes: [
        { id: '1', position: { x: 250, y: 0 }, data: { label: 'User Client' } },
        { id: '2', position: { x: 250, y: 150 }, data: { label: 'Frontend App' } },
        { id: '3', position: { x: 250, y: 300 }, data: { label: 'Backend API' } },
        { id: '4', position: { x: 250, y: 450 }, data: { label: 'Database Node' } },
        { id: '5', position: { x: 500, y: 250 }, data: { label: 'DevOps Server' } }
      ],
      architectureEdges: [
        { id: 'e1-2', source: '1', target: '2', animated: true, style: { stroke: '#0ea5e9' } },
        { id: 'e2-3', source: '2', target: '3', animated: true, style: { stroke: '#0ea5e9' } },
        { id: 'e3-4', source: '3', target: '4', animated: true, style: { stroke: '#0ea5e9' } },
        { id: 'e5-2', source: '5', target: '2', animated: true, style: { stroke: '#0ea5e9' } },
        { id: 'e5-3', source: '5', target: '3', animated: true, style: { stroke: '#0ea5e9' } }
      ],
      tasks: {
        create: [
          { category: 'Frontend', title: 'Implement Next.js Dashboard UI', status: 'TODO', priority: 'HIGH' },
          { category: 'Backend', title: 'Setup NestJS GraphQL API', status: 'TODO', priority: 'HIGH' },
          { category: 'Database', title: 'Design PostgreSQL Schema', status: 'TODO', priority: 'HIGH' },
          { category: 'DevOps', title: 'Setup Redis Caching', status: 'TODO', priority: 'HIGH' }
        ]
      }
    }
  });

  // Enterprise
  await prisma.project.create({
    data: {
      name: 'Global Fintech App (Enterprise)',
      description: 'A global fintech application with microservices, heavy security, and AI integrations.',
      level: 'Enterprise',
      userId: user.id,
      techStack: [
        { name: 'Next.js', simpleIconSlug: 'nextdotjs', category: 'Frontend' },
        { name: 'NestJS', simpleIconSlug: 'nestjs', category: 'Backend' },
        { name: 'PostgreSQL', simpleIconSlug: 'postgresql', category: 'Database' },
        { name: 'Redis', simpleIconSlug: 'redis', category: 'Database' },
        { name: 'Docker', simpleIconSlug: 'docker', category: 'DevOps' },
        { name: 'Kubernetes', simpleIconSlug: 'kubernetes', category: 'DevOps' }
      ],
      architectureNodes: [
        { id: '1', position: { x: 250, y: 0 }, data: { label: 'User Client' } },
        { id: '2', position: { x: 250, y: 150 }, data: { label: 'Frontend App (Load Balanced)' } },
        { id: '3', position: { x: 250, y: 300 }, data: { label: 'API Gateway (NestJS)' } },
        { id: '4', position: { x: 250, y: 450 }, data: { label: 'Microservices Cluster' } },
        { id: '5', position: { x: 250, y: 600 }, data: { label: 'Primary DB & Read Replicas' } },
        { id: '6', position: { x: 500, y: 300 }, data: { label: 'K8s DevOps Control Plane' } }
      ],
      architectureEdges: [
        { id: 'e1-2', source: '1', target: '2', animated: true, style: { stroke: '#0ea5e9' } },
        { id: 'e2-3', source: '2', target: '3', animated: true, style: { stroke: '#0ea5e9' } },
        { id: 'e3-4', source: '3', target: '4', animated: true, style: { stroke: '#0ea5e9' } },
        { id: 'e4-5', source: '4', target: '5', animated: true, style: { stroke: '#0ea5e9' } },
        { id: 'e6-3', source: '6', target: '3', animated: true, style: { stroke: '#0ea5e9' } },
        { id: 'e6-4', source: '6', target: '4', animated: true, style: { stroke: '#0ea5e9' } }
      ],
      tasks: {
        create: [
          { category: 'Frontend', title: 'Setup Next.js with React Server Components', status: 'TODO', priority: 'HIGH' },
          { category: 'Backend', title: 'Initialize NestJS API Gateway', status: 'TODO', priority: 'HIGH' },
          { category: 'Database', title: 'Provision PostgreSQL HA Cluster', status: 'TODO', priority: 'HIGH' },
          { category: 'Database', title: 'Setup Redis for Caching & PubSub', status: 'TODO', priority: 'MEDIUM' },
          { category: 'DevOps', title: 'Dockerize all Microservices', status: 'TODO', priority: 'HIGH' },
          { category: 'DevOps', title: 'Setup Kubernetes Cluster', status: 'TODO', priority: 'HIGH' },
          { category: 'Security', title: 'Implement mTLS between services', status: 'TODO', priority: 'HIGH' }
        ]
      }
    }
  });

  console.log(`✅ 4-Tier Projects created successfully!`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
