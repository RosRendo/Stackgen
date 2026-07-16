import { PrismaClient } from '@prisma/client';
import { AiService } from '../src/ai/ai.service';

const prisma = new PrismaClient();

async function main() {
  const aiService = new AiService();
  const tiers = ['MVP', 'Startup', 'Professional', 'Enterprise'];
  
  // Build a lookup map of all mock tasks
  const mockTaskMap = new Map<string, any>();
  for (const tier of tiers) {
    const data = (aiService as any).getMockBlueprint(tier);
    for (const task of data.checklist) {
      mockTaskMap.set(task.title.toLowerCase(), task);
    }
  }

  const tasks = await prisma.task.findMany({
    where: { description: null }
  });

  console.log(`Found ${tasks.length} tasks to backfill.`);

  for (const task of tasks) {
    const mockTask = mockTaskMap.get(task.title.toLowerCase());
    
    let newDesc = mockTask?.description || `Set up and configure ${task.title}. Follow standard best practices for ${task.category} development to ensure maintainability and performance.`;
    let newTech = mockTask?.relatedTech || ['Next.js', 'Node.js', 'TypeScript'];

    await prisma.task.update({
      where: { id: task.id },
      data: {
        description: newDesc,
        relatedTech: newTech
      }
    });
  }
  
  console.log(`Backfilled ${tasks.length} tasks successfully!`);
}

main()
  .catch(console.error)
  .finally(async () => {
    await prisma.$disconnect();
  });
