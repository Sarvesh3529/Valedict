'use client';

import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { ArrowRight, FileQuestion, Loader2 } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function OnboardingStartPage() {
  const { profile, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && profile && profile.onboardingComplete) {
      router.replace('/home');
    }
  }, [loading, profile, router]);

  if (loading || (profile && profile.onboardingComplete)) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-slate-900">
        <Loader2 className="h-8 w-8 animate-spin text-white" />
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4 text-center">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-slate-800 p-8 rounded-2xl shadow-2xl max-w-md w-full"
      >
        <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto mb-6">
          <FileQuestion className="w-8 h-8 text-white" />
        </div>
        <h1 className="text-2xl font-bold mb-2">First, a few questions</h1>
        <p className="text-slate-400 mb-6">
          Answer a few quick questions to personalize your learning path.
        </p>
        <Button asChild size="lg" className="w-full">
          <Link href="/onboarding">
            Continue <ArrowRight className="w-5 h-5 ml-1"/>
          </Link>
        </Button>
      </motion.div>
    </div>
  );
}
