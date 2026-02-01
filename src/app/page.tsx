'use client';

import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { ArrowRight, BrainCircuit } from 'lucide-react';

export default function LandingPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-slate-900 text-white p-4 text-center">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-slate-800 p-8 rounded-2xl shadow-2xl max-w-md w-full"
      >
        <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto mb-6">
          <BrainCircuit className="w-8 h-8 text-white" />
        </div>
        <h1 className="text-3xl font-bold mb-2">Welcome to ExamPrep AI</h1>
        <p className="text-slate-400 mb-6">
          Your personalized AI study partner. Let's get you started.
        </p>
        <Button asChild size="lg" className="w-full">
          <Link href="/onboarding/start">
            Get Started <ArrowRight className="w-5 h-5 ml-1"/>
          </Link>
        </Button>
      </motion.div>
    </div>
  );
}
