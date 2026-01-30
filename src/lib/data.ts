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
  // == Mathematics ==
  // Chapter: Number Systems
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
  {
    id: 117,
    chapterId: 'g9-math-numsys',
    question: 'What is the result of (3 + √3)(2 + √2)?',
    options: ['6 + 3√2 + 2√3 + √6', '6 + 5√5', '11 + √6', '5 + √6'],
    correctAnswer: 0,
    explanation: 'Use the distributive property (FOIL method): 3*2 + 3*√2 + √3*2 + √3*√2.',
  },
  {
    id: 118,
    chapterId: 'g9-math-numsys',
    question: 'Every rational number is a real number. True or False?',
    options: ['True', 'False'],
    correctAnswer: 0,
    explanation: 'The set of real numbers is composed of all rational and irrational numbers.',
  },
   {
    id: 119,
    chapterId: 'g9-math-numsys',
    question: 'Which of the following numbers has a terminating decimal expansion?',
    options: ['1/3', '1/7', '1/8', '1/6'],
    correctAnswer: 2,
    explanation: 'A rational number has a terminating decimal expansion if the prime factorization of the denominator contains only powers of 2 and/or 5. 8 = 2³.',
  },

  // Chapter: Polynomials
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
    question: 'If p(x) = x + 3, what is the value of p(x) + p(-x)?',
    options: ['6', '2x', '0', '3'],
    correctAnswer: 0,
    explanation: 'p(x) = x + 3 and p(-x) = -x + 3. So, (x + 3) + (-x + 3) = 6.',
  },
  {
    id: 120,
    chapterId: 'g9-math-poly',
    question: 'Which of the following is a zero of the polynomial x² - 5x + 6?',
    options: ['1', '4', '5', '2'],
    correctAnswer: 3,
    explanation: 'A zero is a value of x that makes the polynomial equal to 0. (2)² - 5(2) + 6 = 4 - 10 + 6 = 0.',
  },
  {
    id: 121,
    chapterId: 'g9-math-poly',
    question: 'What is the remainder when x³ + 1 is divided by x + 1?',
    options: ['0', '1', '2', '-1'],
    correctAnswer: 0,
    explanation: 'According to the Remainder Theorem, the remainder is f(-1). (-1)³ + 1 = -1 + 1 = 0.',
  },

  // Chapter: Coordinate Geometry
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
  {
    id: 122,
    chapterId: 'g9-math-coord',
    question: 'What is the name of the horizontal line in the cartesian plane?',
    options: ['y-axis', 'origin', 'x-axis', 'quadrant'],
    correctAnswer: 2,
    explanation: 'The horizontal line is the x-axis, and the vertical line is the y-axis.',
  },

  // Chapter: Linear Equations in Two Variables
  {
    id: 107,
    chapterId: 'g9-math-lineq',
    question: 'How many solutions does the equation y = 3x + 5 have?',
    options: ['One solution', 'Two solutions', 'Infinitely many solutions', 'No solution'],
    correctAnswer: 2,
    explanation: 'For every value of x, you can find a corresponding value of y, resulting in an infinite number of (x, y) pairs.',
  },
  {
    id: 108,
    chapterId: 'g9-math-lineq',
    question: 'The graph of a linear equation in two variables is a...',
    options: ['Straight line', 'Circle', 'Parabola', 'Point'],
    correctAnswer: 0,
    explanation: 'The equation ax + by + c = 0 always represents a straight line on a graph.',
  },

  // Chapter: Introduction to Euclid’s Geometry
  {
    id: 109,
    chapterId: 'g9-math-euclid',
    question: 'According to Euclid\'s postulates, all right angles are equal to one another. True or False?',
    options: ['True', 'False'],
    correctAnswer: 0,
    explanation: 'This is Euclid\'s fourth postulate, a fundamental assumption in Euclidean geometry.',
  },
  {
    id: 123,
    chapterId: 'g9-math-euclid',
    question: '"Things which are equal to the same thing are equal to one another." This is one of Euclid\'s:',
    options: ['Postulates', 'Definitions', 'Axioms', 'Theorems'],
    correctAnswer: 2,
    explanation: 'This is Euclid\'s first axiom. Axioms are common notions used throughout mathematics, whereas postulates are specific to geometry.',
  },

  // Chapter: Lines and Angles
  {
    id: 110,
    chapterId: 'g9-math-linesangles',
    question: 'If two lines intersect, the vertically opposite angles are:',
    options: ['Complementary', 'Supplementary', 'Equal', 'Unequal'],
    correctAnswer: 2,
    explanation: 'When two lines intersect, the angles opposite each other at the vertex are always equal.',
  },
  {
    id: 124,
    chapterId: 'g9-math-linesangles',
    question: 'Two angles are complementary. If one angle is 40°, what is the other angle?',
    options: ['50°', '140°', '90°', '40°'],
    correctAnswer: 0,
    explanation: 'Complementary angles add up to 90°. So, 90° - 40° = 50°.',
  },

  // Chapter: Triangles
  {
    id: 111,
    chapterId: 'g9-math-tri',
    question: 'What is the sum of angles in a triangle?',
    options: ['90 degrees', '180 degrees', '270 degrees', '360 degrees'],
    correctAnswer: 1,
    explanation: 'The sum of the interior angles of any triangle is always 180 degrees.',
  },
  {
    id: 125,
    chapterId: 'g9-math-tri',
    question: 'Which congruence rule applies if two sides and the included angle of one triangle are equal to two sides and the included angle of another triangle?',
    options: ['SSS', 'ASA', 'SAS', 'RHS'],
    correctAnswer: 2,
    explanation: 'This is the Side-Angle-Side (SAS) congruence criterion.',
  },
  
  // Chapter: Quadrilaterals
  {
    id: 112,
    chapterId: 'g9-math-quad',
    question: 'A quadrilateral with all four sides equal and all four angles right angles is a:',
    options: ['Rhombus', 'Rectangle', 'Square', 'Trapezium'],
    correctAnswer: 2,
    explanation: 'A square has four equal sides and four 90-degree angles.',
  },

  // Chapter: Circles
  {
    id: 113,
    chapterId: 'g9-math-circles',
    question: 'The longest chord in a circle is called the:',
    options: ['Radius', 'Tangent', 'Secant', 'Diameter'],
    correctAnswer: 3,
    explanation: 'The diameter is a chord that passes through the center of the circle, making it the longest possible chord.',
  },

  // Chapter: Heron’s Formula
  {
    id: 114,
    chapterId: 'g9-math-heron',
    question: 'Heron\'s formula is used to calculate the area of a:',
    options: ['Circle', 'Square', 'Triangle', 'Rectangle'],
    correctAnswer: 2,
    explanation: 'Heron\'s formula calculates the area of a triangle when the lengths of all three sides are known.',
  },

  // Chapter: Surface Areas and Volumes
  {
    id: 115,
    chapterId: 'g9-math-surface',
    question: 'What is the formula for the volume of a sphere?',
    options: ['πr²h', '2πrh', '4πr²', '(4/3)πr³'],
    correctAnswer: 3,
    explanation: 'The volume of a sphere with radius r is given by the formula V = (4/3)πr³.',
  },

  // Chapter: Statistics
  {
    id: 116,
    chapterId: 'g9-math-stats',
    question: 'What is the mode of the following data set: 2, 3, 5, 3, 7, 3, 8?',
    options: ['5', '3', '7', '8'],
    correctAnswer: 1,
    explanation: 'The mode is the number that appears most frequently in a data set. In this case, 3 appears three times.',
  },

  // == Physics ==
  // Chapter: Motion
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
   {
    id: 208,
    chapterId: 'g9-phy-motion',
    question: 'A car accelerates uniformly from 18 km/h to 36 km/h in 5 seconds. What is its acceleration?',
    options: ['1 m/s²', '2 m/s²', '3.6 m/s²', '5 m/s²'],
    correctAnswer: 0,
    explanation: 'First, convert speeds to m/s: 18 km/h = 5 m/s, 36 km/h = 10 m/s. Then use a = (v-u)/t. a = (10-5)/5 = 1 m/s².',
  },
  {
    id: 209,
    chapterId: 'g9-phy-motion',
    question: 'The area under a velocity-time graph represents:',
    options: ['Speed', 'Acceleration', 'Displacement', 'Force'],
    correctAnswer: 2,
    explanation: 'The area under a v-t graph gives the displacement of the object.',
  },

  // Chapter: Force and Laws of Motion
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
    explanation: 'Inertia is the resistance of any physical object to any change in its velocity.',
  },
  {
    id: 210,
    chapterId: 'g9-phy-force',
    question: 'Momentum is the product of mass and __________.',
    options: ['Acceleration', 'Velocity', 'Force', 'Distance'],
    correctAnswer: 1,
    explanation: 'Momentum (p) is defined as mass (m) times velocity (v), p = mv.',
  },

  // Chapter: Gravitation
  {
    id: 205,
    chapterId: 'g9-phy-grav',
    question: 'The value of acceleration due to gravity (g) is highest at:',
    options: ['The equator', 'The poles', 'The center of the Earth', 'It is constant everywhere'],
    correctAnswer: 1,
    explanation: 'The Earth is not a perfect sphere; it is slightly flattened at the poles. Since g is inversely proportional to the square of the distance from the center, it is highest at the poles.',
  },
  {
    id: 211,
    chapterId: 'g9-phy-grav',
    question: 'The weight of an object on the moon is about ____ of its weight on Earth.',
    options: ['1/2', '1/4', '1/6', 'The same as'],
    correctAnswer: 2,
    explanation: 'The moon\'s gravity is much weaker than Earth\'s, approximately one-sixth.',
  },

  // Chapter: Work and Energy
  {
    id: 206,
    chapterId: 'g9-phy-work',
    question: 'The unit of work is:',
    options: ['Watt', 'Newton', 'Joule', 'Pascal'],
    correctAnswer: 2,
    explanation: 'The SI unit of work and energy is the Joule (J).',
  },
  {
    id: 212,
    chapterId: 'g9-phy-work',
    question: 'An object of mass 10 kg is moving with a velocity of 5 m/s. What is its kinetic energy?',
    options: ['25 J', '50 J', '125 J', '250 J'],
    correctAnswer: 2,
    explanation: 'Kinetic Energy (KE) = 1/2 * m * v². KE = 0.5 * 10 * (5)² = 0.5 * 10 * 25 = 125 J.',
  },

  // Chapter: Sound
  {
    id: 207,
    chapterId: 'g9-phy-sound',
    question: 'Sound waves cannot travel through:',
    options: ['Solid', 'Liquid', 'Gas', 'Vacuum'],
    correctAnswer: 3,
    explanation: 'Sound is a mechanical wave, which means it requires a medium (particles) to propagate. A vacuum is empty of matter.',
  },
  {
    id: 213,
    chapterId: 'g9-phy-sound',
    question: 'The persistence of sound due to repeated reflection is called:',
    options: ['Echo', 'Reverberation', 'Pitch', 'Loudness'],
    correctAnswer: 1,
    explanation: 'Reverberation is the collection of reflected sounds from the surfaces in an enclosure.',
  },
  
  // == Chemistry ==
  // Chapter: Matter in Our Surroundings
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
  {
    id: 307,
    chapterId: 'g9-chem-matter',
    question: 'What is the boiling point of water in Kelvin?',
    options: ['273 K', '373 K', '100 K', '0 K'],
    correctAnswer: 1,
    explanation: 'The boiling point of water is 100°C. To convert Celsius to Kelvin, you add 273.15. So, 100 + 273.15 = 373.15 K.',
  },
  {
    id: 308,
    chapterId: 'g9-chem-matter',
    question: 'Evaporation causes:',
    options: ['Heating', 'Cooling', 'No change in temperature', 'An increase in pressure'],
    correctAnswer: 1,
    explanation: 'The particles of a liquid absorb energy from the surroundings to evaporate, which leads to a cooling effect.',
  },

  // Chapter: Is Matter Around Us Pure?
  {
    id: 303,
    chapterId: 'g9-chem-pure',
    question: 'Which of the following is a mixture?',
    options: ['Salt', 'Water', 'Air', 'Sugar'],
    correctAnswer: 2,
    explanation: 'Air is a mixture of various gases like nitrogen, oxygen, argon, and carbon dioxide.',
  },
  {
    id: 304,
    chapterId: 'g9-chem-pure',
    question: 'A solution in which no more solute can be dissolved at a given temperature is known as:',
    options: ['Unsaturated solution', 'Saturated solution', 'Supersaturated solution', 'Colloid'],
    correctAnswer: 1,
    explanation: 'A saturated solution contains the maximum amount of solute that will dissolve in a solvent at that temperature.',
  },
  {
    id: 309,
    chapterId: 'g9-chem-pure',
    question: 'Which of these is a chemical change?',
    options: ['Melting of ice', 'Dissolving salt in water', 'Burning of wood', 'Boiling of water'],
    correctAnswer: 2,
    explanation: 'Burning wood (combustion) is a chemical change because it results in new substances (ash, smoke, CO2).',
  },

  // Chapter: Atoms and Molecules
  {
    id: 305,
    chapterId: 'g9-chem-atoms',
    question: 'What is the chemical formula for water?',
    options: ['CO₂', 'O₂', 'H₂O₂', 'H₂O'],
    correctAnswer: 3,
    explanation: 'A molecule of water is composed of two hydrogen atoms and one oxygen atom.',
  },
  {
    id: 310,
    chapterId: 'g9-chem-atoms',
    question: 'What is Avogadro\'s number?',
    options: ['6.022 x 10²³', '3.14 x 10¹⁵', '9.8 x 10⁸', '1.602 x 10⁻¹⁹'],
    correctAnswer: 0,
    explanation: 'Avogadro\'s number is the number of constituent particles (usually atoms or molecules) that are contained in one mole of a substance.',
  },
  
  // Chapter: Structure of the Atom
  {
    id: 306,
    chapterId: 'g9-chem-structure',
    question: 'Which subatomic particle has a negative charge?',
    options: ['Proton', 'Neutron', 'Electron', 'Photon'],
    correctAnswer: 2,
    explanation: 'Electrons are negatively charged particles that orbit the nucleus of an atom.',
  },
  {
    id: 311,
    chapterId: 'g9-chem-structure',
    question: 'Isotopes are atoms of the same element with a different number of:',
    options: ['Protons', 'Electrons', 'Neutrons', 'Ions'],
    correctAnswer: 2,
    explanation: 'Isotopes have the same number of protons (same atomic number) but different numbers of neutrons (different mass number).',
  },

  // == Biology ==
  // Chapter: The Fundamental Unit of Life (Cell)
  {
    id: 401,
    chapterId: 'g9-bio-cell',
    question: 'What is the powerhouse of the cell?',
    options: ['Nucleus', 'Ribosome', 'Mitochondrion', 'Chloroplast'],
    correctAnswer: 2,
    explanation: 'Mitochondria are responsible for generating most of the cell\'s supply of adenosine triphosphate (ATP).',
  },
  {
    id: 402,
    chapterId: 'g9-bio-cell',
    question: 'Which organelle is known as the "suicide bag" of the cell?',
    options: ['Lysosome', 'Ribosome', 'Vacuole', 'Golgi apparatus'],
    correctAnswer: 0,
    explanation: 'Lysosomes contain digestive enzymes. If the cell is damaged, they can burst and digest the entire cell.',
  },
  {
    id: 406,
    chapterId: 'g9-bio-cell',
    question: 'Which of the following is found in plant cells but not in animal cells?',
    options: ['Cell membrane', 'Nucleus', 'Mitochondria', 'Cell wall'],
    correctAnswer: 3,
    explanation: 'Plant cells have a rigid cell wall outside the cell membrane for structural support. Animal cells do not.',
  },
   {
    id: 407,
    chapterId: 'g9-bio-cell',
    question: 'Where is DNA located in a eukaryotic cell?',
    options: ['Cytoplasm', 'Ribosome', 'Nucleus', 'Vacuole'],
    correctAnswer: 2,
    explanation: 'In eukaryotic cells, the vast majority of the genetic material (DNA) is contained within the nucleus.',
  },

  // Chapter: Tissues
  {
    id: 403,
    chapterId: 'g9-bio-tissues',
    question: 'Which type of tissue is responsible for movement in our body?',
    options: ['Epithelial tissue', 'Connective tissue', 'Muscular tissue', 'Nervous tissue'],
    correctAnswer: 2,
    explanation: 'Muscular tissue is composed of cells that have the special ability to shorten or contract in order to produce movement.',
  },
  {
    id: 404,
    chapterId: 'g9-bio-tissues',
    question: 'Blood is an example of which type of tissue?',
    options: ['Epithelial tissue', 'Connective tissue', 'Muscular tissue', 'Nervous tissue'],
    correctAnswer: 1,
    explanation: 'Blood is considered a specialized form of connective tissue because it has a matrix (plasma).',
  },
  {
    id: 408,
    chapterId: 'g9-bio-tissues',
    question: 'Which plant tissue is responsible for transporting water and minerals from the roots to the rest of the plant?',
    options: ['Phloem', 'Xylem', 'Parenchyma', 'Sclerenchyma'],
    correctAnswer: 1,
    explanation: 'Xylem is the vascular tissue in plants that conducts water and dissolved nutrients upward from the root.',
  },

  // Chapter: Improvement in Food Resources
  {
    id: 405,
    chapterId: 'g9-bio-food',
    question: 'Which of the following is a Kharif crop?',
    options: ['Wheat', 'Pea', 'Paddy (Rice)', 'Mustard'],
    correctAnswer: 2,
    explanation: 'Kharif crops are grown with the onset of monsoon. Examples include paddy, maize, and cotton.',
  },
  {
    id: 409,
    chapterId: 'g9-bio-food',
    question: 'The practice of growing two or more crops in a definite row pattern is known as:',
    options: ['Crop rotation', 'Mixed cropping', 'Intercropping', 'Fallowing'],
    correctAnswer: 2,
    explanation: 'Intercropping involves growing two or more crops simultaneously in the same field in a definite pattern.',
  },
];
