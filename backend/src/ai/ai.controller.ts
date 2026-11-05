import { Controller, Post, Body, Req, Get, HttpException, HttpStatus } from '@nestjs/common';
import type { Request } from 'express';
import { AiService } from './ai.service';
import { PrismaService } from '../prisma/prisma.service';
import { auth } from '../auth/auth';
import { fromNodeHeaders } from 'better-auth/node';
import { aiGateway } from './model-gateway';
import { GenerateBlueprintDto, GenerateTaskPromptDto, ChatDto, GenerateDocsDto, ScanGithubDto, EstimateCostDto, GenerateZipDto, GenerateGuideDto } from './dto/ai.dto';

@Controller('ai')
export class AiController {
  constructor(
    private readonly aiService: AiService,
    private readonly prisma: PrismaService
  ) {}

  @Get('models')
  listModels() {
    return aiGateway.listModels();
  }

  private async getSession(req: Request) {
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

    return user;
  }

  private isPaidUser(user: { subscriptionStatus?: string | null; subscriptionTier?: string | null }): boolean {
    return user.subscriptionStatus === 'active' || (!!user.subscriptionTier && user.subscriptionTier !== 'Free');
  }

  private async validateSessionAndTokens(req: Request) {
    const user = await this.getSession(req);

    const isPaid = this.isPaidUser(user);

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

    return { user, isPaid };
  }

  @Post('generate-blueprint')
  async generateBlueprint(
    @Req() req: Request,
    @Body() dto: GenerateBlueprintDto,
  ) {
    const { projectName, description, level } = dto;
    const { user, isPaid } = await this.validateSessionAndTokens(req);

    // Free users' AI calls are pinned to the free FreeLLM router (no paid tokens burned)
    const result = await this.aiService.generateBlueprint(projectName, description, level, isPaid ? dto.model : 'auto');

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
    const { user, isPaid } = await this.validateSessionAndTokens(req);

    const result = await this.aiService.generateTaskPrompt(
      { taskTitle, taskDescription, techStack, checklist, projectName, projectDescription },
      isPaid ? dto.model : 'auto'
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
  async chat(@Req() req: Request, @Body() dto: ChatDto) {
    const user = await this.getSession(req);
    const isPaid = this.isPaidUser(user);

    if (isPaid) {
      if (user.tokenBalance <= 0) {
        throw new HttpException('Insufficient tokens. Please upgrade your plan.', HttpStatus.PAYMENT_REQUIRED);
      }
      await this.prisma.user.update({
        where: { id: user.id },
        data: { tokenBalance: { decrement: 100 } }
      });
    }

    return this.aiService.chat(dto.message, dto.context, isPaid ? dto.model : 'auto');
  }

  @Post('generate-docs')
  async generateDocs(@Req() req: Request, @Body() dto: GenerateDocsDto) {
    const user = await this.getSession(req);
    const model = this.isPaidUser(user) ? dto.model : 'auto';
    return this.aiService.generateDocs(dto.projectName, dto.description, dto.techStack, dto.nodes, model);
  }

  @Post('generate-guide')
  async generateGuide(
    @Req() req: Request,
    @Body() dto: GenerateGuideDto,
  ) {
    const { user, isPaid } = await this.validateSessionAndTokens(req);

    const result = await this.aiService.generateImplementationGuide(
      dto.projectName,
      dto.description,
      dto.techStack,
      dto.checklist,
      isPaid ? dto.model : 'auto'
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
  async scanGithub(@Req() req: Request, @Body() dto: ScanGithubDto) {
    const user = await this.getSession(req);
    return this.aiService.scanGithub(dto.githubUrl, this.isPaidUser(user) ? dto.model : 'auto');
  }

  @Post('estimate-cost')
  async estimateCost(@Req() req: Request, @Body() dto: EstimateCostDto) {
    const user = await this.getSession(req);
    return this.aiService.estimateCost(dto.level, dto.techStack, this.isPaidUser(user) ? dto.model : 'auto');
  }

  @Post('generate-zip')
  async generateZip(@Req() req: Request, @Body() dto: GenerateZipDto) {
    const user = await this.getSession(req);
    const isPaid = user.subscriptionStatus === 'active' || (user.subscriptionTier && user.subscriptionTier !== 'Free') ? true : false;

    if (!isPaid) {
      throw new HttpException('Boilerplate export is available on paid plans. Please upgrade your plan.', HttpStatus.PAYMENT_REQUIRED);
    }

    if (user.tokenBalance <= 0) {
      throw new HttpException('Insufficient tokens. Please upgrade your plan.', HttpStatus.PAYMENT_REQUIRED);
    }

    const { projectName, techStack, model } = dto;
    return this.aiService.generateBoilerplate(projectName, techStack, model);
  }
}
