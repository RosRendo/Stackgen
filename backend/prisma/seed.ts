import { PrismaClient } from '@prisma/client';
import { AiService } from '../src/ai/ai.service';

const prisma = new PrismaClient();

async function main() {
  const adminEmail = 'rousrendo@gmail.com';
  
  // get admin user
  let admin = await prisma.user.findUnique({ where: { email: adminEmail } });
  if (!admin) {
    admin = await prisma.user.create({
      data: {
        email: adminEmail,
        name: 'Admin User',
        subscriptionTier: 'Enterprise'
      }
    });
  }

  // Clear existing projects for admin to prevent duplicates on re-seed
  await prisma.project.deleteMany({
    where: { userId: admin.id }
  });

  const aiService = new AiService();
  
  const tiers = ['MVP', 'Startup', 'Professional', 'Enterprise'];
  
  for (const tier of tiers) {
    const data = (aiService as any).getMockBlueprint(tier);
    
    // Create the project
    await prisma.project.create({
      data: {
        name: `Example ${tier} Project`,
        description: `This is a complete ${tier} blueprint generated automatically.`,
        level: tier,
        userId: admin.id,
        techStack: data.techStack,
        architectureNodes: data.nodes,
        architectureEdges: data.edges,
        tasks: {
          create: data.checklist.map((task: any) => ({
            category: task.category,
            title: task.title,
            status: task.status,
            priority: 'MEDIUM',
            description: task.description,
            difficulty: task.difficulty,
            estimatedTime: task.estimatedTime,
            phase: task.phase,
            relatedTech: task.relatedTech || [],
            checklist: task.checklist || [],
            commands: task.commands || [],
            files: task.files || [],
            learningNotes: task.learningNotes || [],
            expectedOutcome: task.expectedOutcome || [],
            commonErrors: task.commonErrors || [],
            resources: task.resources || []
          }))
        }
      }
    });
    console.log(`Created ${tier} project`);
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
