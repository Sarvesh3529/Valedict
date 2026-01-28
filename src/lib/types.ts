export type Subject = {
  id: string;
  name: string;
  iconName: string; // Name of a lucide-react icon
  chapters: Chapter[];
};

export type Chapter = {
  id: string;
  name: string;
  subjectId: string;
};

export type QuizQuestion = {
  id: number;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
  chapterId: string;
};

export type QuizResult = {
  question: QuizQuestion;
  userAnswer: number | null;
  isCorrect: boolean;
};

export type RevisionItem = {
  id: string;
  subjectId: 'math' | 'phy' | 'chem' | 'bio';
  chapterId: string;
  grade: string;
  type: 'formula' | 'concept' | 'term';
  topic: string;
  content: string;
  question: string;
  options: string[];
  correctAnswer: number;
};
