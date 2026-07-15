'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { authClient } from '@/lib/auth-client';
import { motion } from 'framer-motion';

export function Header() {
  const { data: session, isPending } = authClient.useSession();

  return (
    <header className="fixed top-0 inset-x-0 z-50 border-b border-zinc-800/80 bg-zinc-950/80 backdrop-blur-md">
      <div className="mx-auto max-w-7xl px-6 lg:px-8 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 transition-opacity hover:opacity-80">
          <div className="w-8 h-8 rounded-md bg-zinc-100 flex items-center justify-center">
            <span className="text-zinc-900 font-bold text-lg">S</span>
          </div>
          <span className="text-xl font-semibold tracking-tight text-zinc-100">StackGen</span>
        </Link>
        
        <div className="flex items-center gap-4">
          <Link href="#features" className="hidden sm:block text-sm font-medium text-zinc-400 hover:text-zinc-100 transition-colors mr-2">
            Features
          </Link>
          <Link href="#pricing" className="hidden sm:block text-sm font-medium text-zinc-400 hover:text-zinc-100 transition-colors mr-4">
            Pricing
          </Link>
          
          <div className="h-4 w-px bg-zinc-800 hidden sm:block mr-2" />

          {!isPending && (
            <>
              {session ? (
                <Link href="/dashboard">
                  <Button variant="outline" className="border-zinc-800 text-zinc-300 hover:text-zinc-100 hover:bg-zinc-900">
                    Dashboard
                  </Button>
                </Link>
              ) : (
                <>
                  <Link href="/auth">
                    <Button variant="ghost" className="text-zinc-400 hover:text-zinc-100 hover:bg-zinc-900">
                      Log in
                    </Button>
                  </Link>
                  <Link href="/auth">
                    <Button className="bg-zinc-100 hover:bg-white text-zinc-900 font-medium shadow-sm">
                      Sign up
                    </Button>
                  </Link>
                </>
              )}
            </>
          )}
        </div>
      </div>
    </header>
  );
}
