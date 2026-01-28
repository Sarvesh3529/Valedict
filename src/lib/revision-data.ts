import type { RevisionItem } from './types';

export const revisionContent: RevisionItem[] = [
  // Grade 9
  {
    id: 'math-9-1',
    subjectId: 'math',
    chapterId: 'alg',
    grade: '9',
    type: 'formula',
    topic: 'Square of a Binomial',
    content: '(a + b)² = a² + 2ab + b²',
    question: 'What is the expansion of (x + 3)²?',
    options: ['x² + 9', 'x² + 6x + 9', 'x² + 3x + 9', 'x + 6'],
    correctAnswer: 1,
  },
  // Grade 10
  {
    id: 'chem-10-1',
    subjectId: 'chem',
    chapterId: 'org',
    grade: '10',
    type: 'concept',
    topic: 'Hydrocarbons',
    content: 'Hydrocarbons are organic compounds consisting entirely of hydrogen and carbon atoms. Alkanes are the simplest type.',
    question: 'Which of the following is an alkane?',
    options: ['C₂H₄ (Ethene)', 'C₂H₂ (Ethyne)', 'C₂H₆ (Ethane)', 'C₆H₆ (Benzene)'],
    correctAnswer: 2,
  },
  // Grade 11
  {
    id: 'phy-11-1',
    subjectId: 'phy',
    chapterId: 'mech',
    grade: '11',
    type: 'formula',
    topic: "Newton's First Law (Inertia)",
    content: 'An object at rest stays at rest and an object in motion stays in motion with the same speed and in the same direction unless acted upon by an unbalanced force.',
    question: 'A book is sitting on a dashboard of a car that is stopped. When the car starts to move forward, the book slides off the dashboard. Which law explains this?',
    options: ["Newton's First Law", "Newton's Second Law", "Newton's Third Law", "Law of Gravitation"],
    correctAnswer: 0,
  },
  // Grade 12
  {
    id: 'bio-12-1',
    subjectId: 'bio',
    chapterId: 'cell',
    grade: '12',
    type: 'term',
    topic: 'Mitochondria',
    content: 'Often called the "powerhouses" of the cell, mitochondria are organelles that generate most of the cell\'s supply of adenosine triphosphate (ATP), used as a source of chemical energy.',
    question: 'What is the primary function of mitochondria?',
    options: ['Store genetic material', 'Synthesize proteins', 'Generate energy (ATP)', 'Control cell division'],
    correctAnswer: 2,
  },
];
