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
        // Get all questions for this subject's first chapter
        const allQuestionsForChapter = revisionContent.filter(item => 
            item.subjectId === subjectId &&
            item.chapterId === firstChapterId
        );

        // Prefer questions for the correct grade
        const gradeSpecificQuestions = allQuestionsForChapter.filter(item => item.grade === grade);
        const otherGradeQuestions = allQuestionsForChapter.filter(item => item.grade !== grade);

        // Combine them, with grade-specific ones first
        const prioritizedQuestions = [...shuffleArray(gradeSpecificQuestions), ...shuffleArray(otherGradeQuestions)];
        
        // Take the required number of questions for this subject
        const selectedQuestions = prioritizedQuestions.slice(0, countForThisSubject);
        revisionSet.push(...selectedQuestions);
    }
  }

  // Ensure we don't have duplicate questions if fallbacks overlapped.
  const uniqueQuestions = Array.from(new Map(revisionSet.map(q => [q.id, q])).values());

  // Final shuffle of the whole set and ensure it's exactly totalCount
  return shuffleArray(uniqueQuestions).slice(0, totalCount);
}
