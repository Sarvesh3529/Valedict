import { quizQuestions } from './data';
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
  count: number
): QuizQuestion[] {
  // Filter questions by selected chapters
  const availableQuestions = quizQuestions.filter((q) =>
    chapterIds.includes(q.chapterId)
  );

  // Shuffle the available questions
  const shuffledQuestions = shuffleArray(availableQuestions);

  // Return the requested number of questions
  return shuffledQuestions.slice(0, count);
}
