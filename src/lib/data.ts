import type { Subject, Chapter, QuizQuestion } from './types';

export const chapters: Chapter[] = [
  { id: 'alg', name: 'Algebra', subjectId: 'math' },
  { id: 'geo', name: 'Geometry', subjectId: 'math' },
  { id: 'calc', name: 'Calculus', subjectId: 'math' },
  { id: 'mech', name: 'Mechanics', subjectId: 'phy' },
  { id: 'thermo', name: 'Thermodynamics', subjectId: 'phy' },
  { id: 'em', name: 'Electromagnetism', subjectId: 'phy' },
  { id: 'org', name: 'Organic Chemistry', subjectId: 'chem' },
  { id: 'inorg', name: 'Inorganic Chemistry', subjectId: 'chem' },
  { id: 'physchem', name: 'Physical Chemistry', subjectId: 'chem' },
  { id: 'cell', name: 'Cell Biology', subjectId: 'bio' },
  { id: 'gen', name: 'Genetics', subjectId: 'bio' },
  { id: 'eco', name: 'Ecology', subjectId: 'bio' },
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
  // Math
  {
    id: 1,
    chapterId: 'alg',
    question: 'What is the value of x in the equation 2x + 3 = 7?',
    options: ['1', '2', '3', '4'],
    correctAnswer: 1,
    explanation: 'Subtract 3 from both sides to get 2x = 4. Then divide by 2 to get x = 2.',
  },
  {
    id: 2,
    chapterId: 'alg',
    question: 'What is (x+y)^2 ?',
    options: ['x^2 + y^2', 'x^2 + 2xy + y^2', 'x^2 - 2xy + y^2', '2x + 2y'],
    correctAnswer: 1,
    explanation: 'The formula for the square of a binomial (a+b)^2 is a^2 + 2ab + b^2.',
  },
  {
    id: 3,
    chapterId: 'geo',
    question: 'What is the sum of angles in a triangle?',
    options: ['90 degrees', '180 degrees', '270 degrees', '360 degrees'],
    correctAnswer: 1,
    explanation: 'The sum of the interior angles of any triangle is always 180 degrees.',
  },
  // Physics
  {
    id: 4,
    chapterId: 'mech',
    question: "What is Newton's second law of motion?",
    options: ['F=ma', 'E=mc^2', 'v=u+at', 'P=V*I'],
    correctAnswer: 0,
    explanation: "Newton's second law states that the force on an object is equal to its mass times its acceleration (F=ma).",
  },
  {
    id: 5,
    chapterId: 'thermo',
    question: 'What is the first law of thermodynamics?',
    options: ['Energy cannot be created or destroyed', 'Entropy always increases', 'Absolute zero is unattainable', 'Heat flows from hot to cold'],
    correctAnswer: 0,
    explanation: 'The first law of thermodynamics is a version of the law of conservation of energy.',
  },
  // Chemistry
  {
    id: 6,
    chapterId: 'org',
    question: 'What is the main element in organic compounds?',
    options: ['Oxygen', 'Nitrogen', 'Carbon', 'Hydrogen'],
    correctAnswer: 2,
    explanation: 'Organic chemistry is the study of carbon-containing compounds.',
  },
  // Biology
  {
    id: 7,
    chapterId: 'cell',
    question: 'What is the powerhouse of the cell?',
    options: ['Nucleus', 'Ribosome', 'Mitochondrion', 'Chloroplast'],
    correctAnswer: 2,
    explanation: 'Mitochondria are responsible for generating most of the cell\'s supply of adenosine triphosphate (ATP), used as a source of chemical energy.',
  },
  {
    id: 8,
    chapterId: 'gen',
    question: 'Who is known as the father of genetics?',
    options: ['Charles Darwin', 'Gregor Mendel', 'James Watson', 'Francis Crick'],
    correctAnswer: 1,
    explanation: 'Gregor Mendel, through his work on pea plants, discovered the fundamental laws of inheritance.'
  },
  {
    id: 9,
    chapterId: 'calc',
    question: 'What is the derivative of x^2?',
    options: ['x', '2x', 'x^2/2', '2'],
    correctAnswer: 1,
    explanation: 'Using the power rule, the derivative of x^n is n*x^(n-1). So for x^2, it is 2*x^(2-1) = 2x.'
  },
  {
    id: 10,
    chapterId: 'em',
    question: "Ohm's law is stated as:",
    options: ['V = IR', 'P = VI', 'F = qE', 'B = μI / 2πr'],
    correctAnswer: 0,
    explanation: "Ohm's law states that the voltage (V) across a conductor is directly proportional to the current (I) flowing through it, with the constant of proportionality being the resistance (R)."
  },
  {
    id: 11,
    chapterId: 'inorg',
    question: 'What is the chemical formula for water?',
    options: ['CO2', 'O2', 'H2O2', 'H2O'],
    correctAnswer: 3,
    explanation: 'A molecule of water is composed of two hydrogen atoms and one oxygen atom.'
  },
  {
    id: 12,
    chapterId: 'eco',
    question: 'Which process do plants use to make their own food?',
    options: ['Respiration', 'Transpiration', 'Photosynthesis', 'Decomposition'],
    correctAnswer: 2,
    explanation: 'Photosynthesis is the process used by plants, algae and certain bacteria to harness energy from sunlight into chemical energy.'
  }
];
