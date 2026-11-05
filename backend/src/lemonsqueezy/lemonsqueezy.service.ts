import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { createHmac, timingSafeEqual } from 'crypto';
import { PrismaService } from '../prisma/prisma.service';

const LS_API_BASE = 'https://api.lemonsqueezy.com/v1';

type Tier = 'Free' | 'Startup' | 'Professional';

@Injectable()
export class LemonsqueezyService {
  constructor(private readonly prisma: PrismaService) {}

  private headers() {
    if (!process.env.LEMONSQUEEZY_API_KEY) {
      throw new InternalServerErrorException('LEMONSQUEEZY_API_KEY is not set');
    }
    return {
      Authorization: `Bearer ${process.env.LEMONSQUEEZY_API_KEY}`,
      Accept: 'application/json',
      'Content-Type': 'application/json',
    };
  }

  private variantForTier(tier: 'startup' | 'professional'): string | null {
    const id = tier === 'startup'
      ? process.env.LEMONSQUEEZY_STARTUP_VARIANT_ID
      : process.env.LEMONSQUEEZY_PROFESSIONAL_VARIANT_ID;
    return id || null;
  }

  async createCheckout(userId: string, email: string, tier: 'startup' | 'professional'): Promise<string> {
    const variantId = this.variantForTier(tier);
    if (!process.env.LEMONSQUEEZY_STORE_ID || !variantId) {
      throw new InternalServerErrorException('Lemon Squeezy store/variant IDs are not configured');
    }

    const res = await fetch(`${LS_API_BASE}/checkouts`, {
      method: 'POST',
      headers: this.headers(),
      body: JSON.stringify({
        data: {
          type: 'checkouts',
          attributes: {
            custom_price: null,
            product_options: {
              enabled: true,
              redirect_url: `${process.env.FRONTEND_URL || 'http://localhost:3000'}/dashboard`,
            },
            checkout_options: { embed: false },
            checkout_data: {
              email,
              custom: { user_id: userId },
            },
            custom: { user_id: userId },
          },
          relationships: {
            store: { data: { type: 'stores', id: String(process.env.LEMONSQUEEZY_STORE_ID) } },
            variant: { data: { type: 'variants', id: String(variantId) } },
          },
        },
      }),
    });

    if (!res.ok) {
      const text = await res.text();
      console.error('Lemon Squeezy checkout creation failed:', text);
      throw new InternalServerErrorException('Could not create checkout session');
    }

    const json: any = await res.json();
    return json?.data?.attributes?.url;
  }

  async verifyWebhookSignature(rawBody: string, signature: string): Promise<boolean> {
    const secret = process.env.LEMONSQUEEZY_WEBHOOK_SECRET;
    if (!secret) {
      throw new InternalServerErrorException('LEMONSQUEEZY_WEBHOOK_SECRET is not set');
    }
    if (!signature) return false;

    const digest = createHmac('sha256', secret).update(rawBody).digest('hex');
    const a = Buffer.from(digest, 'utf8');
    const b = Buffer.from(signature, 'utf8');
    if (a.length !== b.length) return false;
    return timingSafeEqual(a, b);
  }

  private tierForVariant(variantId: unknown): Tier {
    const id = variantId == null ? '' : String(variantId);
    if (id && id === process.env.LEMONSQUEEZY_STARTUP_VARIANT_ID) return 'Startup';
    if (id && id === process.env.LEMONSQUEEZY_PROFESSIONAL_VARIANT_ID) return 'Professional';
    return 'Free';
  }

  private async upsertCustomer(id: string, email: string, userId?: string | null) {
    await this.prisma.customer.upsert({
      where: { id },
      create: {
        id,
        email,
        ...(userId ? { userId } : {}),
      },
      update: {
        email,
        ...(userId ? { userId } : {}),
      },
    });
  }

