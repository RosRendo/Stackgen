import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient({
  datasources: {
    db: {
      url: process.env.DATABASE_URL + (process.env.DATABASE_URL?.includes('?') ? '&' : '?') + 'pgbouncer=true'
    },
  },
});

async function main() {
  console.log('Seeding Service Finder Enterprise project...');

  // 1. Get or create a dummy user
  let user = await prisma.user.findFirst();
  if (!user) {
    user = await prisma.user.create({
      data: {
        name: 'Enterprise Admin',
        email: 'admin@servicefinder.com',
      },
    });
  }

  // 2. Create the Project
  const project = await prisma.project.create({
    data: {
      name: 'Service Finder (Microservices)',
      description: 'A comprehensive enterprise service platform with mobile apps, microservices, Kafka event streaming, and Kubernetes orchestration. Analyzed from 144k+ files.',
      industry: 'Platform Services',
      targetUsers: 'B2B & B2C',
      traffic: 'High (Millions of RPS)',
      budget: 'Enterprise ($1M+)',
      level: 'Enterprise',
      userId: user.id,
      techStack: [
        { name: 'Next.js', simpleIconSlug: 'nextdotjs' },
        { name: 'React Native (Expo)', simpleIconSlug: 'expo' },
        { name: 'NestJS', simpleIconSlug: 'nestjs' },
        { name: 'PostgreSQL', simpleIconSlug: 'postgresql' },
        { name: 'Redis', simpleIconSlug: 'redis' },
        { name: 'Apache Kafka', simpleIconSlug: 'apachekafka' },
        { name: 'Elasticsearch', simpleIconSlug: 'elasticsearch' },
        { name: 'Kubernetes', simpleIconSlug: 'kubernetes' },
        { name: 'Docker', simpleIconSlug: 'docker' },
      ],
      costEstimate: {
        totalMonthly: 4500,
        breakdown: [
          { service: 'AWS EKS (Kubernetes)', cost: 1500 },
          { service: 'Managed Kafka (Confluent)', cost: 800 },
          { service: 'RDS PostgreSQL Multi-AZ', cost: 1200 },
          { service: 'Elasticache Redis', cost: 400 },
          { service: 'Cloudflare Enterprise', cost: 600 }
        ]
      },
      tasks: {
        create: [
          {
            category: 'DevOps',
            title: 'Set up Kubernetes Helm Charts',
            description: 'Configure Helm charts for API Gateway and all 5 core microservices.',
            status: 'DONE',
            priority: 'HIGH',
            difficulty: 'Hard'
          },
          {
            category: 'Backend',
            title: 'Implement Kafka Event Streaming',
            description: 'Set up producer/consumer for user registration and notifications.',
            status: 'IN_PROGRESS',
            priority: 'HIGH',
            difficulty: 'Hard'
          },
          {
            category: 'Mobile',
            title: 'Expo EAS Build Pipeline',
            description: 'Configure CI/CD to automatically push updates over-the-air.',
            status: 'TODO',
            priority: 'MEDIUM',
            difficulty: 'Medium'
          },
          {
            category: 'Security',
            title: 'mTLS Service Mesh Configuration',
            description: 'Implement Istio for internal service-to-service encryption.',
            status: 'TODO',
            priority: 'HIGH',
            difficulty: 'Hard'
          }
        ]
      }
    },
  });

  console.log(`✅ Project created: ${project.name} (${project.id})`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
