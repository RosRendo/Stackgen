import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ProjectsService {
  constructor(private readonly prisma: PrismaService) {}

  async saveProject(userId: string, data: any) {
    try {
      const user = await this.prisma.user.findUnique({ where: { id: userId } });
      const isAdmin = user?.email === 'rousrendo@gmail.com';
      const isPaid = user?.subscriptionStatus === 'active' || (user?.subscriptionTier && user?.subscriptionTier !== 'Free' && user?.subscriptionTier !== 'MVP');
      
      if (!isPaid && !isAdmin) {
        const projectCount = await this.prisma.project.count({ where: { userId } });
        if (projectCount >= 1) {
          throw new HttpException('Free tier is limited to 1 project. Please upgrade your plan to create more.', HttpStatus.PAYMENT_REQUIRED);
        }
      }

      const project = await this.prisma.project.create({
        data: {
          name: data.projectName,
          description: data.description,
          level: data.level,
          userId: userId,
          techStack: data.techStack,
          architectureNodes: data.architectureNodes,
          architectureEdges: data.architectureEdges,
          costEstimate: data.costEstimate,
          masterPlan: data.masterPlan,
          tasks: {
            create: data.checklist?.map((task: any) => ({
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
            })) || []
          }
        }
      });
      return project;
    } catch (err) {
      console.error(err);
      if (err instanceof HttpException) {
        throw err;
      }
      throw new HttpException('Failed to save project', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async getAllProjectsForAdmin() {
    return this.prisma.project.findMany({
      orderBy: { createdAt: 'desc' },
      include: {
        user: true,
        tasks: true
      }
    });
  }

  async getUserProjects(userId: string) {
    return this.prisma.project.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      include: {
        tasks: true
      }
    });
  }

  async getProjectById(userId: string, projectId: string) {
    const project = await this.prisma.project.findUnique({
      where: { id: projectId },
      include: { tasks: true }
    });

    if (!project || project.userId !== userId) {
      throw new HttpException('Project not found or unauthorized', HttpStatus.NOT_FOUND);
    }

    return project;
  }
}
