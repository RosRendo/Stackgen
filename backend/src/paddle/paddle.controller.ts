import { Controller, Post, Req, Res, Headers } from '@nestjs/common';
import { PaddleService } from './paddle.service';
import type { Request, Response } from 'express';

@Controller('paddle')
export class PaddleController {
  constructor(private readonly paddleService: PaddleService) {}

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
