import { revisionContent } from './revision-data';
import { subjects } from './data';
import type { RevisionItem } from './types';

// Function to shuffle an array
function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

export function generateRevisionSet(
  subjectIds: string[],
  grade: string,
  totalCount: number
): RevisionItem[] {
  if (subjectIds.length === 0) return [];

  const questionsPerSubject = Math.floor(totalCount / subjectIds.length);
  let remainder = totalCount % subjectIds.length;
  
  let revisionSet: RevisionItem[] = [];

  for (const subjectId of subjectIds) {
    const countForThisSubject = questionsPerSubject + (remainder > 0 ? 1 : 0);
    if (remainder > 0) {
      remainder--;
    }

    const subject = subjects.find(s => s.id === subjectId);
    const firstChapterId = subject?.chapters[0]?.id;

    if (firstChapterId) {
        const subjectQuestions = revisionContent.filter(item => 
            item.subjectId === subjectId &&
            item.grade === grade &&
            item.chapterId === firstChapterId
        );
        
        const shuffledQuestions = shuffleArray(subjectQuestions);
        revisionSet.push(...shuffledQuestions.slice(0, countForThisSubject));
    }
  }

  return shuffleArray(revisionSet); // Shuffle the final set
}
