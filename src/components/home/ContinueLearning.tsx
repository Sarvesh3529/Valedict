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
            <Button variant="ghost" className="w-full flex justify-between items-center p-3 sm:p-4 border rounded-lg hover:bg-accent/5 data-[state=open]:rounded-b-none">
                <div className="flex items-center gap-3 sm:gap-4 overflow-hidden">
                    <div className="flex-shrink-0 flex h-10 w-10 sm:h-12 sm:w-12 items-center justify-center rounded-lg bg-accent/20">
                         <BookOpen className="h-6 w-6 sm:h-7 sm:w-7 text-accent"/>
                    </div>
                    <div className="text-left overflow-hidden">
                         <h3 className="text-sm sm:text-lg font-bold font-headline truncate">Continue Learning</h3>
                    </div>
                </div>
                <ChevronsUpDown className="h-4 w-4 text-muted-foreground ml-1 flex-shrink-0" />
                <span className="sr-only">Toggle</span>
            </Button>
        </CollapsibleTrigger>
        <CollapsibleContent>
             <div className="p-6 border border-t-0 rounded-b-lg space-y-4">
                <p className="font-semibold text-center text-foreground">{chapter.name}</p>
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
