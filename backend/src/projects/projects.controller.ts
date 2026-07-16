import { Controller, Post, Get, Param, Body, Req, UnauthorizedException } from '@nestjs/common';
import { ProjectsService } from './projects.service';
import type { Request } from 'express';
import { auth } from '../auth/auth';

@Controller('projects')
export class ProjectsController {
  constructor(private readonly projectsService: ProjectsService) {}

  private async getUserId(req: Request) {
    const session = await auth.api.getSession({
      headers: req.headers as any
    });
    if (!session || !session.user) {
      throw new UnauthorizedException('Not logged in');
    }
    return session.user.id;
  }

  @Get('admin/all')
  async getAllProjects(@Req() req: Request) {
    const session = await auth.api.getSession({
      headers: req.headers as any
    });
    if (!session || !session.user || session.user.email.toLowerCase() !== 'rousrendo@gmail.com') {
      throw new UnauthorizedException('Admin access required');
    }
    return this.projectsService.getAllProjectsForAdmin();
  }

  @Post()
  async saveProject(@Req() req: Request, @Body() data: any) {
    const userId = await this.getUserId(req);
    return this.projectsService.saveProject(userId, data);
  }

  @Get()
  async getUserProjects(@Req() req: Request) {
    const userId = await this.getUserId(req);
    return this.projectsService.getUserProjects(userId);
  }

  @Get(':id')
  async getProject(@Req() req: Request, @Param('id') id: string) {
    const userId = await this.getUserId(req);
    return this.projectsService.getProjectById(userId, id);
  }
}