  async getCustomerPortalUrl(userId: string): Promise<string | null> {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      include: { customer: { include: { subscriptions: true } } },
    });

    if (!user || !user.customer || user.customer.subscriptions.length === 0) {
      throw new InternalServerErrorException('No active subscription found for this user');
    }

    const sub = user.customer.subscriptions[0];
    if (sub.portalUrl) return sub.portalUrl;

    try {
      const res = await fetch(`${LS_API_BASE}/subscriptions/${sub.id}`, { headers: this.headers() });
      if (res.ok) {
        const json: any = await res.json();
        const portal = json?.data?.attributes?.urls?.customer_portal;
        if (portal) return portal;
      }
    } catch (err) {
      console.error('Could not fetch Lemon Squeezy portal URL', err);
    }
    throw new InternalServerErrorException('Could not generate customer portal URL');
  }

  async handleWebhook(eventType: string, body: any) {
    const data = body?.data || {};
    const attributes = data?.attributes || {};
    const meta = body?.meta || {};
    const custom = meta.custom_data || attributes.checkout_data?.custom || {};
    const userId = custom.user_id || custom.userId || null;

    switch (eventType) {
      case 'order_created': {
        const customerId = String(attributes.customer_id || '');
        const email = attributes.user_email || 'unknown@lemonsqueezy.com';
        if (customerId) {
          await this.upsertCustomer(customerId, email, userId);

          let tier: Tier = this.tierForVariant(attributes.first_order_item?.variant_id);

          if (userId) {
            const user = await this.prisma.user.findUnique({ where: { id: userId } });
            if (user) {
              await this.prisma.user.update({
                where: { id: userId },
                data: {
                  subscriptionTier: tier === 'Free' ? user.subscriptionTier || 'Free' : tier,
                  ...(customerId ? { squeezyCustomerId: customerId } : {}),
                },
              });
            }
          }
        }
        break;
      }

      case 'subscription_created':
      case 'subscription_updated': {
        const subId = String(data.id);
        const customerId = String(attributes.customer_id || '');
        const variantTier = this.tierForVariant(attributes.variant_id);
        const isActive = attributes.status === 'active' || attributes.status === 'on_trial';
        const finalTier: Tier = isActive ? variantTier : 'Free';

        if (customerId) {
          // Link customer to the user (via custom data or fallback email lookup)
          let linkedUserId = userId;
          if (!linkedUserId) {
            const existing = await this.prisma.customer.findUnique({ where: { id: customerId } });
            linkedUserId = existing?.userId || null;
          }
          await this.upsertCustomer(customerId, attributes.user_email || 'unknown@lemonsqueezy.com', linkedUserId);

          await this.prisma.subscription.upsert({
            where: { id: subId },
            create: {
              id: subId,
              customerId,
              status: attributes.status || 'active',
              priceId: String(attributes.first_subscription_item?.price_id || ''),
              productId: String(attributes.product_id || ''),
              portalUrl: attributes.urls?.customer_portal || null,
            },
            update: {
              status: attributes.status || 'active',
              priceId: String(attributes.first_subscription_item?.price_id || ''),
              productId: String(attributes.product_id || ''),
              portalUrl: attributes.urls?.customer_portal || null,
            },
          });

          if (linkedUserId) {
            await this.prisma.user.update({
              where: { id: linkedUserId },
              data: {
                subscriptionTier: finalTier,
                subscriptionStatus: attributes.status || 'active',
                ...(customerId ? { squeezyCustomerId: customerId } : {}),
              },
            });
          }
        }
        break;
      }

      case 'subscription_cancelled':
      case 'subscription_expired': {
        const subId = String(data.id);
        const customerId = String(attributes.customer_id || '');
        const status = attributes.status || 'cancelled';

        await this.prisma.subscription.updateMany({
          where: { id: subId },
          data: { status },
        });

        // Downgrade only if the user has no other active subscription
        const customer = await this.prisma.customer.findUnique({
          where: { id: customerId },
          include: { subscriptions: true },
        });
        const hasActive = (customer?.subscriptions || []).some((s: { id: string; status: string }) => s.id !== subId && (s.status === 'active' || s.status === 'on_trial'));
        if (customer?.userId && !hasActive) {
          await this.prisma.user.update({
            where: { id: customer.userId },
            data: { subscriptionTier: 'Free', subscriptionStatus: status },
          });
        }
        break;
      }

      case 'subscription_payment_success': {
        const customerId = String(attributes.customer_id || '');
        if (customerId && userId) {
          await this.upsertCustomer(customerId, attributes.user_email || 'unknown@lemonsqueezy.com', userId);
        }
        break;
      }

      default:
        // Unhandled events are acknowledged silently
        break;
    }

    return { received: true };
  }
}
