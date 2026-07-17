import { Injectable } from '@nestjs/common';
import { Environment, Paddle } from '@paddle/paddle-node-sdk';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class PaddleService {
  private paddle: Paddle;

  constructor(private readonly prisma: PrismaService) {
    this.paddle = new Paddle(process.env.PADDLE_LIVE_API_KEY || '', {
      environment: process.env.PADDLE_ENVIRONMENT === 'sandbox' ? Environment.sandbox : Environment.production,
    });
  }

  async getPortalSession(customerId: string, subscriptionIds: string[]) {
    const session = await this.paddle.customerPortalSessions.create(customerId, subscriptionIds);
    return session.urls.general.overview;
  }

  async hasAccess(userId: string): Promise<boolean> {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      include: {
        customer: {
          include: {
            subscriptions: {
              where: {
                status: { in: ['active', 'trialing'] }
              }
            }
          }
        }
      }
    });

    if (!user || !user.customer) return false;
    return user.customer.subscriptions.length > 0;
  }

  async handleWebhook(signature: string, rawBody: string) {
    if (!process.env.PADDLE_WEBHOOK_SECRET) {
      throw new Error('PADDLE_WEBHOOK_SECRET is not set');
    }

    let eventData: any;
    try {
      // Verify the webhook signature
      eventData = await this.paddle.webhooks.unmarshal(rawBody, process.env.PADDLE_WEBHOOK_SECRET, signature);
    } catch (error) {
      console.error('Paddle signature verification failed', error);
      throw new Error('Signature verification failed');
    }

    const { eventType, data } = eventData;

    try {
      switch (eventType) {
        case 'customer.created':
        case 'customer.updated': {
          const customer = data as any;
          await this.prisma.customer.upsert({
            where: { id: customer.id },
            create: {
              id: customer.id,
              email: customer.email,
            },
            update: {
              email: customer.email,
            }
          });
          break;
        }

        case 'subscription.created':
        case 'subscription.updated':
        case 'subscription.canceled': {
          const sub = data as any;
          
          const priceId = sub.items?.[0]?.price?.id || '';
          const productId = sub.items?.[0]?.price?.productId || '';

          await this.prisma.subscription.upsert({
            where: { id: sub.id },
            create: {
              id: sub.id,
              customerId: sub.customerId,
              status: sub.status,
              priceId,
              productId,
              scheduledChangeAction: sub.scheduledChange?.action || null,
              scheduledChangeAt: sub.scheduledChange?.effectiveAt ? new Date(sub.scheduledChange.effectiveAt) : null,
            },
            update: {
              status: sub.status,
              priceId,
              productId,
              scheduledChangeAction: sub.scheduledChange?.action || null,
              scheduledChangeAt: sub.scheduledChange?.effectiveAt ? new Date(sub.scheduledChange.effectiveAt) : null,
            }
          });
          break;
        }

        case 'transaction.completed': {
          const transaction = data as any;
          const userId = transaction.customData?.userId;
          
          if (userId && transaction.customerId) {
            await this.prisma.customer.upsert({
              where: { id: transaction.customerId },
              create: {
                id: transaction.customerId,
                email: transaction.customer?.email || 'unknown@paddle.com',
                userId,
              },
              update: {
                userId,
              }
            });

            let tier = 'Free';
            if (transaction.items && transaction.items.length > 0) {
              const priceId = transaction.items[0].price?.id;
              if (priceId === process.env.PADDLE_STARTUP_PRICE_ID) tier = 'Startup';
              else if (priceId === process.env.PADDLE_PROF_PRICE_ID) tier = 'Professional';
            }

            await this.prisma.user.update({
              where: { id: userId },
              data: {
                subscriptionTier: tier,
                subscriptionStatus: 'active',
                paddleCustomerId: transaction.customerId,
              },
            });
            console.log(`Linked User ${userId} to Paddle Customer ${transaction.customerId}`);
          }
          break;
        }
      }
    } catch (err) {
      console.error(`Error processing event ${eventType}:`, err);
      throw err;
    }

    return { received: true };
  }
}
