import { quizQuestions, chapters } from './data';
import type { QuizQuestion } from './types';

// Function to shuffle an array (Fisher-Yates shuffle)
function shuffleArray<T>(array: T[]): T[] {
  // Create a copy to avoid modifying the original array
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    // Pick a random index from 0 to i
    const j = Math.floor(Math.random() * (i + 1));
    // Swap elements
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
  // 1. Get a pool of available questions based on selected chapters and difficulty
  let availableQuestions = quizQuestions.filter((q) =>
    chapterIds.includes(q.chapterId)
  );

  if (grade === '10' && difficulty !== 'all') {
    availableQuestions = availableQuestions.filter(q => q.difficulty === difficulty);
  }
  
  // 2. If the initial pool is too small, expand it to the entire subject
  if (availableQuestions.length < count) {
    // Determine the subject from the first selected chapter
    const firstChapter = chapters.find(c => c.id === chapterIds[0]);
    
    if (firstChapter) {
      const subjectId = firstChapter.subjectId;

      // Find all chapter IDs in the same subject and grade
      const allChapterIdsInSubject = chapters
        .filter(c => c.subjectId === subjectId && c.grade === grade)
        .map(c => c.id);

      // Get all questions from that subject, respecting the difficulty filter
      let allQuestionsInSubject = quizQuestions.filter(q => 
        allChapterIdsInSubject.includes(q.chapterId)
      );
      
      if (grade === '10' && difficulty !== 'all') {
        allQuestionsInSubject = allQuestionsInSubject.filter(q => q.difficulty === difficulty);
      }
      
      // Use this larger pool of questions
      availableQuestions = allQuestionsInSubject;
    }
  }

  // 3. Shuffle the final pool of questions
  const shuffledQuestions = shuffleArray(availableQuestions);

  // 4. Return the requested number of questions from the shuffled list
  return shuffledQuestions.slice(0, count);
}
