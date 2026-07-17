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
          
          let priceId = '';
          let productId = '';
          let tier = 'Free';

          // Iterate through items to find our core subscription plan (ignoring addons)
          if (sub.items && Array.isArray(sub.items)) {
            for (const item of sub.items) {
              const pId = item.price?.id;
              if (pId === process.env.PADDLE_STARTUP_PRICE_ID) {
                priceId = pId;
                productId = item.price?.productId || item.price?.product_id || '';
                tier = 'Startup';
                break;
              } else if (pId === process.env.PADDLE_PROF_PRICE_ID) {
                priceId = pId;
                productId = item.price?.productId || item.price?.product_id || '';
                tier = 'Professional';
                break;
              }
            }
            // Fallback if no tier matched (e.g. they bought something else)
            if (!priceId && sub.items.length > 0) {
              priceId = sub.items[0].price?.id || '';
              productId = sub.items[0].price?.productId || sub.items[0].price?.product_id || '';
            }
          }

          // Ensure the Customer exists before creating the Subscription to prevent P2003 foreign key errors
          await this.prisma.customer.upsert({
            where: { id: sub.customerId },
            create: {
              id: sub.customerId,
              email: 'unknown@paddle.com', // Will be updated by customer.created or transaction.completed
            },
            update: {}
          });

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

          // Sync the legacy User fields for frontend UI
          const customer = await this.prisma.customer.findUnique({ where: { id: sub.customerId } });
          if (customer && customer.userId) {
            let finalTier = 'Free';
            if (sub.status === 'active' || sub.status === 'trialing') {
              finalTier = tier;
            }
            await this.prisma.user.update({
              where: { id: customer.userId },
              data: {
                subscriptionTier: finalTier,
                subscriptionStatus: sub.status,
              }
            });
            console.log(`Updated User ${customer.userId} to Tier: ${finalTier}, Status: ${sub.status}`);
          }
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
