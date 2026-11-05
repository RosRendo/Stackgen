import { Body, Controller, Get, Headers, Post, Req, Res, UnauthorizedException } from '@nestjs/common';
import { LemonsqueezyService } from './lemonsqueezy.service';
import type { Request, Response } from 'express';
import { auth } from '../auth/auth';
import { PrismaService } from '../prisma/prisma.service';

@Controller('lemonsqueezy')
export class LemonsqueezyController {
  constructor(
    private readonly lemonsqueezyService: LemonsqueezyService,
    private readonly prisma: PrismaService
  ) {}

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
  async createCheckout(@Req() req: Request, @Body() body: { tier: 'startup' | 'professional' }) {
    const userId = await this.getUserId(req);
    const user = await this.prisma.user.findUnique({ where: { id: userId } });

    if (!user) {
      throw new UnauthorizedException('Not logged in');
    }

    const tier = body.tier === 'startup' || body.tier === 'professional' ? body.tier : 'startup';
    const url = await this.lemonsqueezyService.createCheckout(userId, user.email, tier);
    return { url };
  }

  @Get('portal')
  async getPortal(@Req() req: Request) {
    const userId = await this.getUserId(req);
    const url = await this.lemonsqueezyService.getCustomerPortalUrl(userId);
    return { url };
  }

  @Post('webhook')
  async handleWebhook(
    @Req() req: Request,
    @Res() res: Response,
    @Headers('x-signature') signature: string
  ) {
    if (!signature) {
      return res.status(401).send('Missing X-Signature header');
    }

    const rawBody = (req as any).rawBody?.toString('utf8');
    if (!rawBody) {
      return res.status(400).send('Missing raw body');
    }

    const valid = await this.lemonsqueezyService.verifyWebhookSignature(rawBody, signature);
    if (!valid) {
      return res.status(401).send('Invalid webhook signature');
    }

    try {
      const parsed = JSON.parse(rawBody);
      await this.lemonsqueezyService.handleWebhook(parsed?.meta?.event_name, parsed);
      return res.status(200).send('OK');
    } catch (err) {
      console.error('Lemon Squeezy webhook error:', err);
      return res.status(500).send('Webhook processing error');
    }
  }
}
