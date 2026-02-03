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
  displayName: string | null;
  photoURL: string | null;
  usernameIsSet?: boolean;
  currentStreak?: number;
  highestStreak?: number;
  lastActivityDate?: string;
  totalXp?: number;
  weeklyXp?: number;
  lastXpReset?: string;
};
