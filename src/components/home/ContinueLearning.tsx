'use client';

import Link from 'next/link';
import { Card } from '@/components/ui/card';
import { Play } from 'lucide-react';
import type { Chapter } from '@/lib/types';

interface ContinueLearningProps {
  chapter: Chapter | undefined;
}

export default function ContinueLearning({ chapter }: ContinueLearningProps) {
  if (!chapter) return null;

  return (
    <Link href={`/quiz?chapter=${chapter.id}`} className="group h-full block">
      <Card className="h-full bg-accent text-accent-foreground border-b-8 border-black/20 hover:border-b-4 hover:translate-y-[4px] active:border-b-0 active:translate-y-[8px] transition-all p-8 rounded-[2rem] flex flex-col items-center justify-center text-center gap-4">
        <div className="h-16 w-16 bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur-md shadow-lg">
          <Play className="h-8 w-8 fill-current text-white" />
        </div>
        <div className="space-y-1">
          <h3 className="text-xs font-black uppercase tracking-widest text-white/70">Continue Progress</h3>
          <p className="text-lg md:text-xl font-black leading-tight line-clamp-2 uppercase">
            {chapter.name}
          </p>
        </div>
      </Card>
    </Link>
  );
}
