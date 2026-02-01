import { quizQuestions, chapters } from './data';
import type { QuizQuestion } from './types';

// Function to shuffle an array
function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

export function generateQuiz(
  chapterIds: string[],
  count: number,
  grade: string,
  difficulty: 'all' | 'easy' | 'medium' | 'hard'
): QuizQuestion[] {
  // 1. Get primary questions from selected chapters
  let primaryQuestions = quizQuestions.filter((q) =>
    chapterIds.includes(q.chapterId)
  );

  if (grade === '10' && difficulty !== 'all') {
    primaryQuestions = primaryQuestions.filter(q => q.difficulty === difficulty);
  }
  
  // Shuffle primary questions before potentially adding more
  primaryQuestions = shuffleArray(primaryQuestions);

  // If we have enough questions, we're done.
  if (primaryQuestions.length >= count) {
    return primaryQuestions.slice(0, count);
  }

  // 2. If not enough, find more questions from the same subject
  const needed = count - primaryQuestions.length;
  
  // Determine the subject from the first selected chapter
  const firstChapter = chapters.find(c => c.id === chapterIds[0]);
  if (!firstChapter) {
    // Should not happen, but as a fallback, return what we have
    return primaryQuestions;
  }
  const subjectId = firstChapter.subjectId;

  // Find all other chapters in the same subject and grade
  const allChapterIdsInSubject = chapters
    .filter(c => c.subjectId === subjectId && c.grade === grade)
    .map(c => c.id);

  // Get all questions from that subject, excluding the ones we already have
  const existingQuestionIds = new Set(primaryQuestions.map(q => q.id));
  let extraQuestions = quizQuestions.filter(q => 
    !existingQuestionIds.has(q.id) && allChapterIdsInSubject.includes(q.chapterId)
  );
  
  if (grade === '10' && difficulty !== 'all') {
    extraQuestions = extraQuestions.filter(q => q.difficulty === difficulty);
  }
  
  // Shuffle and take the needed amount
  const shuffledExtra = shuffleArray(extraQuestions).slice(0, needed);

  // 3. Combine and return
  const finalQuestions = shuffleArray([...primaryQuestions, ...shuffledExtra]);

  return finalQuestions;
}
