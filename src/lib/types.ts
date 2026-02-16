export type UserProfile = {
  uid: string;
  username: string;
  totalxp: number;
  weeklyxp: number;
  streak: number;
  joinedat: any; // Firestore Timestamp
  lastactive: any; // Firestore Timestamp
  onboardingComplete: boolean;
  lastPracticedChapterId?: string;

  // Onboarding data
  grade?: string;
  board?: string;
  troublingSubjects?: string[];
  studyTime?: string;
  studySchedule?: string[];
  biggestProblems?: string[];
  nextExamDate?: string;
};

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
  grade: string;
};

export type QuizQuestion = {
  id: number;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
  chapterId: string;
  difficulty?: 'easy' | 'medium' | 'hard';
};

export type QuizResult = {
  question: QuizQuestion;
  userAnswer: number | null;
  isCorrect: boolean;
};
