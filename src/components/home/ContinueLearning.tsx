'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { ArrowRight, BookOpen, ChevronsUpDown } from 'lucide-react';
import type { Chapter } from '@/lib/types';

interface ContinueLearningProps {
  chapter: Chapter | undefined;
}

export default function ContinueLearning({ chapter }: ContinueLearningProps) {
  const [isOpen, setIsOpen] = useState(false);

  if (!chapter) return null;

  return (
    <Collapsible open={isOpen} onOpenChange={setIsOpen} className="w-full">
        <CollapsibleTrigger asChild>
            <Button variant="ghost" className="w-full flex justify-between items-center p-4 h-auto border rounded-lg hover:bg-accent/5">
                <div className="flex items-center gap-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-accent/20">
                         <BookOpen className="h-7 w-7 text-accent"/>
                    </div>
                    <div>
                         <p className="text-sm text-accent font-semibold text-left">Continue Learning</p>
                         <h3 className="text-lg font-bold font-headline text-left">{chapter.name}</h3>
                    </div>
                </div>
                <ChevronsUpDown className="h-4 w-4 text-muted-foreground" />
                <span className="sr-only">Toggle</span>
            </Button>
        </CollapsibleTrigger>
        <CollapsibleContent>
             <div className="p-6 border border-t-0 rounded-b-lg">
                <p className="text-muted-foreground mb-4">You were last practicing this chapter. Jump back in to continue your progress!</p>
                <Button asChild className="w-full">
                    <Link href={`/quiz?chapter=${chapter.id}`}>
                        Jump Back In
                        <ArrowRight className="ml-2 h-5 w-5"/>
                    </Link>
                </Button>
            </div>
        </CollapsibleContent>
    </Collapsible>
  );
}
