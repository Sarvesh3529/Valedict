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
            <Button variant="outline" className="w-full flex justify-between items-center p-3 sm:p-4 rounded-lg hover:bg-accent/5 data-[state=open]:rounded-b-none min-h-[64px]">
                <div className="flex items-center gap-3 sm:gap-4 overflow-hidden">
                    <div className="flex-shrink-0 flex h-10 w-10 items-center justify-center rounded-lg bg-accent/20">
                         <BookOpen className="h-5 w-5 text-accent"/>
                    </div>
                    <div className="text-left overflow-hidden">
                         <h3 className="text-sm sm:text-base font-bold font-headline truncate">
                            {isOpen ? 'Continue Learning' : 'Continue Learning'}
                         </h3>
                    </div>
                </div>
                <ChevronsUpDown className="h-4 w-4 text-muted-foreground ml-1 flex-shrink-0" />
                <span className="sr-only">Toggle</span>
            </Button>
        </CollapsibleTrigger>
        <CollapsibleContent className="transition-all duration-300 ease-in-out overflow-hidden data-[state=closed]:animate-collapsible-up data-[state=open]:animate-collapsible-down">
             <div className="p-4 sm:p-6 border border-t-0 rounded-b-lg space-y-4 bg-card/50">
                <p className="font-semibold text-center text-foreground text-sm sm:text-base">{chapter.name}</p>
                <Button asChild className="w-full" size="sm">
                    <Link href={`/quiz?chapter=${chapter.id}`}>
                        Jump Back In
                        <ArrowRight className="ml-2 h-4 w-4"/>
                    </Link>
                </Button>
            </div>
        </CollapsibleContent>
    </Collapsible>
  );
}
