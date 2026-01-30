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
  // Math - Number Systems
  {
    id: 101,
    chapterId: 'g9-math-numsys',
    question: 'Which of the following is an irrational number?',
    options: ['√4', '√9', '√2', '0.333...'],
    correctAnswer: 2,
    explanation: '√2 cannot be expressed as a simple fraction. √4=2 and √9=3 are integers. 0.333... is a rational number (1/3).',
  },
  {
    id: 102,
    chapterId: 'g9-math-numsys',
    question: 'The decimal expansion of a rational number is either terminating or...',
    options: ['Non-terminating non-repeating', 'Non-terminating repeating', 'Terminating repeating', 'None of the above'],
    correctAnswer: 1,
    explanation: 'Rational numbers have decimal expansions that either terminate or repeat in a pattern.',
  },
  // Math - Polynomials
  {
    id: 103,
    chapterId: 'g9-math-poly',
    question: 'What is the degree of the polynomial 5x³ + 4x² + 7x?',
    options: ['3', '2', '1', '4'],
    correctAnswer: 0,
    explanation: 'The degree of a polynomial is the highest exponent of its variable. Here, the highest exponent is 3.',
  },
  {
    id: 104,
    chapterId: 'g9-math-poly',
    question: 'What is (x+y)²?',
    options: ['x² + y²', 'x² + 2xy + y²', 'x² - 2xy + y²', '2x + 2y'],
    correctAnswer: 1,
    explanation: 'The formula for the square of a binomial (a+b)² is a² + 2ab + b².',
  },
  // Math - Coordinate Geometry
  {
    id: 105,
    chapterId: 'g9-math-coord',
    question: 'What are the coordinates of the origin in a Cartesian plane?',
    options: ['(1, 1)', '(0, 0)', '(1, 0)', '(0, 1)'],
    correctAnswer: 1,
    explanation: 'The origin is the point where the x-axis and y-axis intersect, which is at the coordinates (0, 0).',
  },
  {
    id: 106,
    chapterId: 'g9-math-coord',
    question: 'The point (-3, -5) lies in which quadrant?',
    options: ['First quadrant', 'Second quadrant', 'Third quadrant', 'Fourth quadrant'],
    correctAnswer: 2,
    explanation: 'In the third quadrant, both the x-coordinate and y-coordinate are negative.',
  },
  // Math - Linear Equations
  {
    id: 107,
    chapterId: 'g9-math-lineq',
    question: 'What is the value of x in the equation 2x + 3 = 7?',
    options: ['1', '2', '3', '4'],
    correctAnswer: 1,
    explanation: 'Subtract 3 from both sides to get 2x = 4. Then divide by 2 to get x = 2.',
  },
  {
    id: 108,
    chapterId: 'g9-math-lineq',
    question: 'The graph of a linear equation in two variables is a...',
    options: ['Straight line', 'Circle', 'Parabola', 'Point'],
    correctAnswer: 0,
    explanation: 'The equation ax + by + c = 0 always represents a straight line on a graph.',
  },
  // Math - Euclid’s Geometry
  {
    id: 109,
    chapterId: 'g9-math-euclid',
    question: 'According to Euclid\'s postulates, all right angles are equal to one another. True or False?',
    options: ['True', 'False'],
    correctAnswer: 0,
    explanation: 'This is Euclid\'s fourth postulate, a fundamental assumption in Euclidean geometry.',
  },
  // Math - Lines and Angles
  {
    id: 110,
    chapterId: 'g9-math-linesangles',
    question: 'If two lines intersect, the vertically opposite angles are:',
    options: ['Complementary', 'Supplementary', 'Equal', 'Unequal'],
    correctAnswer: 2,
    explanation: 'When two lines intersect, the angles opposite each other at the vertex are always equal.',
  },
  // Math - Triangles
  {
    id: 111,
    chapterId: 'g9-math-tri',
    question: 'What is the sum of angles in a triangle?',
    options: ['90 degrees', '180 degrees', '270 degrees', '360 degrees'],
    correctAnswer: 1,
    explanation: 'The sum of the interior angles of any triangle is always 180 degrees.',
  },
  // Math - Quadrilaterals
  {
    id: 112,
    chapterId: 'g9-math-quad',
    question: 'A quadrilateral with all four sides equal and all four angles right angles is a:',
    options: ['Rhombus', 'Rectangle', 'Square', 'Trapezium'],
    correctAnswer: 2,
    explanation: 'A square has four equal sides and four 90-degree angles.',
  },
  // Math - Circles
  {
    id: 113,
    chapterId: 'g9-math-circles',
    question: 'The longest chord in a circle is called the:',
    options: ['Radius', 'Tangent', 'Secant', 'Diameter'],
    correctAnswer: 3,
    explanation: 'The diameter is a chord that passes through the center of the circle, making it the longest possible chord.',
  },
  // Math - Heron’s Formula
  {
    id: 114,
    chapterId: 'g9-math-heron',
    question: 'Heron\'s formula is used to calculate the area of a:',
    options: ['Circle', 'Square', 'Triangle', 'Rectangle'],
    correctAnswer: 2,
    explanation: 'Heron\'s formula calculates the area of a triangle when the lengths of all three sides are known.',
  },
  // Math - Surface Areas and Volumes
  {
    id: 115,
    chapterId: 'g9-math-surface',
    question: 'What is the formula for the volume of a cylinder?',
    options: ['πr²h', '2πrh', 'l*b*h', '4/3 πr³'],
    correctAnswer: 0,
    explanation: 'The volume of a cylinder is the area of the base (πr²) multiplied by the height (h).',
  },
  // Math - Statistics
  {
    id: 116,
    chapterId: 'g9-math-stats',
    question: 'What is the mode of the following data set: 2, 3, 5, 3, 7, 3, 8?',
    options: ['5', '3', '7', '8'],
    correctAnswer: 1,
    explanation: 'The mode is the number that appears most frequently in a data set. In this case, 3 appears three times.',
  },

  // Physics - Motion
  {
    id: 201,
    chapterId: 'g9-phy-motion',
    question: 'Which of the following is a vector quantity?',
    options: ['Speed', 'Distance', 'Mass', 'Velocity'],
    correctAnswer: 3,
    explanation: 'Velocity has both magnitude and direction, making it a vector quantity. Speed, distance, and mass are scalar quantities.',
  },
  {
    id: 202,
    chapterId: 'g9-phy-motion',
    question: 'Acceleration is the rate of change of:',
    options: ['Distance', 'Speed', 'Velocity', 'Time'],
    correctAnswer: 2,
    explanation: 'Acceleration is defined as the rate at which an object changes its velocity.',
  },
  // Physics - Force and Laws of Motion
  {
    id: 203,
    chapterId: 'g9-phy-force',
    question: 'What is Newton\'s second law of motion?',
    options: ['F=ma', 'E=mc²', 'v=u+at', 'P=V*I'],
    correctAnswer: 0,
    explanation: 'Newton\'s second law states that the force on an object is equal to its mass times its acceleration (F=ma).',
  },
  {
    id: 204,
    chapterId: 'g9-phy-force',
    question: 'Inertia is the property of a body to resist a change in its state of:',
    options: ['Rest only', 'Motion only', 'Rest or uniform motion', 'Acceleration'],
    correctAnswer: 2,
    explanation: 'Inertia is the resistance of any physical object to any change in its velocity. This includes changes to its speed, direction, or state of rest.',
  },
  // Physics - Gravitation
  {
    id: 205,
    chapterId: 'g9-phy-grav',
    question: 'The value of acceleration due to gravity (g) is highest at:',
    options: ['The equator', 'The poles', 'The center of the Earth', 'It is constant everywhere'],
    correctAnswer: 1,
    explanation: 'The Earth is not a perfect sphere; it is slightly flattened at the poles. Since g is inversely proportional to the square of the distance from the center, it is highest at the poles.',
  },
  // Physics - Work and Energy
  {
    id: 206,
    chapterId: 'g9-phy-work',
    question: 'The unit of work is:',
    options: ['Watt', 'Newton', 'Joule', 'Pascal'],
    correctAnswer: 2,
    explanation: 'The SI unit of work and energy is the Joule (J).',
  },
  // Physics - Sound
  {
    id: 207,
    chapterId: 'g9-phy-sound',
    question: 'Sound waves cannot travel through:',
    options: ['Solid', 'Liquid', 'Gas', 'Vacuum'],
    correctAnswer: 3,
    explanation: 'Sound is a mechanical wave, which means it requires a medium (particles) to propagate. A vacuum is empty of matter.',
  },
  
  // Chemistry - Matter in Our Surroundings
  {
    id: 301,
    chapterId: 'g9-chem-matter',
    question: 'The process of a solid turning directly into a gas is called:',
    options: ['Evaporation', 'Condensation', 'Sublimation', 'Melting'],
    correctAnswer: 2,
    explanation: 'Sublimation is the phase transition of a substance directly from the solid to the gas state, without passing through the liquid state.',
  },
  {
    id: 302,
    chapterId: 'g9-chem-matter',
    question: 'Which state of matter has a definite volume but no definite shape?',
    options: ['Solid', 'Liquid', 'Gas', 'Plasma'],
    correctAnswer: 1,
    explanation: 'Liquids take the shape of their container but have a fixed volume.',
  },
  // Chemistry - Is Matter Around Us Pure?
  {
    id: 303,
    chapterId: 'g9-chem-pure',
    question: 'Which of the following is a mixture?',
    options: ['Salt', 'Water', 'Air', 'Sugar'],
    correctAnswer: 2,
    explanation: 'Air is a mixture of various gases like nitrogen, oxygen, argon, and carbon dioxide. Salt, water, and sugar are pure substances (compounds).',
  },
  {
    id: 304,
    chapterId: 'g9-chem-pure',
    question: 'A solution in which no more solute can be dissolved at a given temperature is known as:',
    options: ['Unsaturated solution', 'Saturated solution', 'Supersaturated solution', 'Colloid'],
    correctAnswer: 1,
    explanation: 'A saturated solution contains the maximum amount of solute that will dissolve in a solvent at that temperature.',
  },
  // Chemistry - Atoms and Molecules
  {
    id: 305,
    chapterId: 'g9-chem-atoms',
    question: 'What is the chemical formula for water?',
    options: ['CO₂', 'O₂', 'H₂O₂', 'H₂O'],
    correctAnswer: 3,
    explanation: 'A molecule of water is composed of two hydrogen atoms and one oxygen atom.',
  },
  // Chemistry - Structure of the Atom
  {
    id: 306,
    chapterId: 'g9-chem-structure',
    question: 'Which subatomic particle has a negative charge?',
    options: ['Proton', 'Neutron', 'Electron', 'Photon'],
    correctAnswer: 2,
    explanation: 'Electrons are negatively charged particles that orbit the nucleus of an atom.',
  },

  // Biology - The Fundamental Unit of Life (Cell)
  {
    id: 401,
    chapterId: 'g9-bio-cell',
    question: 'What is the powerhouse of the cell?',
    options: ['Nucleus', 'Ribosome', 'Mitochondrion', 'Chloroplast'],
    correctAnswer: 2,
    explanation: 'Mitochondria are responsible for generating most of the cell\'s supply of adenosine triphosphate (ATP), used as a source of chemical energy.',
  },
  {
    id: 402,
    chapterId: 'g9-bio-cell',
    question: 'Which organelle is known as the "suicide bag" of the cell?',
    options: ['Lysosome', 'Ribosome', 'Vacuole', 'Golgi apparatus'],
    correctAnswer: 0,
    explanation: 'Lysosomes contain digestive enzymes. If the cell is damaged, they can burst and digest the entire cell.',
  },
  // Biology - Tissues
  {
    id: 403,
    chapterId: 'g9-bio-tissues',
    question: 'Which type of tissue is responsible for movement in our body?',
    options: ['Epithelial tissue', 'Connective tissue', 'Muscular tissue', 'Nervous tissue'],
    correctAnswer: 2,
    explanation: 'Muscular tissue is composed of cells that have the special ability to shorten or contract in order to produce movement of the body parts.',
  },
  {
    id: 404,
    chapterId: 'g9-bio-tissues',
    question: 'Blood is an example of which type of tissue?',
    options: ['Epithelial tissue', 'Connective tissue', 'Muscular tissue', 'Nervous tissue'],
    correctAnswer: 1,
    explanation: 'Blood is considered a specialized form of connective tissue because it has a matrix (plasma) and originates from bone marrow.',
  },
  // Biology - Improvement in Food Resources
  {
    id: 405,
    chapterId: 'g9-bio-food',
    question: 'Which of the following is a Kharif crop?',
    options: ['Wheat', 'Pea', 'Paddy (Rice)', 'Mustard'],
    correctAnswer: 2,
    explanation: 'Kharif crops are grown with the onset of monsoon and harvested in September-October. Examples include paddy, maize, and cotton.',
  },
];
