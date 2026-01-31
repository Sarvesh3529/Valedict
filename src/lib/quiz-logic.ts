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
  count: number,
  grade: string,
  difficulty: 'all' | 'easy' | 'medium' | 'hard'
): QuizQuestion[] {
  // Filter questions by selected chapters
  let availableQuestions = quizQuestions.filter((q) =>
    chapterIds.includes(q.chapterId)
  );

  // If grade is 10 and a specific difficulty is selected, filter further
  if (grade === '10' && difficulty !== 'all') {
    availableQuestions = availableQuestions.filter(q => q.difficulty === difficulty);
  }

  // Shuffle the available questions
  const shuffledQuestions = shuffleArray(availableQuestions);

  // Return the requested number of questions
  return shuffledQuestions.slice(0, count);
}
