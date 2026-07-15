import { HeroSection } from '@/components/marketing/hero';
import { Header } from '@/components/marketing/header';
import dynamic from 'next/dynamic';
import Image from 'next/image';

const ShowcaseSection = dynamic(() => import('@/components/marketing/showcase').then(mod => mod.ShowcaseSection));
const FeaturesSection = dynamic(() => import('@/components/marketing/features').then(mod => mod.FeaturesSection));
const PricingSection = dynamic(() => import('@/components/marketing/pricing').then(mod => mod.PricingSection));

export default function Home() {
  return (
    <main className="min-h-screen bg-zinc-950">
      <Header />
      <HeroSection />
      <ShowcaseSection />
      <FeaturesSection />
      <PricingSection />
      
      {/* Simple Footer */}
      <footer className="border-t border-zinc-900 bg-zinc-950 py-12">
        <div className="mx-auto max-w-7xl px-6 lg:px-8 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-md overflow-hidden flex items-center justify-center">
              <Image src="/logo.png" alt="StackGen Logo" width={32} height={32} className="w-full h-full object-cover" />
            </div>
            <span className="text-xl font-semibold tracking-tight text-zinc-100">StackGen</span>
          </div>
          <p className="text-sm text-zinc-500">
            &copy; {new Date().getFullYear()} StackGen, Inc. All rights reserved.
          </p>
          <div className="flex gap-4">
            <a href="#" className="text-sm text-zinc-400 hover:text-white">Terms</a>
            <a href="#" className="text-sm text-zinc-400 hover:text-white">Privacy</a>
            <a href="mailto:contact@stackgen.site" className="text-sm text-zinc-400 hover:text-white">Contact</a>
          </div>
        </div>
      </footer>
    </main>
  );
}
