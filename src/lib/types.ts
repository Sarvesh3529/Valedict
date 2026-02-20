
export type UserProfile = {
  uid: string;
  username: string;
  totalxp: number;
  weeklyxp: number;
  streak: number;
  highestStreak: number;
  joinedat: any; // Firestore Timestamp
  lastactive: any; // Firestore Timestamp
  onboardingComplete: boolean;
  lastPracticedChapterId?: string;
  friends?: string[];

  // Onboarding data
  grade?: string;
  board?: string;
  troublingSubjects?: string[];
  studyTime?: string;
  studySchedule?: string[];
  biggestProblems?: string[];
  nextExamDate?: string;
};

export type FriendRequest = {
  id: string;
  senderId: string;
  receiverId: string;
  senderName: string;
  status: 'pending' | 'accepted' | 'declined';
  createdAt: any;
};

export type Subject = {
  id: string;
  name: string;
  iconName: string; 
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
