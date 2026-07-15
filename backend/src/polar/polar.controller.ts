import { Controller, Post, Body, Req, UnauthorizedException, Headers } from '@nestjs/common';
import { PolarService } from './polar.service';
import type { Request } from 'express';
import { auth } from '../auth/auth';

@Controller('polar')
export class PolarController {
  constructor(private readonly polarService: PolarService) {}

  private async getUserId(req: Request) {
    const session = await auth.api.getSession({
      headers: req.headers as any
    });
    if (!session || !session.user) {
      throw new UnauthorizedException('Not logged in');
    }
    return session.user.id;
  }

  @Post('checkout')
  async createCheckout(@Req() req: Request, @Body() data: { tier: string }) {
    const userId = await this.getUserId(req);
    return this.polarService.createCheckoutSession(userId, data.tier);
  }

  @Post('webhook')
  async handleWebhook(
    @Body() body: any,
    @Headers('polar-webhook-signature') signature: string,
  ) {
    return this.polarService.handleWebhook(body, signature);
  }
}
