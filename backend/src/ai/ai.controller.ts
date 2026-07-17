import { Controller, Post, Body, Req, HttpException, HttpStatus } from '@nestjs/common';
import type { Request } from 'express';
import { AiService } from './ai.service';
import { PrismaService } from '../prisma/prisma.service';
import { auth } from '../auth/auth';
import { fromNodeHeaders } from 'better-auth/node';
import { GenerateBlueprintDto, GenerateTaskPromptDto, ChatDto, GenerateDocsDto, ScanGithubDto, EstimateCostDto, GenerateZipDto, GenerateGuideDto } from './dto/ai.dto';

@Controller('ai')
export class AiController {
  constructor(
    private readonly aiService: AiService,
    private readonly prisma: PrismaService
  ) {}

  private async validateSessionAndTokens(req: Request) {
    const session = await auth.api.getSession({
      headers: fromNodeHeaders(req.headers)
    });

    if (!session || !session.user) {
      throw new HttpException('Unauthorized', HttpStatus.UNAUTHORIZED);
    }

    const user = await this.prisma.user.findUnique({
      where: { id: session.user.id }
    });

    if (!user) {
      throw new HttpException('User not found', HttpStatus.UNAUTHORIZED);
    }

    const isPaid = user.subscriptionStatus === 'active' || user.subscriptionTier !== 'Free';
    
    if (isPaid && user.tokenBalance <= 0) {
      throw new HttpException('Insufficient tokens. Please upgrade your plan.', HttpStatus.PAYMENT_REQUIRED);
    }

    if (!isPaid) {
      const projectCount = await this.prisma.project.count({
        where: { userId: user.id }
      });
      if (projectCount >= 1) {
        throw new HttpException('Free tier is limited to 1 project. Please upgrade your plan to create more.', HttpStatus.PAYMENT_REQUIRED);
      }
    }

    // Allow real AI generation for free users so they can experience the true tech stack output
    const useMock = false;

    return { user, isPaid, useMock };
  }

  @Post('generate-blueprint')
  async generateBlueprint(
    @Req() req: Request,
    @Body() dto: GenerateBlueprintDto,
  ) {
    const { projectName, description, level } = dto;
    const { user, isPaid, useMock } = await this.validateSessionAndTokens(req);

    const result = await this.aiService.generateBlueprint(projectName, description, level, useMock);

    if (isPaid && result.usage > 0) {
      await this.prisma.user.update({
        where: { id: user.id },
        data: { tokenBalance: { decrement: result.usage } }
      });
    }

    return result.data;
  }

  @Post('generate-task-prompt')
  async generateTaskPrompt(
    @Req() req: Request,
    @Body() dto: GenerateTaskPromptDto,
  ) {
    const { taskTitle, taskDescription, techStack, checklist, projectName, projectDescription } = dto;
    const { user, isPaid, useMock } = await this.validateSessionAndTokens(req);

    const result = await this.aiService.generateTaskPrompt(
      { taskTitle, taskDescription, techStack, checklist, projectName, projectDescription },
      useMock
    );

    if (isPaid && result.usage > 0) {
      await this.prisma.user.update({
        where: { id: user.id },
        data: { tokenBalance: { decrement: result.usage } }
      });
    }

    return result.data;
  }

  @Post('chat')
  async chat(@Body() dto: ChatDto) {
    const { message, context } = dto;
    return this.aiService.chat(message, context);
  }

  @Post('generate-docs')
  async generateDocs(@Body() dto: GenerateDocsDto) {
    const { projectName, description, techStack, nodes } = dto;
    return this.aiService.generateDocs(projectName, description, techStack, nodes);
  }

  @Post('generate-guide')
  async generateGuide(
    @Req() req: Request,
    @Body() dto: GenerateGuideDto,
  ) {
    const { projectName, description, techStack, checklist } = dto;
    const { user, isPaid, useMock } = await this.validateSessionAndTokens(req);

    const result = await this.aiService.generateImplementationGuide(
      projectName,
      description,
      techStack,
      checklist,
      useMock
    );

    if (isPaid && result.usage > 0) {
      await this.prisma.user.update({
        where: { id: user.id },
        data: { tokenBalance: { decrement: result.usage } }
      });
    }

    return result.data;
  }

  @Post('scan-github')
  async scanGithub(@Body() dto: ScanGithubDto) {
    return this.aiService.scanGithub(dto.githubUrl);
  }

  @Post('estimate-cost')
  async estimateCost(@Body() dto: EstimateCostDto) {
    const { level, techStack } = dto;
    return this.aiService.estimateCost(level, techStack);
  }

  @Post('generate-zip')
  async generateZip(@Body() dto: GenerateZipDto) {
    const { projectName, techStack } = dto;
    return this.aiService.generateBoilerplate(projectName, techStack);
  }
}
