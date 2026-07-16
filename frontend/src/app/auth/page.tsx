'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { authClient } from '@/lib/auth-client';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Loader2, ArrowLeft, Mail } from 'lucide-react';
import Link from 'next/link';

export default function AuthPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);
  const [verificationSent, setVerificationSent] = useState(false);
  const router = useRouter();

  const handleSocialLogin = async (provider: 'github' | 'google') => {
    setLoading(true);
    try {
      await authClient.signIn.social({
        provider,
        callbackURL: '/dashboard'
      });
    } catch (err) {
      console.error(`${provider} auth error:`, err);
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (isLogin) {
        const res = await authClient.signIn.email({ email, password });
        if (res.error) throw res.error;
        router.push('/dashboard');
      } else {
        const res = await authClient.signUp.email({ email, password, name });
        if (res.error) throw res.error;
        setVerificationSent(true);
      }
    } catch (err) {
      console.error('Auth error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-zinc-950 flex flex-col justify-center items-center p-4">
      <div className="absolute top-8 left-8 z-20">
        <Link href="/" className="flex items-center text-sm font-medium text-zinc-400 hover:text-zinc-200 transition-colors">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back
        </Link>
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 10 }} 
        animate={{ opacity: 1, y: 0 }} 
        transition={{ duration: 0.3 }}
        className="w-full max-w-[400px] relative z-10"
      >
        <div className="flex flex-col items-center mb-6">
          <div className="w-10 h-10 rounded-lg bg-zinc-100 flex items-center justify-center mb-5 shadow-sm">
            <span className="text-zinc-900 font-bold text-xl">D</span>
          </div>
          <h1 className="text-xl font-medium tracking-tight text-zinc-100">
            {isLogin ? 'Log in to your account' : 'Create your account'}
          </h1>
          <p className="text-sm text-zinc-400 mt-1.5 text-center">
            {verificationSent 
              ? 'We have sent a verification link to your email.' 
              : isLogin 
                ? 'Enter your details below to log in' 
                : 'Enter your details below to sign up'}
          </p>
        </div>

        {verificationSent ? (
          <Card className="bg-zinc-950/80 border border-zinc-800/80 shadow-xl rounded-xl">
            <CardContent className="pt-8 px-6 pb-8 flex flex-col items-center text-center">
              <div className="w-16 h-16 rounded-full bg-purple-500/10 flex items-center justify-center mb-6">
                <Mail className="w-8 h-8 text-purple-400" />
              </div>
              <h2 className="text-xl font-medium text-zinc-100 mb-2">Check your email</h2>
              <p className="text-zinc-400 text-sm mb-6">
                We've sent a verification link to <span className="text-zinc-200 font-medium">{email}</span>. 
                Please click the link to activate your account.
              </p>
              <Button onClick={() => setVerificationSent(false)} variant="outline" className="bg-transparent border-zinc-800 text-zinc-300 w-full hover:bg-zinc-900">
                Back to login
              </Button>
            </CardContent>
          </Card>
        ) : (
        <Card className="bg-zinc-950/80 border border-zinc-800/80 shadow-xl rounded-xl">
          <CardContent className="pt-6 px-6">
            <div className="grid grid-cols-2 gap-3 mb-6">
              <Button type="button" onClick={() => handleSocialLogin('github')} variant="outline" className="bg-transparent border-zinc-800 hover:bg-zinc-900 hover:text-zinc-100 text-zinc-300 font-normal shadow-sm h-10">
                <svg className="w-4 h-4 mr-2 text-zinc-100" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
                </svg>
                GitHub
              </Button>
              <Button type="button" onClick={() => handleSocialLogin('google')} variant="outline" className="bg-transparent border-zinc-800 hover:bg-zinc-900 hover:text-zinc-100 text-zinc-300 font-normal shadow-sm h-10">
                <svg className="w-4 h-4 mr-2" viewBox="0 0 24 24">
                  <path
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    fill="#4285F4"
                  />
                  <path
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    fill="#34A853"
                  />
                  <path
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                    fill="#FBBC05"
                  />
                  <path
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                    fill="#EA4335"
                  />
                </svg>
                Google
              </Button>
            </div>

            <div className="relative mb-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-zinc-800/80"></div>
              </div>
              <div className="relative flex justify-center text-xs">
                <span className="bg-zinc-950 px-2 text-zinc-500">OR CONTINUE WITH</span>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {!isLogin && (
                <div className="space-y-2">
                  <Label htmlFor="name" className="text-xs font-medium text-zinc-400">Name</Label>
                  <Input 
                    id="name" 
                    value={name} 
                    onChange={e => setName(e.target.value)} 
                    required 
                    className="bg-zinc-900/50 border-zinc-800 focus-visible:ring-1 focus-visible:ring-zinc-600 focus-visible:border-zinc-600 transition-colors placeholder:text-zinc-600 h-10 shadow-sm rounded-lg" 
                  />
                </div>
              )}
              <div className="space-y-2">
                <Label htmlFor="email" className="text-xs font-medium text-zinc-400">Email address</Label>
                <Input 
                  id="email" 
                  type="email" 
                  value={email} 
                  onChange={e => setEmail(e.target.value)} 
                  required 
                  className="bg-zinc-900/50 border-zinc-800 focus-visible:ring-1 focus-visible:ring-zinc-600 focus-visible:border-zinc-600 transition-colors placeholder:text-zinc-600 h-10 shadow-sm rounded-lg" 
                />
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="password" className="text-xs font-medium text-zinc-400">Password</Label>
                </div>
                <Input 
                  id="password" 
                  type="password" 
                  value={password} 
                  onChange={e => setPassword(e.target.value)} 
                  required 
                  className="bg-zinc-900/50 border-zinc-800 focus-visible:ring-1 focus-visible:ring-zinc-600 focus-visible:border-zinc-600 transition-colors placeholder:text-zinc-600 h-10 shadow-sm rounded-lg" 
                />
              </div>

              <Button type="submit" className="w-full bg-zinc-100 hover:bg-white text-zinc-900 font-medium mt-6 h-10 shadow-sm rounded-lg" disabled={loading}>
                {loading ? (
                  <Loader2 className="w-4 h-4 mr-2 animate-spin text-zinc-500" />
                ) : null}
                {isLogin ? 'Sign in' : 'Sign up'}
              </Button>
            </form>
          </CardContent>
          <CardFooter className="flex justify-center border-t border-zinc-800/80 pt-5 pb-5 rounded-b-xl">
            <button 
              type="button" 
              onClick={() => {
                setIsLogin(!isLogin);
                setName('');
                setEmail('');
                setPassword('');
              }}
              className="text-xs text-zinc-400 hover:text-zinc-200 transition-colors"
            >
              {isLogin ? (
                <>Don&apos;t have an account? <span className="text-zinc-100 font-medium">Sign up</span></>
              ) : (
                <>Already have an account? <span className="text-zinc-100 font-medium">Log in</span></>
              )}
            </button>
          </CardFooter>
        </Card>
        )}
      </motion.div>
    </div>
  );
}
