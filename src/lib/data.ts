import type { Subject, Chapter, QuizQuestion } from './types';

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
  // Math
  {
    id: 1,
    chapterId: 'g9-math-lineq',
    question: 'What is the value of x in the equation 2x + 3 = 7?',
    options: ['1', '2', '3', '4'],
    correctAnswer: 1,
    explanation: 'Subtract 3 from both sides to get 2x = 4. Then divide by 2 to get x = 2.',
  },
  {
    id: 2,
    chapterId: 'g9-math-poly',
    question: 'What is (x+y)^2 ?',
    options: ['x^2 + y^2', 'x^2 + 2xy + y^2', 'x^2 - 2xy + y^2', '2x + 2y'],
    correctAnswer: 1,
    explanation: 'The formula for the square of a binomial (a+b)^2 is a^2 + 2ab + b^2.',
  },
  {
    id: 3,
    chapterId: 'g9-math-tri',
    question: 'What is the sum of angles in a triangle?',
    options: ['90 degrees', '180 degrees', '270 degrees', '360 degrees'],
    correctAnswer: 1,
    explanation: 'The sum of the interior angles of any triangle is always 180 degrees.',
  },
  {
    id: 13,
    chapterId: 'g9-math-surface',
    question: 'What is the formula for the volume of a sphere?',
    options: ['4/3 * pi * r^3', 'pi * r^2 * h', '2 * pi * r', 'pi * r^2'],
    correctAnswer: 0,
    explanation: 'The volume of a sphere with radius r is given by the formula V = (4/3)πr³.',
  },
  {
    id: 19,
    chapterId: 'g9-math-numsys',
    question: 'Which of the following is an irrational number?',
    options: ['√4', '√9', '√2', '0.333...'],
    correctAnswer: 2,
    explanation: '√2 cannot be expressed as a simple fraction, making it an irrational number. √4=2 and √9=3 are integers, and 0.333... is a repeating decimal (1/3).',
  },
  {
    id: 20,
    chapterId: 'g9-math-coord',
    question: 'What are the coordinates of the origin in a Cartesian plane?',
    options: ['(1, 1)', '(0, 0)', '(1, 0)', '(0, 1)'],
    correctAnswer: 1,
    explanation: 'The origin is the point where the x-axis and y-axis intersect, which is at the coordinates (0, 0).',
  },
  {
    id: 21,
    chapterId: 'g9-math-euclid',
    question: 'According to Euclid\'s postulates, all right angles are equal to one another. True or False?',
    options: ['True', 'False'],
    correctAnswer: 0,
    explanation: 'This is one of Euclid\'s five postulates, a fundamental assumption in Euclidean geometry.',
  },
  {
    id: 22,
    chapterId: 'g9-math-linesangles',
    question: 'If two lines intersect, the vertically opposite angles are:',
    options: ['Complementary', 'Supplementary', 'Equal', 'Unequal'],
    correctAnswer: 2,
    explanation: 'When two lines intersect, the angles opposite each other are always equal.',
  },
  {
    id: 23,
    chapterId: 'g9-math-quad',
    question: 'What is the sum of the interior angles of a quadrilateral?',
    options: ['180°', '270°', '360°', '540°'],
    correctAnswer: 2,
    explanation: 'A quadrilateral can be divided into two triangles, and since each triangle has an angle sum of 180°, the total for the quadrilateral is 2 * 180° = 360°.',
  },
  {
    id: 24,
    chapterId: 'g9-math-circles',
    question: 'The longest chord in a circle is called the:',
    options: ['Radius', 'Tangent', 'Secant', 'Diameter'],
    correctAnswer: 3,
    explanation: 'The diameter is a chord that passes through the center of the circle, making it the longest possible chord.',
  },
  {
    id: 25,
    chapterId: 'g9-math-heron',
    question: 'Heron\'s formula is used to calculate the area of a:',
    options: ['Circle', 'Square', 'Triangle', 'Rectangle'],
    correctAnswer: 2,
    explanation: 'Heron\'s formula calculates the area of a triangle when the lengths of all three sides are known.',
  },
  {
    id: 26,
    chapterId: 'g9-math-stats',
    question: 'What is the mode of the following data set: 2, 3, 5, 3, 7, 3, 8?',
    options: ['5', '3', '7', '8'],
    correctAnswer: 1,
    explanation: 'The mode is the number that appears most frequently in a data set. In this case, 3 appears three times.',
  },
  // Physics
  {
    id: 4,
    chapterId: 'g9-phy-force',
    question: "What is Newton's second law of motion?",
    options: ['F=ma', 'E=mc^2', 'v=u+at', 'P=V*I'],
    correctAnswer: 0,
    explanation: "Newton's second law states that the force on an object is equal to its mass times its acceleration (F=ma).",
  },
  {
    id: 14,
    chapterId: 'g9-phy-grav',
    question: 'The value of acceleration due to gravity (g) is highest at:',
    options: ['The equator', 'The poles', 'The center of the Earth', 'It is constant everywhere'],
    correctAnswer: 1,
    explanation: 'The Earth is not a perfect sphere; it is slightly flattened at the poles. Since g is inversely proportional to the square of the distance from the center, it is highest at the poles.',
  },
  {
    id: 15,
    chapterId: 'g9-phy-motion',
    question: 'Which of the following is a vector quantity?',
    options: ['Speed', 'Distance', 'Mass', 'Velocity'],
    correctAnswer: 3,
    explanation: 'Velocity has both magnitude and direction, making it a vector quantity. Speed, distance, and mass are scalar quantities.',
  },
  {
    id: 27,
    chapterId: 'g9-phy-work',
    question: 'The unit of work is:',
    options: ['Watt', 'Newton', 'Joule', 'Pascal'],
    correctAnswer: 2,
    explanation: 'The SI unit of work and energy is the Joule (J).',
  },
  {
    id: 28,
    chapterId: 'g9-phy-sound',
    question: 'Sound waves cannot travel through:',
    options: ['Solid', 'Liquid', 'Gas', 'Vacuum'],
    correctAnswer: 3,
    explanation: 'Sound is a mechanical wave, which means it requires a medium (particles) to propagate. A vacuum is empty of matter.',
  },
  // Chemistry
  {
    id: 11,
    chapterId: 'g9-chem-atoms',
    question: 'What is the chemical formula for water?',
    options: ['CO2', 'O2', 'H2O2', 'H2O'],
    correctAnswer: 3,
    explanation: 'A molecule of water is composed of two hydrogen atoms and one oxygen atom.',
  },
  {
    id: 16,
    chapterId: 'g9-chem-structure',
    question: 'Which subatomic particle has a negative charge?',
    options: ['Proton', 'Neutron', 'Electron', 'Photon'],
    correctAnswer: 2,
    explanation: 'Electrons are negatively charged particles that orbit the nucleus of an atom.',
  },
  {
    id: 17,
    chapterId: 'g9-chem-pure',
    question: 'Which of the following is a mixture?',
    options: ['Salt', 'Water', 'Air', 'Sugar'],
    correctAnswer: 2,
    explanation: 'Air is a mixture of various gases like nitrogen, oxygen, argon, and carbon dioxide. Salt, water, and sugar are pure substances (compounds).',
  },
  {
    id: 29,
    chapterId: 'g9-chem-matter',
    question: 'The process of a solid turning directly into a gas is called:',
    options: ['Evaporation', 'Condensation', 'Sublimation', 'Melting'],
    correctAnswer: 2,
    explanation: 'Sublimation is the phase transition of a substance directly from the solid to the gas state, without passing through the liquid state.',
  },
  // Biology
  {
    id: 7,
    chapterId: 'g9-bio-cell',
    question: 'What is the powerhouse of the cell?',
    options: ['Nucleus', 'Ribosome', 'Mitochondrion', 'Chloroplast'],
    correctAnswer: 2,
    explanation: 'Mitochondria are responsible for generating most of the cell\'s supply of adenosine triphosphate (ATP), used as a source of chemical energy.',
  },
  {
    id: 18,
    chapterId: 'g9-bio-tissues',
    question: 'Which type of tissue is responsible for movement in our body?',
    options: ['Epithelial tissue', 'Connective tissue', 'Muscular tissue', 'Nervous tissue'],
    correctAnswer: 2,
    explanation: 'Muscular tissue is composed of cells that have the special ability to shorten or contract in order to produce movement of the body parts.',
  },
  {
    id: 30,
    chapterId: 'g9-bio-food',
    question: 'Which of the following is a Kharif crop?',
    options: ['Wheat', 'Pea', 'Paddy (Rice)', 'Mustard'],
    correctAnswer: 2,
    explanation: 'Kharif crops are grown with the onset of monsoon in different parts of the country and these are harvested in September-October. Paddy, maize, and cotton are examples.',
  },
];
