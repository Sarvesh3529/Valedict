'use client';

import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { ArrowRight, BookCheck } from 'lucide-react';
import { Suspense } from 'react';

function RevisionStartContent() {
  const searchParams = useSearchParams();
  const subjects = searchParams.get('subjects');
  const grade = searchParams.get('grade');

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4 text-center">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-slate-800 p-8 rounded-2xl shadow-2xl max-w-md w-full"
      >
        <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto mb-6">
          <BookCheck className="w-8 h-8 text-white" />
        </div>
        <h1 className="text-2xl font-bold mb-2">Ready for your first lesson?</h1>
        <p className="text-slate-400 mb-6">
          Based on your answers, we've prepared a quick revision session to get you started on the right foot.
        </p>
        <Button asChild size="lg" className="w-full">
          <Link href={`/revision/session?subjects=${subjects}&grade=${grade}`}>
            Let's Start
            <ArrowRight className="w-5 h-5 ml-2" />
          </Link>
        </Button>
      </motion.div>
    </div>
  );
}

export default function RevisionStartPage() {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <RevisionStartContent />
        </Suspense>
    )
}
