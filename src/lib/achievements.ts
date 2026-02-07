import { Award, Star, Flame, Target, BookOpenCheck } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

export type Achievement = {
  id: string;
  name: string;
  description: string;
  icon: LucideIcon;
};

export const achievementsList: Achievement[] = [
  { id: 'first-quiz', name: 'First Steps', description: 'Complete your first quiz.', icon: Star },
  { id: 'streak-7', name: 'Week-Long Warrior', description: 'Maintain a 7-day study streak.', icon: Flame },
  { id: 'streak-30', name: 'Month of Mastery', description: 'Maintain a 30-day study streak.', icon: Flame },
  { id: 'xp-1000', name: 'XP Collector', description: 'Earn 1,000 total XP.', icon: Award },
  { id: 'xp-10000', name: 'XP Grandmaster', description: 'Earn 10,000 total XP.', icon: Award },
  { id: 'perfect-quiz', name: 'Perfectionist', description: 'Score 100% on a quiz with 10+ questions.', icon: Target },
  { id: 'first-subject', name: 'Subject Specialist', description: 'Master a subject by scoring >80% in all its chapters.', icon: BookOpenCheck },
];

export const achievementsMap: Record<string, Achievement> = 
  achievementsList.reduce((acc, achievement) => {
    acc[achievement.id] = achievement;
    return acc;
  }, {} as Record<string, Achievement>);
