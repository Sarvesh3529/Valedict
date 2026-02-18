'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Loader2, Youtube, Globe, ArrowRight, PlayCircle, BookOpen } from 'lucide-react';
import { suggestCourses, type CourseSuggestionOutput } from '@/ai/flows/course-suggester';
import { motion, AnimatePresence } from 'framer-motion';

interface CourseSuggestionProps {
  chapterNames: string[];
  grade: string;
  onContinue: () => void;
  onCancel: () => void;
}

export default function CourseSuggestion({ chapterNames, grade, onContinue, onCancel }: CourseSuggestionProps) {
  const [loading, setLoading] = useState(false);
  const [suggestions, setSuggestions] = useState<CourseSuggestionOutput['suggestions'] | null>(null);
  const [view, setView] = useState<'initial' | 'results'>('initial');

  const handleGetSuggestions = async () => {
    setLoading(true);
    try {
      const result = await suggestCourses({ chapterNames, grade });
      setSuggestions(result.suggestions);
      setView('results');
    } catch (error) {
      console.error("Error fetching suggestions:", error);
      // Fallback: just go to quiz if AI fails
      onContinue();
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center space-y-8 py-4">
      <AnimatePresence mode="wait">
        {view === 'initial' ? (
          <motion.div
            key="initial"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="text-center space-y-6 max-w-md"
          >
            <div className="bg-primary/10 p-6 rounded-full w-24 h-24 flex items-center justify-center mx-auto border-4 border-primary/20">
              <BookOpen className="w-12 h-12 text-primary" />
            </div>
            <div className="space-y-2">
              <h2 className="text-3xl font-black tracking-tight">Wait! Feeling Ready?</h2>
              <p className="text-muted-foreground font-medium">
                Would you like to take a short revision course on these topics before you start the quiz?
              </p>
            </div>
            
            <div className="flex flex-col gap-3">
              <Button 
                onClick={handleGetSuggestions} 
                size="lg" 
                className="w-full h-16 text-lg"
                disabled={loading}
              >
                {loading ? <Loader2 className="animate-spin mr-2" /> : <PlayCircle className="mr-2 h-6 w-6" />}
                YES, SUGGEST COURSES
              </Button>
              <Button 
                onClick={onContinue} 
                variant="outline" 
                size="lg" 
                className="w-full h-14"
                disabled={loading}
              >
                NO, START THE QUIZ
              </Button>
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="results"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="w-full space-y-6"
          >
            <div className="text-center">
              <h2 className="text-2xl font-black">Top Picked For You</h2>
              <p className="text-muted-foreground">Free resources to boost your score!</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {suggestions?.map((item, index) => (
                <Card key={index} className="border-2 border-border hover:border-primary/40 transition-colors group">
                  <CardContent className="p-5 flex flex-col h-full">
                    <div className="flex items-start justify-between mb-3">
                      <div className="bg-secondary p-2 rounded-xl">
                        {item.platform === 'YouTube' ? (
                          <Youtube className="w-6 h-6 text-red-500" />
                        ) : (
                          <Globe className="w-6 h-6 text-blue-500" />
                        )}
                      </div>
                      <span className="text-[10px] font-black uppercase tracking-widest bg-secondary px-2 py-1 rounded-md">
                        {item.platform}
                      </span>
                    </div>
                    <h3 className="font-bold text-lg mb-2 line-clamp-2">{item.title}</h3>
                    <p className="text-sm text-muted-foreground mb-4 flex-1">{item.description}</p>
                    <Button asChild variant="secondary" className="w-full group-hover:bg-primary group-hover:text-primary-foreground transition-all">
                      <a href={item.url} target="_blank" rel="noopener noreferrer">
                        Visit Course <ArrowRight className="ml-2 h-4 w-4" />
                      </a>
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>

            <div className="pt-6 border-t flex justify-center">
              <Button onClick={onContinue} size="lg" className="px-12 h-16 text-lg">
                READY TO START QUIZ
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
