import { Injectable } from '@nestjs/common';
import { Environment, Paddle } from '@paddle/paddle-node-sdk';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class PaddleService {
  private paddle: Paddle;

  constructor(private readonly prisma: PrismaService) {
    this.paddle = new Paddle(process.env.PADDLE_API_KEY || '', {
      environment: process.env.PADDLE_ENVIRONMENT === 'sandbox' ? Environment.sandbox : Environment.production,
    });
  }

  async handleWebhook(signature: string, rawBody: string) {
    try {
      if (!process.env.PADDLE_WEBHOOK_SECRET) {
        throw new Error('PADDLE_WEBHOOK_SECRET is not set');
      }

      // Verify the webhook signature
      const eventData = this.paddle.webhooks.unmarshal(rawBody, process.env.PADDLE_WEBHOOK_SECRET, signature);

      if (eventData?.eventType === 'transaction.completed') {
        const transaction = eventData.data as any;
        
        // Extract userId from custom data that we pass from the frontend Checkout
        const userId = transaction.customData?.userId;
        
        if (userId) {
          let tier = 'Professional'; 
          
          if (transaction.items && transaction.items.length > 0) {
            const priceId = transaction.items[0].price?.id;
            if (priceId === process.env.PADDLE_STARTUP_PRICE_ID) {
              tier = 'Startup';
            } else if (priceId === process.env.PADDLE_PROF_PRICE_ID) {
              tier = 'Professional';
            }
          }

          await this.prisma.user.update({
            where: { id: userId },
            data: {
              subscriptionTier: tier,
              subscriptionStatus: 'active',
              paddleCustomerId: transaction.customerId || null,
            },
          });
          console.log(`Successfully upgraded user ${userId} to ${tier}`);
        } else {
          console.error('Webhook received transaction.completed but no customData.userId was found!');
        }
      }

      return { received: true };
    } catch (error) {
      console.error('Paddle Webhook Processing Error:', error);
      throw error;
    }
  }
}
