'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Check, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { authClient } from '@/lib/auth-client';

const tiers = [
  {
    name: 'MVP',
    id: 'tier-mvp',
    href: '/auth',
    priceMonthly: '$0',
    description: 'Perfect for exploring and planning your next side project.',
    features: [
      '1 Active Project',
      'Basic AI Architecture Generation',
      'Master Checklist (Read-only)',
      'Community Support',
    ],
    featured: false,
  },
  {
    name: 'Startup',
    id: 'tier-startup',
    href: '/auth',
    priceMonthly: '$19',
    description: 'For indie hackers validating their ideas and shipping fast.',
    features: [
      '5 Active Projects',
      'Advanced AI CTO Consulting',
      'Interactive Master Checklist Tracking',
      'GitHub Architecture Scanner (Basic)',
    ],
    featured: true,
  },
  {
    name: 'Professional',
    id: 'tier-professional',
    href: '/auth',
    priceMonthly: '$49',
    description: 'For serious developers shipping to production and scaling.',
    features: [
      'Unlimited Projects',
      'Advanced AI CTO Consulting',
      'Interactive Master Checklist Tracking',
      'GitHub Architecture Scanner (Unlimited)',
      'Export schemas and plans',
      'Priority Email Support',
    ],
    featured: false,
  },
  {
    name: 'Enterprise',
    id: 'tier-enterprise',
    href: 'mailto:contact@stackgen.site',
    priceMonthly: 'Custom',
    description: 'Dedicated support and infrastructure for your whole team.',
    features: [
      'Everything in Professional',
      'Custom architecture rules',
      'Private repository scanning',
      'Single Sign-On (SSO)',
      'Dedicated Account Manager',
    ],
    featured: false,
  },
];

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(' ');
}

export function PricingSection() {
  const { data: session } = authClient.useSession();
  const router = useRouter();
  const [loadingTier, setLoadingTier] = useState<string | null>(null);

  const handleCheckout = async (tierName: string, href: string) => {
    if (tierName === 'Enterprise') {
      window.location.href = href;
      return;
    }
    
    if (!session) {
      router.push('/auth');
      return;
    }
    
    if (tierName === 'MVP') {
      router.push('/dashboard');
      return;
    }

    setLoadingTier(tierName);
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/polar/checkout`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ tier: tierName }),
      });
      
      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
      } else {
        throw new Error('No checkout URL returned');
      }
    } catch (err) {
      console.error('Checkout error:', err);
    } finally {
      setLoadingTier(null);
    }
  };

  return (
    <div id="pricing" className="py-24 sm:py-32 bg-zinc-950 border-t border-zinc-900/50">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-4xl text-center">
          <h2 className="text-sm font-semibold leading-7 text-zinc-400 tracking-wide uppercase">Pricing</h2>
          <p className="mt-2 text-4xl font-medium tracking-tight text-zinc-100 sm:text-5xl">
            Pricing plans for teams of all sizes
          </p>
        </div>
        <p className="mx-auto mt-6 max-w-2xl text-center text-lg leading-8 text-zinc-400">
          Choose an affordable plan that is packed with the best features for engaging your audience, creating customer loyalty, and driving sales.
        </p>
        
        <div className="isolate mx-auto mt-16 grid max-w-md grid-cols-1 gap-y-8 sm:mt-20 lg:mx-0 lg:max-w-none lg:grid-cols-2 xl:grid-cols-4 lg:gap-x-8 xl:gap-x-12">
          {tiers.map((tier, index) => (
            <motion.div
              key={tier.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.15 }}
              className={classNames(
                tier.featured ? 'bg-zinc-900 border border-zinc-700 shadow-xl' : 'bg-zinc-950 border border-zinc-900',
                'rounded-3xl p-8 xl:p-10 flex flex-col justify-between'
              )}
            >
              <div>
                <div className="flex items-center justify-between gap-x-4">
                  <h3
                    id={tier.id}
                    className={classNames(
                      tier.featured ? 'text-zinc-100' : 'text-zinc-300',
                      'text-lg font-medium leading-8'
                    )}
                  >
                    {tier.name}
                  </h3>
                  {tier.featured ? (
                    <p className="rounded-full bg-zinc-800 border border-zinc-700 px-2.5 py-1 text-xs font-medium leading-5 text-zinc-300">
                      Most popular
                    </p>
                  ) : null}
                </div>
                <p className="mt-4 text-sm leading-6 text-zinc-400">{tier.description}</p>
                <p className="mt-6 flex items-baseline gap-x-1">
                  <span className="text-4xl font-bold tracking-tight text-white">{tier.priceMonthly}</span>
                  {tier.priceMonthly !== 'Custom' && <span className="text-sm font-semibold leading-6 text-zinc-400">/month</span>}
                </p>
                <ul role="list" className="mt-8 space-y-3 text-sm leading-6 text-zinc-400">
                  {tier.features.map((feature) => (
                    <li key={feature} className="flex gap-x-3">
                      <Check className="h-5 w-5 flex-none text-zinc-100" aria-hidden="true" />
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="mt-8">
                <Button 
                  onClick={() => handleCheckout(tier.name, tier.href)}
                  disabled={loadingTier === tier.name}
                  variant={tier.featured ? "default" : "outline"} 
                  className={classNames(
                    "w-full rounded-full py-6 text-sm font-medium shadow-sm transition-all",
                    tier.featured ? "bg-zinc-100 text-zinc-900 hover:bg-white" : "bg-transparent border-zinc-800 text-zinc-300 hover:bg-zinc-900 hover:text-zinc-100"
                  )}
                >
                  {loadingTier === tier.name ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                  ) : (
                    "Get started"
                  )}
                </Button>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
