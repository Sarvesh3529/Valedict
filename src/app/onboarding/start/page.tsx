'use client';

import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { ArrowRight, FileQuestion } from 'lucide-react';

export default function OnboardingStartPage() {
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
