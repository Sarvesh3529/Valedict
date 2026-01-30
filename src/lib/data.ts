import type { Subject, Chapter, QuizQuestion } from './types';
import { grade9MathQuestions } from './quiz-questions/grade-9/math';

// Grade 9 Chapters
export const chapters: Chapter[] = [
  // Mathematics
  { id: 'g9-math-numsys', name: 'Number Systems', subjectId: 'math' },
  { id: 'g9-math-poly', name: 'Polynomials', subjectId: 'math' },
  { id: 'g9-math-coord', name: 'Coordinate Geometry', subjectId: 'math' },
  { id: 'g9-math-lineq', name: 'Linear Equations in Two Variables', subjectId: 'math' },
  { id: 'g9-math-euclid', name: 'Introduction to Euclid’s Geometry', subjectId: 'math' },
  { id: 'g9-math-linesangles', name: 'Lines and Angles', subjectId: 'math' },
  { id: 'g9-math-tri', name: 'Triangles', subjectId: 'math' },
  { id: 'g9-math-quad', name: 'Quadrilaterals', subjectId: 'math' },
  { id: 'g9-math-circles', name: 'Circles', subjectId: 'math' },
  { id: 'g9-math-heron', name: 'Heron’s Formula', subjectId: 'math' },
  { id: 'g9-math-surface', name: 'Surface Areas and Volumes', subjectId: 'math' },
  { id: 'g9-math-stats', name: 'Statistics', subjectId: 'math' },

  // Physics
  { id: 'g9-phy-motion', name: 'Motion', subjectId: 'phy' },
  { id: 'g9-phy-force', name: 'Force and Laws of Motion', subjectId: 'phy' },
  { id: 'g9-phy-grav', name: 'Gravitation', subjectId: 'phy' },
  { id: 'g9-phy-work', name: 'Work and Energy', subjectId: 'phy' },
  { id: 'g9-phy-sound', name: 'Sound', subjectId: 'phy' },

  // Chemistry
  { id: 'g9-chem-matter', name: 'Matter in Our Surroundings', subjectId: 'chem' },
  { id: 'g9-chem-pure', name: 'Is Matter Around Us Pure?', subjectId: 'chem' },
  { id: 'g9-chem-atoms', name: 'Atoms and Molecules', subjectId: 'chem' },
  { id: 'g9-chem-structure', name: 'Structure of the Atom', subjectId: 'chem' },

  // Biology
  { id: 'g9-bio-cell', name: 'The Fundamental Unit of Life (Cell)', subjectId: 'bio' },
  { id: 'g9-bio-tissues', name: 'Tissues', subjectId: 'bio' },
  { id: 'g9-bio-food', name: 'Improvement in Food Resources', subjectId: 'bio' },
];

const baseSubjects: Omit<Subject, 'chapters'>[] = [
  { id: 'math', name: 'Mathematics', iconName: 'Calculator' },
  { id: 'phy', name: 'Physics', iconName: 'Zap' },
  { id: 'chem', name: 'Chemistry', iconName: 'FlaskConical' },
  { id: 'bio', name: 'Biology', iconName: 'Leaf' },
];

export const subjects: Subject[] = baseSubjects.map((subject) => ({
  ...subject,
  chapters: chapters.filter((c) => c.subjectId === subject.id),
}));

export const quizQuestions: QuizQuestion[] = [
    ...grade9MathQuestions,
    // When you provide questions for other subjects, they will be imported and added here.
];
