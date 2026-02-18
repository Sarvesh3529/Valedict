'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { ArrowRight, Play } from 'lucide-react';
import type { Chapter } from '@/lib/types';

interface ContinueLearningProps {
  chapter: Chapter | undefined;
}

export default function ContinueLearning({ chapter }: ContinueLearningProps) {
  if (!chapter) return null;

  return (
    <Card className="w-full bg-primary/10 border-2 border-primary/20 overflow-hidden relative">
      <CardContent className="p-4 sm:p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-4 text-center sm:text-left">
          <div className="flex-shrink-0 flex h-14 w-14 items-center justify-center rounded-2xl bg-primary text-primary-foreground shadow-[0_4px_0_0_#1b6ca8]">
            <Play className="h-6 w-6 fill-current" />
          </div>
          <div>
            <h3 className="text-xs font-bold uppercase tracking-widest text-primary mb-1">Current Chapter</h3>
            <p className="text-lg font-bold leading-tight line-clamp-1">{chapter.name}</p>
          </div>
        </div>
        <Button asChild variant="default" size="lg" className="w-full sm:w-auto">
          <Link href={`/quiz?chapter=${chapter.id}`}>
            Jump Back In
            <ArrowRight className="ml-2 h-5 w-5" />
          </Link>
        </Button>
      </CardContent>
    </Card>
  );
}
