import { Controller, Post, Get, Req, Res, Headers, UnauthorizedException, InternalServerErrorException } from '@nestjs/common';
import { PaddleService } from './paddle.service';
import type { Request, Response } from 'express';
import { auth } from '../auth/auth';
import { PrismaService } from '../prisma/prisma.service';

@Controller('paddle')
export class PaddleController {
  constructor(
    private readonly paddleService: PaddleService,
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

  @Get('portal-session')
  async getPortalSession(@Req() req: Request) {
    const userId = await this.getUserId(req);
    
    // Get user's paddle customer ID
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      include: {
        customer: {
          include: {
            subscriptions: true
          }
        }
      }
    });

    if (!user || !user.paddleCustomerId || !user.customer) {
      throw new InternalServerErrorException('User does not have an active Paddle subscription');
    }

    try {
      const subscriptionIds = user.customer.subscriptions.map(s => s.id);
      const url = await this.paddleService.getPortalSession(user.paddleCustomerId, subscriptionIds);
      return { url };
    } catch (error) {
      console.error('Error generating portal session', error);
      throw new InternalServerErrorException('Could not generate portal session');
    }
  }

  @Post('webhook')
  async handleWebhook(
    @Req() req: Request, 
    @Res() res: Response,
    @Headers('paddle-signature') signature: string
  ) {
    if (!signature) {
      return res.status(400).send('Missing Paddle Signature');
    }

    try {
      // req.rawBody is populated because we set rawBody: true in main.ts
      const rawBody = (req as any).rawBody?.toString('utf8');
      if (!rawBody) {
        return res.status(400).send('Missing raw body');
      }

      await this.paddleService.handleWebhook(signature, rawBody);
      return res.status(200).send('OK');
    } catch (err) {
      console.error('Webhook error:', err);
      return res.status(400).send('Webhook Error');
    }
  }
}
