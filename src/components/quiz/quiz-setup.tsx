'use client';

import { useState, useMemo, useEffect } from 'react';
import { subjects as allSubjects } from '@/lib/data';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Star, ArrowRight } from 'lucide-react';

interface QuizSetupProps {
  onStart: (
    chapterIds: string[],
    count: number,
    difficulty: 'all' | 'easy' | 'medium' | 'hard'
  ) => void;
  userGrade: string;
}

export default function QuizSetup({ onStart, userGrade }: QuizSetupProps) {
  const [selectedChapters, setSelectedChapters] = useState<string[]>([]);
  const [questionCount, setQuestionCount] = useState<string>('5');
  const [selectedDifficulty, setSelectedDifficulty] = useState<
    'all' | 'easy' | 'medium' | 'hard'
  >('all');

  // Reset chapter selection if the grade prop changes
  useEffect(() => {
    setSelectedChapters([]);
  }, [userGrade]);

  const filteredSubjects = useMemo(() => {
    return allSubjects
      .map((subject) => ({
        ...subject,
        chapters: subject.chapters.filter(
          (chapter) => chapter.grade === userGrade
        ),
      }))
      .filter((subject) => subject.chapters.length > 0);
  }, [userGrade]);

  const handleChapterToggle = (chapterId: string) => {
    setSelectedChapters((prev) =>
      prev.includes(chapterId)
        ? prev.filter((id) => id !== chapterId)
        : [...prev, chapterId]
    );
  };

  const handleSelectAll = (subjectId: string) => {
    const subjectChapters =
      filteredSubjects.find((s) => s.id === subjectId)?.chapters.map((c) => c.id) ||
      [];
    const allSelectedForThisSubject = subjectChapters.every((id) =>
      selectedChapters.includes(id)
    );

    if (allSelectedForThisSubject) {
      // Deselect all chapters of this subject
      setSelectedChapters((prev) =>
        prev.filter((id) => !subjectChapters.includes(id))
      );
    } else {
      // Select all chapters of this subject
      setSelectedChapters((prev) => [...new Set([...prev, ...subjectChapters])]);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedChapters.length === 0) {
      alert('Please select at least one chapter.');
      return;
    }
    onStart(
      selectedChapters,
      parseInt(questionCount, 10),
      selectedDifficulty
    );
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-10">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-secondary/20 p-6 rounded-3xl border-2 border-border">
          <Label className="text-sm font-black uppercase tracking-widest text-muted-foreground flex items-center gap-2 mb-3">
            Target Grade
          </Label>
          <p className="text-3xl font-black text-primary">
            Class {userGrade}
          </p>
        </div>
        
        <div className="bg-secondary/20 p-6 rounded-3xl border-2 border-border">
          <Label
            htmlFor="difficulty-select"
            className="text-sm font-black uppercase tracking-widest text-muted-foreground flex items-center gap-2 mb-3"
          >
            <Star className="w-4 h-4" /> Level
          </Label>
          <Select
            value={selectedDifficulty}
            onValueChange={(value) =>
              setSelectedDifficulty(value as any)
            }
          >
            <SelectTrigger id="difficulty-select" className="w-full h-12 bg-background font-bold text-lg rounded-2xl border-2">
              <SelectValue placeholder="Select difficulty" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Levels</SelectItem>
              <SelectItem value="easy">Easy</SelectItem>
              <SelectItem value="medium">Medium</SelectItem>
              <SelectItem value="hard">Hard</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Chapter Selection */}
      <div className="space-y-6">
        <h3 className="text-xl font-black uppercase tracking-widest text-muted-foreground">Select Chapters</h3>
        <div className="grid grid-cols-1 gap-6">
          {filteredSubjects.map((subject) => (
            <Card key={subject.id} className="border-2 border-border shadow-none rounded-3xl overflow-hidden">
              <CardHeader className="flex flex-row items-center justify-between pb-4 bg-secondary/10 border-b-2">
                <CardTitle className="text-lg font-black uppercase tracking-tight">
                  {subject.name}
                </CardTitle>
                <Button
                  type="button"
                  variant="link"
                  size="sm"
                  className="font-black text-xs uppercase"
                  onClick={() => handleSelectAll(subject.id)}
                >
                  Select All
                </Button>
              </CardHeader>
              <CardContent className="pt-6">
                {subject.chapters.length > 0 ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-4">
                    {subject.chapters.map((chapter) => (
                      <div
                        key={chapter.id}
                        className="flex items-center space-x-3 p-3 rounded-2xl border-2 border-transparent hover:border-primary/20 hover:bg-primary/5 transition-all group"
                      >
                        <Checkbox
                          id={chapter.id}
                          checked={selectedChapters.includes(chapter.id)}
                          className="w-6 h-6 rounded-lg border-2"
                          onCheckedChange={() => handleChapterToggle(chapter.id)}
                        />
                        <Label
                          htmlFor={chapter.id}
                          className="text-base font-bold leading-tight cursor-pointer group-hover:text-primary transition-colors flex-1"
                        >
                          {chapter.name}
                        </Label>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground italic">
                    No chapters available for this grade.
                  </p>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Question Count and Submit */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-6 pt-6 border-t-2">
        <div className="flex items-center gap-4 w-full sm:w-auto">
          <Label htmlFor="question-count" className="text-sm font-black uppercase tracking-widest text-muted-foreground whitespace-nowrap">
            Length
          </Label>
          <Select value={questionCount} onValueChange={setQuestionCount}>
            <SelectTrigger id="question-count" className="w-32 h-12 bg-background font-black text-lg rounded-2xl border-2">
              <SelectValue placeholder="Select" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="5">5</SelectItem>
              <SelectItem value="10">10</SelectItem>
              <SelectItem value="15">15</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <Button type="submit" size="lg" className="w-full sm:w-64 h-16 rounded-3xl text-lg font-black group shadow-[0_6px_0_0_#1b6ca8] hover:translate-y-[-2px] active:translate-y-[4px] active:shadow-none transition-all">
          NEXT STEP
          <ArrowRight className="ml-2 h-6 w-6 transition-transform group-hover:translate-x-1" />
        </Button>
      </div>
    </form>
  );
}
