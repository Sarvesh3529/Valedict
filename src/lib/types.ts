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

export type UserProfile = {
  uid: string;
  email: string | null;
  displayName: string | null; // This is the unique, user-chosen username
  realName?: string | null; // This is the user's actual name, e.g., from Google
  photoURL: string | null;
  currentStreak?: number;
  highestStreak?: number;
  lastActivityDate?: string;
  totalXp?: number;
  weeklyXp?: number;
  lastXpReset?: string;
  onboardingComplete?: boolean;
  achievements?: string[];
  lastPracticedChapterId?: string;
};
