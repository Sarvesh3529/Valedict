'use client';

import { useState } from 'react';
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
import { BookCopy } from 'lucide-react';

interface QuizSetupProps {
  onStart: (chapterIds: string[], count: number) => void;
}

export default function QuizSetup({ onStart }: QuizSetupProps) {
  const [selectedChapters, setSelectedChapters] = useState<string[]>([]);
  const [questionCount, setQuestionCount] = useState<string>('5');

  const handleChapterToggle = (chapterId: string) => {
    setSelectedChapters((prev) =>
      prev.includes(chapterId)
        ? prev.filter((id) => id !== chapterId)
        : [...prev, chapterId]
    );
  };

  const handleSelectAll = (subjectId: string) => {
    const subjectChapters = allSubjects.find(s => s.id === subjectId)?.chapters.map(c => c.id) || [];
    const allSelected = subjectChapters.every(id => selectedChapters.includes(id));
    if (allSelected) {
      setSelectedChapters(prev => prev.filter(id => !subjectChapters.includes(id)));
    } else {
      setSelectedChapters(prev => [...new Set([...prev, ...subjectChapters])]);
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedChapters.length === 0) {
      alert('Please select at least one chapter.');
      return;
    }
    onStart(selectedChapters, parseInt(questionCount, 10));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      <div>
        <h3 className="text-lg font-semibold mb-4">Select Chapters</h3>
        <div className="space-y-6">
          {allSubjects.map((subject) => (
            <Card key={subject.id} className="bg-muted/30">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-base font-medium">{subject.name}</CardTitle>
                <Button type="button" variant="link" size="sm" onClick={() => handleSelectAll(subject.id)}>Select All</Button>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {subject.chapters.map((chapter) => (
                    <div
                      key={chapter.id}
                      className="flex items-center space-x-2"
                    >
                      <Checkbox
                        id={chapter.id}
                        checked={selectedChapters.includes(chapter.id)}
                        onCheckedChange={() => handleChapterToggle(chapter.id)}
                      />
                      <Label
                        htmlFor={chapter.id}
                        className="text-sm font-normal cursor-pointer"
                      >
                        {chapter.name}
                      </Label>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      <div>
        <Label htmlFor="question-count" className="text-lg font-semibold">
          Number of Questions
        </Label>
        <Select value={questionCount} onValueChange={setQuestionCount}>
          <SelectTrigger id="question-count" className="w-full md:w-48 mt-2">
            <SelectValue placeholder="Select count" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="5">5 Questions</SelectItem>
            <SelectItem value="10">10 Questions</SelectItem>
            <SelectItem value="15">15 Questions</SelectItem>
            <SelectItem value="20">20 Questions</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="text-center">
        <Button type="submit" size="lg" className="bg-accent hover:bg-accent/90">
          <BookCopy className="mr-2 h-5 w-5" />
          Start Quiz
        </Button>
      </div>
    </form>
  );
}
