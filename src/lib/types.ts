
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
  fromUid: string;
  fromUsername: string;
  toUid: string;
  status: 'pending' | 'accepted' | 'rejected';
  createdAt: any;
};

export type Notification = {
  id: string;
  type: 'friend_request';
  fromUid: string;
  fromUsername: string;
  status: 'unread' | 'read';
  createdAt: any;
  relatedId: string;
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
