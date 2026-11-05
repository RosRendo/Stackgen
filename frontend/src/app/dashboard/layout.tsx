'use client';

import { ProjectSidebar } from '@/components/layout/project-sidebar';
import { authClient } from '@/lib/auth-client';
import { useRouter, usePathname } from 'next/navigation';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { GitBranch, Loader2, Coins } from 'lucide-react';
import { useEffect } from 'react';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const { data: session, isPending } = authClient.useSession();

  useEffect(() => {
    if (!isPending && !session) {
      router.push('/auth');
    }
  }, [isPending, session, router]);

  if (isPending) {
    return (
      <div className="min-h-screen bg-zinc-950 flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />
      </div>
    );
  }

  if (!session) {
    return null; // Will redirect
  }

  return (
    <div className="min-h-screen relative overflow-hidden bg-zinc-950 flex flex-col">
      {/* Background Gradients */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-[128px]" />
        <div className="absolute bottom-0 right-1/4 w-[30rem] h-[30rem] bg-indigo-500/10 rounded-full blur-[128px]" />
      </div>

      <main className="relative z-10 p-6 md:p-12 flex-1 flex flex-col h-screen overflow-y-auto">
        <header className="flex justify-between items-center mb-8 transition-all">
          <div className="flex items-center gap-4">
            <ProjectSidebar />
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg overflow-hidden flex items-center justify-center">
                <img src="/logo.png" alt="StackGen Logo" className="w-full h-full object-cover" />
              </div>
              <span className="text-xl font-medium tracking-tight text-zinc-100 hidden sm:block">StackGen</span>
            </div>
          </div>
          
          <div>
            <div className="flex items-center gap-3 bg-zinc-900/50 p-1.5 pr-3 rounded-full border border-zinc-800 backdrop-blur-md">
              <Link href="/scanner">
                <Button variant="ghost" size="sm" className="h-8 rounded-full text-zinc-400 hover:text-purple-400 hover:bg-purple-500/10">
                  <GitBranch className="w-4 h-4 mr-2" /> <span className="hidden sm:inline">Scanner</span>
                </Button>
              </Link>
              
              {(process.env.NEXT_PUBLIC_ADMIN_EMAILS || '').toLowerCase().split(',').map(e => e.trim()).filter(Boolean).includes((session.user.email || '').toLowerCase()) && (
                <Link href="/admin">
                  <Button variant="ghost" size="sm" className="h-8 rounded-full text-zinc-400 hover:text-white hover:bg-zinc-800">
                    Admin
                  </Button>
                </Link>
              )}

              <div className="w-px h-4 bg-zinc-800 mx-1" />

              {/* @ts-ignore */}
              {session.user.subscriptionTier && session.user.subscriptionTier !== 'Free' && session.user.subscriptionTier !== 'MVP' && (
                <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-medium mr-1">
                  <Coins className="w-3.5 h-3.5" />
                  {/* @ts-ignore */}
                  {Number(session.user.tokenBalance).toLocaleString()} <span className="hidden sm:inline">Tokens</span>
                </div>
              )}

              <div className="flex items-center gap-2 pl-1">
                <div className="w-6 h-6 rounded-full bg-blue-600 flex items-center justify-center text-xs font-bold text-white uppercase">
                  {(session.user.name || session.user.email || '?').charAt(0)}
                </div>
                <span className="text-sm font-medium text-zinc-300 hidden sm:inline">
                  {session.user.name || session.user.email?.split('@')[0]}
                </span>
              </div>

              <Button 
                variant="ghost" 
                size="sm"
                className="h-8 rounded-full text-zinc-500 hover:text-red-400 hover:bg-red-500/10 ml-1" 
                onClick={async () => {
                  try {
                    await authClient.signOut({
                      fetchOptions: {
                        onSuccess: () => router.push('/'),
                        onError: () => router.push('/') // force redirect even if error
                      }
                    });
                  } catch (e) {
                    router.push('/');
                  }
                }}
              >
                Sign Out
              </Button>
            </div>
          </div>
        </header>

        <div className="flex-1 flex flex-col relative transition-all">
          {children}
        </div>
      </main>
    </div>
  );
}
