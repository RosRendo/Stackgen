import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { Polar } from '@polar-sh/sdk';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class PolarService {
  private polar: Polar;

  constructor(private prisma: PrismaService) {
    this.polar = new Polar({
      accessToken: process.env.POLAR_ACCESS_TOKEN || '',
    });
  }

  async createCheckoutSession(userId: string, tier: string) {
    // 1. Map tiers to Polar product IDs (you will get these from Polar dashboard)
    const productMapping: Record<string, string> = {
      'Startup': process.env.POLAR_STARTUP_PRODUCT_ID || '',
      'Professional': process.env.POLAR_PROFESSIONAL_PRODUCT_ID || '',
    };

    const productId = productMapping[tier];
    if (!productId) {
      throw new HttpException('Invalid tier or missing product ID', HttpStatus.BAD_REQUEST);
    }

    try {
      // 2. Create checkout session using Polar SDK
      const checkout = await this.polar.checkouts.create({
        products: [productId],
        successUrl: `${process.env.FRONTEND_URL || 'http://localhost:3000'}/admin?checkout=success`,
        metadata: {
          userId, // Pass userId in metadata to identify them in the webhook
        }
      });

      return { url: checkout.url };
    } catch (err) {
      console.error('Polar checkout error:', err);
      throw new HttpException('Failed to create checkout session', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async handleWebhook(body: any, signature: string) {
    // In production, verify the webhook signature here using Polar's webhook secret
    // const webhookSecret = process.env.POLAR_WEBHOOK_SECRET;

    if (body.type === 'subscription.created' || body.type === 'subscription.updated') {
      const subscription = body.data;
      const userId = subscription.metadata?.userId;
      
      if (userId) {
        const tierName = subscription.product?.name || 'MVP';
        let tokensToAdd = 100000; // Default for MVP

        if (tierName === 'Startup') {
          tokensToAdd = 500000;
        } else if (tierName === 'Professional') {
          tokensToAdd = 2000000;
        } else if (tierName === 'Enterprise') {
          tokensToAdd = 10000000;
        }

        await this.prisma.user.update({
          where: { id: userId },
          data: {
            polarCustomerId: subscription.customerId,
            subscriptionTier: tierName,
            subscriptionStatus: subscription.status,
            tokenBalance: { increment: tokensToAdd }
          }
        });
      }
    } else if (body.type === 'subscription.canceled') {
       const subscription = body.data;
       const userId = subscription.metadata?.userId;
       if (userId) {
         await this.prisma.user.update({
           where: { id: userId },
           data: {
             subscriptionStatus: 'canceled',
           }
         });
       }
    }

    return { received: true };
  }
}
