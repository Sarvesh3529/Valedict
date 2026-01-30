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
  // User-provided questions
  // Chapter 1: Number Systems (g9-math-numsys)
  { id: 2001, chapterId: 'g9-math-numsys', question: 'Which of the following is a rational number?', options: ['$\\sqrt{3}$', '$\\pi$', '0/1', '$\\sqrt{5}$'], correctAnswer: 2, explanation: '0 can be written as 0/1, which is in the $p/q$ form where $q \\neq 0$.'},
  { id: 2002, chapterId: 'g9-math-numsys', question: 'The decimal expansion of an irrational number is always:', options: ['Terminating', 'Recurring', 'Non-terminating and non-recurring', 'Finite'], correctAnswer: 2, explanation: 'Irrational numbers cannot be expressed as a repeating or terminating decimal.'},
  { id: 2003, chapterId: 'g9-math-numsys', question: 'The value of $64^{1/2}$ is:', options: ['4', '6', '8', '32'], correctAnswer: 2, explanation: '$64^{1/2}$ is the square root of 64, which is 8.'},
  { id: 2004, chapterId: 'g9-math-numsys', question: 'Which of the following is an irrational number?', options: ['$\\sqrt{4}$', '$\\sqrt{9}$', '$\\sqrt{7}$', '$\\sqrt{25}$'], correctAnswer: 2, explanation: '$\\sqrt{7}$ results in a non-terminating, non-repeating decimal.'},
  { id: 2005, chapterId: 'g9-math-numsys', question: 'The product of a non-zero rational number and an irrational number is:', options: ['Always rational', 'Always irrational', 'Always an integer', 'Sometimes rational'], correctAnswer: 1, explanation: 'The product of any non-zero rational and an irrational number is always irrational.'},
  { id: 2006, chapterId: 'g9-math-numsys', question: 'The value of $(125)^{-1/3}$ is:', options: ['5', '1/5', '25', '1/25'], correctAnswer: 1, explanation: '$(5^3)^{-1/3} = 5^{-1} = 1/5$.'},
  { id: 2007, chapterId: 'g9-math-numsys', question: 'Between any two rational numbers, there are:', options: ['No rational number', 'Exactly one rational number', 'Infinitely many rational numbers', 'Only irrational numbers'], correctAnswer: 2, explanation: 'The property of density states there are infinite rational numbers between any two.'},
  { id: 2008, chapterId: 'g9-math-numsys', question: 'What is the rationalizing factor of $2 + \\sqrt{3}$?', options: ['2 + \\sqrt{3}', '2 - \\sqrt{3}', '$\\sqrt{3}$', '$\\sqrt{2}$'], correctAnswer: 1, explanation: '$(2+\\sqrt{3})(2-\\sqrt{3}) = 2^2 - (\\sqrt{3})^2 = 4-3 = 1$, which is rational.'},
  { id: 2009, chapterId: 'g9-math-numsys', question: 'Every natural number is a whole number.', options: ['True', 'False', 'Sometimes', 'None of these'], correctAnswer: 0, explanation: 'The set of whole numbers \\{0, 1, 2, ...\\} includes all natural numbers \\{1, 2, 3, ...\\}.'},
  { id: 2010, chapterId: 'g9-math-numsys', question: 'The value of $1.999...$ in the form $p/q$ is:', options: ['19/10', '199/100', '2', '1/9'], correctAnswer: 2, explanation: 'If $x = 1.999...$, then $10x = 19.999...$. Subtracting gives $9x = 18$, so $x = 2$.'},
  { id: 2011, chapterId: 'g9-math-numsys', question: 'Which of the following is equal to $x$?', options: ['$x^{12/7} - x^{5/7}$', '$\\sqrt[12]{x^4}$', '$\\sqrt{(x^3)^{2/3}}$', '$x^{4} \\times x^{3}$'], correctAnswer: 2, explanation: 'Using laws of exponents: $(x^3)^{2/3} = x^{(3 \\times 2/3)} = x^2$. Then $\\sqrt{x^2} = x$.'},
  { id: 2012, chapterId: 'g9-math-numsys', question: 'The sum of $0.\\overline{3}$ and $0.\\overline{4}$ is:', options: ['$7/10$', '$7/9$', '$0.7$', '$1/7$'], correctAnswer: 1, explanation: '$3/9 + 4/9 = 7/9$.'},
  { id: 2013, chapterId: 'g9-math-numsys', question: 'The simplest form of $1/(\\sqrt{7} - \\sqrt{6})$ is:', options: ['$\\sqrt{7} - \\sqrt{6}$', '$\\sqrt{7} + \\sqrt{6}$', '13', '1'], correctAnswer: 1, explanation: 'Multiplying the numerator and denominator by the conjugate $(\\sqrt{7} + \\sqrt{6})$.'},
  { id: 2014, chapterId: 'g9-math-numsys', question: 'A terminating decimal expansion is obtained when the denominator has factors:', options: ['2 and 3', '2 and 5', '3 and 5', '7 and 2'], correctAnswer: 1, explanation: 'For a rational number to terminate, the denominator must be in the form $2^n \\times 5^m$.'},
  { id: 2015, chapterId: 'g9-math-numsys', question: 'The value of $2^0 + 7^0 + 5^0$ is:', options: ['0', '1', '3', '14'], correctAnswer: 2, explanation: 'Any non-zero number raised to the power 0 is 1. So, $1 + 1 + 1 = 3$.'},

  // Chapter 2: Polynomials (g9-math-poly)
  { id: 2101, chapterId: 'g9-math-poly', question: 'Which of the following is a polynomial?', options: ['$x^2 + 2/x$', '$\\sqrt{x} + 3$', '$x^2 + x + 1$', '$x^{-2} + 5$'], correctAnswer: 2, explanation: 'A polynomial cannot have negative or fractional powers of the variable.'},
  { id: 2102, chapterId: 'g9-math-poly', question: 'The degree of the zero polynomial is:', options: ['0', '1', 'Any natural number', 'Not defined'], correctAnswer: 3, explanation: 'The degree of the constant 0 is not defined mathematically.'},
  { id: 2103, chapterId: 'g9-math-poly', question: 'If $p(x) = x + 4$, then $p(x) + p(-x)$ is:', options: ['2x', '0', '8', '4'], correctAnswer: 2, explanation: '$(x+4) + (-x+4) = 8$.'},
  { id: 2104, chapterId: 'g9-math-poly', question: 'The zero of the polynomial $p(x) = 3x - 2$ is:', options: ['3/2', '2/3', '-2/3', '0'], correctAnswer: 1, explanation: 'Setting $3x - 2 = 0$ gives $x = 2/3$.'},
  { id: 2105, chapterId: 'g9-math-poly', question: 'What is the degree of the cubic polynomial $x^3 - 5x + 1$?', options: ['1', '2', '3', '0'], correctAnswer: 2, explanation: 'The highest power of the variable is 3.'},
  { id: 2106, chapterId: 'g9-math-poly', question: 'One of the factors of $x^2 + x - 6$ is:', options: ['x + 3', 'x - 3', 'x + 1', 'x - 1'], correctAnswer: 0, explanation: '$x^2 + 3x - 2x - 6 = (x+3)(x-2)$.'},
  { id: 2107, chapterId: 'g9-math-poly', question: 'The coefficient of $x^2$ in $5 - 3x^2 + x$ is:', options: ['5', '3', '-3', '1'], correctAnswer: 2, explanation: 'The term containing $x^2$ is $-3x^2$, so the coefficient is -3.'},
  { id: 2108, chapterId: 'g9-math-poly', question: 'If $x+1$ is a factor of $x^2 - k$, then the value of $k$ is:', options: ['-1', '1', '0', '2'], correctAnswer: 1, explanation: 'Using the Factor Theorem: $(-1)^2 - k = 0 \\Rightarrow 1 - k = 0 \\Rightarrow k = 1$.'},
  { id: 2109, chapterId: 'g9-math-poly', question: 'The value of $105 \\times 95$ using identities is:', options: ['9975', '9925', '10025', '9500'], correctAnswer: 0, explanation: '$(100+5)(100-5) = 100^2 - 5^2 = 10000 - 25 = 9975$.'},
  { id: 2110, chapterId: 'g9-math-poly', question: 'The expansion of $(x+y+z)^2$ includes which term?', options: ['$3xyz$', '$2xy$', '$x^3$', '$xy^2$'], correctAnswer: 1, explanation: 'The formula is $x^2 + y^2 + z^2 + 2xy + 2yz + 2zx$.'},
  { id: 2111, chapterId: 'g9-math-poly', question: 'If $x + y + z = 0$, then $x^3 + y^3 + z^3$ equals:', options: ['$0$', '$3xyz$', '$xy+yz+zx$', '$x^2+y^2+z^2$'], correctAnswer: 1, explanation: 'This is a standard algebraic identity property.'},
  { id: 2112, chapterId: 'g9-math-poly', question: 'A binomial of degree 5 is:', options: ['$5x$', '$x^5 + 1$', '$x^5 + x^4 + 1$', '$x^2 + 5$'], correctAnswer: 1, explanation: 'A binomial must have exactly two terms, and the highest power must be 5.'},
  { id: 2113, chapterId: 'g9-math-poly', question: 'The value of $p(x) = 5x - 4x^2 + 3$ at $x=0$ is:', options: ['3', '5', '4', '0'], correctAnswer: 0, explanation: '$5(0) - 4(0)^2 + 3 = 3$.'},
  { id: 2114, chapterId: 'g9-math-poly', question: '$(a-b)^3$ is equal to:', options: ['$a^3-b^3$', '$a^3-b^3-3ab(a-b)$', '$a^3+b^3+3ab(a+b)$', '$a^2-b^2$'], correctAnswer: 1, explanation: 'This is the standard expansion for the cube of a difference.'},
  { id: 2115, chapterId: 'g9-math-poly', question: 'The factorized form of $12x^2 - 7x + 1$ is:', options: ['$(3x-1)(4x-1)$', '$(3x+1)(4x+1)$', '$(6x-1)(2x-1)$', '$(12x-1)(x-1)$'], correctAnswer: 0, explanation: 'Splitting the middle term: $12x^2 - 4x - 3x + 1 = 4x(3x-1) - 1(3x-1)$.'},

  // Chapter 3: Coordinate Geometry (g9-math-coord)
  { id: 2201, chapterId: 'g9-math-coord', question: 'The point where the two axes intersect is called the:', options: ['Abscissa', 'Ordinate', 'Origin', 'Quadrant'], correctAnswer: 2, explanation: 'The origin is the point (0,0) where the x and y axes meet.'},
  { id: 2202, chapterId: 'g9-math-coord', question: 'The x-coordinate of a point is also called the:', options: ['Abscissa', 'Ordinate', 'Origin', 'Quadrant'], correctAnswer: 0, explanation: 'Abscissa is the technical term for the horizontal coordinate.'},
  { id: 2203, chapterId: 'g9-math-coord', question: 'The point $(-3, 5)$ lies in which quadrant?', options: ['I', 'II', 'III', 'IV'], correctAnswer: 1, explanation: 'In the second quadrant, x is negative and y is positive.'},
  { id: 2204, chapterId: 'g9-math-coord', question: 'If the y-coordinate of a point is zero, then the point always lies on:', options: ['x-axis', 'y-axis', 'Origin', 'Quadrant IV'], correctAnswer: 0, explanation: 'Points on the x-axis have no vertical displacement.'},
  { id: 2205, chapterId: 'g9-math-coord', question: 'The signs of the coordinates in the third quadrant are:', options: ['(+, +)', '(-, +)', '(-, -)', '(+, -)'], correctAnswer: 2, explanation: 'In the third quadrant, both x and y are negative.'},
  { id: 2206, chapterId: 'g9-math-coord', question: 'The distance of the point $(4, 3)$ from the x-axis is:', options: ['4 units', '3 units', '7 units', '5 units'], correctAnswer: 1, explanation: 'Distance from the x-axis is given by the absolute value of the y-coordinate.'},
  { id: 2207, chapterId: 'g9-math-coord', question: 'Abscissa of all points on the y-axis is:', options: ['1', 'Any number', '0', '-1'], correctAnswer: 2, explanation: 'Any point on the y-axis has a horizontal position of zero.'},
  { id: 2208, chapterId: 'g9-math-coord', question: 'The point $(0, -7)$ lies:', options: ['On the x-axis', 'In the second quadrant', 'On the y-axis', 'In the fourth quadrant'], correctAnswer: 2, explanation: 'Since the x-coordinate is 0, the point must be on the y-axis.'},
  { id: 2209, chapterId: 'g9-math-coord', question: 'The ordinate of the point $(2, -5)$ is:', options: ['2', '-5', '5', '-2'], correctAnswer: 1, explanation: 'The ordinate is the y-coordinate of the point.'},
  { id: 2210, chapterId: 'g9-math-coord', question: 'Which point lies to the right of the y-axis?', options: ['(-2, 3)', '(3, 2)', '(-1, -1)', '(0, 5)'], correctAnswer: 1, explanation: 'Points with positive x-coordinates lie to the right of the y-axis.'},
  { id: 2211, chapterId: 'g9-math-coord', question: 'The axes divide the plane into four parts known as:', options: ['Squares', 'Regions', 'Quadrants', 'Planes'], correctAnswer: 2, explanation: 'The four areas created by the intersection of axes are quadrants.'},
  { id: 2212, chapterId: 'g9-math-coord', question: 'If the coordinates of a point are $(a, b)$ and $a \\times b > 0$, the point could be in:', options: ['I or II', 'II or III', 'I or III', 'I or IV'], correctAnswer: 2, explanation: 'For the product to be positive, both must be positive (I) or both must be negative (III).'},
  { id: 2213, chapterId: 'g9-math-coord', question: 'The point whose ordinate is 4 and which lies on the y-axis is:', options: ['(4, 0)', '(0, 4)', '(4, 4)', '(1, 4)'], correctAnswer: 1, explanation: 'On the y-axis, $x=0$.'},
  { id: 2214, chapterId: 'g9-math-coord', question: 'Points $(1, -1)$ and $(-1, 1)$ are:', options: ['In the same quadrant', 'In II and IV quadrants respectively', 'In IV and II quadrants respectively', 'In I and III quadrants respectively'], correctAnswer: 2, explanation: '$(1, -1)$ is in IV (pos, neg) and $(-1, 1)$ is in II (neg, pos).'},
  { id: 2215, chapterId: 'g9-math-coord', question: 'What is the perpendicular distance of the point $(5, 2)$ from the y-axis?', options: ['2', '5', '7', '3'], correctAnswer: 1, explanation: 'Distance from the y-axis is the absolute value of the x-coordinate.'},
  
  // Chapter 4: Linear Equations in Two Variables (g9-math-lineq)
  { id: 2301, chapterId: 'g9-math-lineq', question: 'How many solutions does a linear equation in two variables have?', options: ['One', 'Two', 'Infinitely many', 'None'], correctAnswer: 2, explanation: 'A linear equation represents a line, and every point on that line is a solution.'},
  { id: 2302, chapterId: 'g9-math-lineq', question: 'The graph of the linear equation $x + y = 4$ passes through:', options: ['(1, 2)', '(2, 2)', '(3, 2)', '(0, 0)'], correctAnswer: 1, explanation: 'Substituting $x=2, y=2$ into $x+y$ gives 4.'},
  { id: 2303, chapterId: 'g9-math-lineq', question: 'The equation $x = 5$ represents a line parallel to the:', options: ['x-axis', 'y-axis', 'Origin', 'Line $y=x$'], correctAnswer: 1, explanation: 'Equations of the form $x=a$ are vertical lines, which are parallel to the y-axis.'},
  { id: 2304, chapterId: 'g9-math-lineq', question: 'Any point on the line $y = x$ is of the form:', options: ['(a, 0)', '(0, a)', '(a, a)', '(a, -a)'], correctAnswer: 2, explanation: 'In the equation $y=x$, the x and y coordinates must be identical.'},
  { id: 2305, chapterId: 'g9-math-lineq', question: 'If $(2, 0)$ is a solution of $2x + 3y = k$, then $k$ is:', options: ['2', '4', '5', '6'], correctAnswer: 1, explanation: '$2(2) + 3(0) = 4 + 0 = 4$.'},
  { id: 2306, chapterId: 'g9-math-lineq', question: 'The linear equation $2x - 5y = 7$ has a unique solution if $x, y$ are:', options: ['Natural numbers', 'Positive real numbers', 'Real numbers', 'Rational numbers'], correctAnswer: 0, explanation: 'In the context of school math, "natural number" constraints often limit infinite solutions to a single pair.'},
  { id: 2307, chapterId: 'g9-math-lineq', question: 'The equation of the x-axis is:', options: ['$x = 0$', '$y = 0$', '$x = y$', '$x + y = 0$'], correctAnswer: 1, explanation: 'On the x-axis, the y-coordinate of every point is always zero.'},
  { id: 2308, chapterId: 'g9-math-lineq', question: 'The graph of $y = 3$ is a line parallel to the x-axis at a distance of:', options: ['3 units from origin', '2 units from origin', 'y units from origin', 'None of these'], correctAnswer: 0, explanation: 'It is a horizontal line where every point has a height of 3.'},
  { id: 2309, chapterId: 'g9-math-lineq', question: 'Which of the following is a linear equation in two variables?', options: ['$2x + 5 = 11$', '$x^2 + y = 3$', '$3x + 2y = 12$', '$x/y = 5$'], correctAnswer: 2, explanation: 'A linear equation must have variables with a power of exactly 1.'},
  { id: 2310, chapterId: 'g9-math-lineq', question: 'The point of the form $(a, -a)$ always lies on the line:', options: ['$x = y$', '$x + y = 0$', '$y = x + 1$', '$x - y = 0$'], correctAnswer: 1, explanation: 'If we add $a$ and $-a$, the result is 0, satisfying $x + y = 0$.'},
  { id: 2311, chapterId: 'g9-math-lineq', question: 'A linear equation in two variables $ax + by + c = 0$ has $a$ and $b$ such that:', options: ['$a = 0, b = 0$', '$a \\neq 0, b = 0$', '$a = 0, b \\neq 0$', '$a$ and $b$ are not both zero'], correctAnswer: 3, explanation: 'For it to be a two-variable equation, at least one coefficient must be non-zero.'},
  { id: 2312, chapterId: 'g9-math-lineq', question: 'The graph of $y = mx$ always passes through the:', options: ['x-axis', 'y-axis', 'Origin', 'Quadrant IV'], correctAnswer: 2, explanation: 'Substituting $(0,0)$ gives $0 = m(0)$, which is always true.'},
  { id: 2313, chapterId: 'g9-math-lineq', question: 'The cost of a notebook is twice the cost of a pen. This can be written as:', options: ['$x = 2y$', '$y = 2x$', '$x + y = 2$', '$2x + y = 0$'], correctAnswer: 0, explanation: 'Let $x$ be notebook cost and $y$ be pen cost. $x = 2 \\times y$.'},
  { id: 2314, chapterId: 'g9-math-lineq', question: 'The x-intercept of the line $2x + 3y = 6$ is:', options: ['2', '3', '6', '0'], correctAnswer: 1, explanation: 'Set $y=0$: $2x = 6 \\Rightarrow x = 3$.'},
  { id: 2315, chapterId: 'g9-math-lineq', question: 'The linear equation $3x - y = x - 1$ can be written in standard form as:', options: ['$2x - y + 1 = 0$', '$4x - y + 1 = 0$', '$2x - y - 1 = 0$', '$2x + y + 1 = 0$'], correctAnswer: 0, explanation: '$3x - x - y + 1 = 0 \\Rightarrow 2x - y + 1 = 0$.'},

  // Existing questions for other chapters
  // Chapter: Introduction to Euclid’s Geometry (g9-math-euclid)
  { id: 1401, chapterId: 'g9-math-euclid', question: '"Things which are equal to the same thing are equal to one another." This is one of Euclid\'s:', options: ['Postulates', 'Definitions', 'Axioms', 'Theorems'], correctAnswer: 2, explanation: 'This is Euclid\'s first axiom.' },
  { id: 1402, chapterId: 'g9-math-euclid', question: 'How many dimensions does a solid have?', options: ['One', 'Two', 'Three', 'Zero'], correctAnswer: 2, explanation: 'Solids have three dimensions: length, breadth, and height.' },
  { id: 1403, chapterId: 'g9-math-euclid', question: 'A surface has length and breadth only. How many dimensions does it have?', options: ['One', 'Two', 'Three', 'Zero'], correctAnswer: 1, explanation: 'A surface is a two-dimensional figure.' },
  { id: 1404, chapterId: 'g9-math-euclid', question: 'Euclid stated that "a terminated line can be produced indefinitely". This is a(n):', options: ['Axiom', 'Definition', 'Postulate', 'Theorem'], correctAnswer: 2, explanation: 'This is Euclid\'s second postulate.' },
  { id: 1405, chapterId: 'g9-math-euclid', question: 'According to Euclid\'s postulates, all right angles are equal to one another. True or False?', options: ['True', 'False'], correctAnswer: 0, explanation: 'This is Euclid\'s fourth postulate.' },
  { id: 1406, chapterId: 'g9-math-euclid', question: 'The whole is greater than the part. This is a(n):', options: ['Postulate', 'Axiom', 'Definition', 'Theorem'], correctAnswer: 1, explanation: 'This is one of Euclid\'s axioms (common notions).'},
  { id: 1407, chapterId: 'g9-math-euclid', question: 'How many lines can pass through a single given point?', options: ['One', 'Two', 'Three', 'Infinite'], correctAnswer: 3, explanation: 'An infinite number of lines can be drawn through a single point.'},
  { id: 1408, chapterId: 'g9-math-euclid', question: 'How many lines can pass through two distinct given points?', options: ['One', 'Two', 'Infinite', 'Zero'], correctAnswer: 0, explanation: 'Exactly one unique line can pass through two distinct points.'},
  { id: 1409, chapterId: 'g9-math-euclid', question: 'Euclid belonged to which country?', options: ['Greece', 'Egypt', 'Rome', 'India'], correctAnswer: 0, explanation: 'Euclid was a Greek mathematician, often referred to as the "father of geometry".'},
  { id: 1410, chapterId: 'g9-math-euclid', question: 'The boundaries of solids are:', options: ['Lines', 'Points', 'Surfaces', 'Curves'], correctAnswer: 2, explanation: 'The boundaries or faces of solids are surfaces.'},
  { id: 1411, chapterId: 'g9-math-euclid', question: 'The edges of a surface are:', options: ['Points', 'Lines', 'Surfaces', 'Angles'], correctAnswer: 1, explanation: 'The edges where surfaces meet are lines or curves.'},
  { id: 1412, chapterId: 'g9-math-euclid', question: 'Things which coincide with one another are ___ to one another.', options: ['equal', 'unequal', 'parallel', 'perpendicular'], correctAnswer: 0, explanation: 'This is one of Euclid\'s axioms.'},
  { id: 1413, chapterId: 'g9-math-euclid', question: 'A point is that which has no ___.', options: ['part', 'length', 'breadth', 'height'], correctAnswer: 0, explanation: 'This is Euclid\'s first definition.'},
  { id: 1414, chapterId: 'g9-math-euclid', question: 'Euclid\'s fifth postulate is related to:', options: ['Circles', 'Triangles', 'Parallel lines', 'Right angles'], correctAnswer: 2, explanation: 'The fifth postulate (the parallel postulate) is a famous and distinguishing feature of Euclidean geometry.'},
  { id: 1415, chapterId: 'g9-math-euclid', question: 'A pyramid is a solid figure, the base of which is:', options: ['Only a triangle', 'Only a square', 'Only a rectangle', 'Any polygon'], correctAnswer: 3, explanation: 'A pyramid has a polygon for a base and triangles for sides which meet at a point.'},
  { id: 1416, chapterId: 'g9-math-euclid', question: 'Which of the following needs a proof?', options: ['Axiom', 'Definition', 'Postulate', 'Theorem'], correctAnswer: 3, explanation: 'A theorem is a statement that has been proven on the basis of previously established statements, such as other theorems, and generally accepted statements, such as axioms.'},
  { id: 1417, chapterId: 'g9-math-euclid', question: 'Euclid\'s "Elements" is a book about:', options: ['Chemistry', 'Physics', 'Geometry', 'Biology'], correctAnswer: 2, explanation: 'The Elements is a mathematical treatise consisting of 13 books attributed to the ancient Greek mathematician Euclid.'},
  { id: 1418, chapterId: 'g9-math-euclid', question: 'If a straight line falling on two straight lines makes the interior angles on the same side of it taken together less than two right angles, then the two straight lines, if produced indefinitely, meet on that side on which the sum of angles is less than two right angles. This is:', options: ['Axiom 1', 'Postulate 5', 'Axiom 5', 'Postulate 1'], correctAnswer: 1, explanation: 'This is the statement of Euclid\'s fifth postulate.'},
  { id: 1419, chapterId: 'g9-math-euclid', question: '"A circle can be drawn with any center and any radius." This is Euclid\'s Postulate number:', options: ['1', '2', '3', '4'], correctAnswer: 2, explanation: 'This is the third postulate.'},
  { id: 1420, chapterId: 'g9-math-euclid', question: 'The word "geometry" comes from the Greek words "Geo" and "metron", meaning:', options: ['Earth-Measure', 'Line-Draw', 'Shape-Study', 'Angle-Check'], correctAnswer: 0, explanation: 'Geo means Earth and metron means to measure.'},

  // Chapter: Lines and Angles (g9-math-linesangles)
  { id: 1501, chapterId: 'g9-math-linesangles', question: 'Two angles that have a common vertex, a common arm and their non-common arms are on different sides of the common arm are called:', options: ['Adjacent angles', 'Vertically opposite angles', 'Complementary angles', 'Supplementary angles'], correctAnswer: 0, explanation: 'This is the definition of adjacent angles.'},
  { id: 1502, chapterId: 'g9-math-linesangles', question: 'If two lines intersect, the vertically opposite angles are:', options: ['Equal', 'Unequal', 'Supplementary', 'Complementary'], correctAnswer: 0, explanation: 'This is a fundamental theorem. Vertically opposite angles formed by intersecting lines are always equal.'},
  { id: 1503, chapterId: 'g9-math-linesangles', question: 'An angle which is greater than 180° but less than 360° is called a:', options: ['Acute angle', 'Obtuse angle', 'Right angle', 'Reflex angle'], correctAnswer: 3, explanation: 'This is the definition of a reflex angle.'},
  { id: 1504, chapterId: 'g9-math-linesangles', question: 'If the sum of two adjacent angles is 180°, they are called a:', options: ['Linear pair', 'Vertically opposite pair', 'Complementary pair', 'Alternate interior pair'], correctAnswer: 0, explanation: 'A linear pair of angles are adjacent angles whose non-common sides are opposite rays, and their sum is 180°.'},
  { id: 1505, chapterId: 'g9-math-linesangles', question: 'In the given figure, if line l || m, then the alternate interior angles are:', options: ['∠1 and ∠8', '∠3 and ∠5', '∠2 and ∠7', '∠4 and ∠5'], correctAnswer: 1, explanation: 'Alternate interior angles are on opposite sides of the transversal and between the parallel lines. Here, ∠3 and ∠5 form one such pair.'},
  { id: 1506, chapterId: 'g9-math-linesangles', question: 'The sum of all angles around a point is:', options: ['180°', '360°', '90°', '270°'], correctAnswer: 1, explanation: 'A complete rotation around a point is 360 degrees.'},
  { id: 1507, chapterId: 'g9-math-linesangles', question: 'If two angles are complementary, their sum is:', options: ['90°', '180°', '360°', '45°'], correctAnswer: 0, explanation: 'Complementary angles add up to 90 degrees.'},
  { id: 1508, chapterId: 'g9-math-linesangles', question: 'If one angle of a linear pair is acute, the other angle must be:', options: ['Acute', 'Obtuse', 'Right', 'Straight'], correctAnswer: 1, explanation: 'If one angle is less than 90°, the other must be greater than 90° for their sum to be 180°.'},
  { id: 1509, chapterId: 'g9-math-linesangles', question: 'Lines which are parallel to the same line are ___ to each other.', options: ['perpendicular', 'intersecting', 'parallel', 'coincident'], correctAnswer: 2, explanation: 'This is a transitive property of parallel lines.'},
  { id: 1510, chapterId: 'g9-math-linesangles', question: 'The sum of the angles of a triangle is:', options: ['90°', '180°', '270°', '360°'], correctAnswer: 1, explanation: 'The angle sum property of a triangle states that the sum of interior angles is always 180°.'},
  { id: 1511, chapterId: 'g9-math-linesangles', question: 'An exterior angle of a triangle is equal to the sum of its two opposite:', options: ['Interior angles', 'Exterior angles', 'Adjacent angles', 'Vertex angles'], correctAnswer: 0, explanation: 'This is the exterior angle theorem of a triangle.'},
  { id: 1512, chapterId: 'g9-math-linesangles', question: 'If a transversal intersects two parallel lines, then each pair of corresponding angles is:', options: ['Equal', 'Supplementary', 'Complementary', 'Unequal'], correctAnswer: 0, explanation: 'Corresponding angles are in the same position at each intersection and are equal when lines are parallel.'},
  { id: 1513, chapterId: 'g9-math-linesangles', question: 'What is the complement of 65°?', options: ['25°', '35°', '115°', '90°'], correctAnswer: 0, explanation: 'Complementary angles sum to 90°. 90° - 65° = 25°.'},
  { id: 1514, chapterId: 'g9-math-linesangles', question: 'What is the supplement of 105°?', options: ['75°', '85°', '180°', '-15°'], correctAnswer: 0, explanation: 'Supplementary angles sum to 180°. 180° - 105° = 75°.'},
  { id: 1515, chapterId: 'g9-math-linesangles', question: 'Two intersecting lines cut each other at an angle of 30°. The other three angles are:', options: ['30°, 150°, 150°', '30°, 60°, 90°', '150°, 150°, 150°', '30°, 30°, 30°'], correctAnswer: 0, explanation: 'Vertically opposite angle is 30°. The other two angles are supplementary to 30°, so they are 180°-30°=150° each.'},
  { id: 1516, chapterId: 'g9-math-linesangles', question: 'An angle is 20° more than its complement. Find the angle.', options: ['55°', '35°', '70°', '110°'], correctAnswer: 0, explanation: 'Let the angle be x. Then its complement is 90-x. So, x = (90-x) + 20 => 2x = 110 => x = 55°.'},
  { id: 1517, chapterId: 'g9-math-linesangles', question: 'If two parallel lines are intersected by a transversal, then the interior angles on the same side of the transversal are:', options: ['Equal', 'Complementary', 'Supplementary', 'Vertically opposite'], correctAnswer: 2, explanation: 'Consecutive interior angles are supplementary, meaning their sum is 180°.'},
  { id: 1518, chapterId: 'g9-math-linesangles', question: 'An angle that measures exactly 90° is called a(n):', options: ['Acute angle', 'Obtuse angle', 'Right angle', 'Straight angle'], correctAnswer: 2, explanation: 'This is the definition of a right angle.'},
  { id: 1519, chapterId: 'g9-math-linesangles', question: 'An angle that measures exactly 180° is called a(n):', options: ['Right angle', 'Full angle', 'Reflex angle', 'Straight angle'], correctAnswer: 3, explanation: 'This is the definition of a straight angle, which forms a straight line.'},
  { id: 1520, chapterId: 'g9-math-linesangles', question: 'If two angles of a triangle are 30° and 60°, what is the third angle?', options: ['90°', '120°', '60°', '30°'], correctAnswer: 0, explanation: 'The sum of angles in a triangle is 180°. So, 180° - 30° - 60° = 90°.'},

  // Chapter: Triangles (g9-math-tri)
  { id: 1601, chapterId: 'g9-math-tri', question: 'In a triangle, the side opposite to the larger angle is:', options: ['Shorter', 'Longer', 'Equal', 'Cannot be determined'], correctAnswer: 1, explanation: 'In any triangle, the side opposite the larger angle is longer.' },
  { id: 1602, chapterId: 'g9-math-tri', question: 'Which of the following is NOT a criterion for congruence of triangles?', options: ['SAS', 'ASA', 'SSA', 'SSS'], correctAnswer: 2, explanation: 'SSA (Side-Side-Angle) is not a valid congruence criterion because it can lead to ambiguous cases.' },
  { id: 1603, chapterId: 'g9-math-tri', question: 'If two sides of a triangle are unequal, the angle opposite to the longer side is:', options: ['Smaller', 'Larger', 'Equal', 'Right angle'], correctAnswer: 1, explanation: 'This is the converse of the side-angle inequality theorem.' },
  { id: 1604, chapterId: 'g9-math-tri', question: 'In a right-angled triangle, the longest side is the:', options: ['Base', 'Perpendicular', 'Hypotenuse', 'Median'], correctAnswer: 2, explanation: 'The hypotenuse is opposite the right angle, which is the largest angle in a right triangle.' },
  { id: 1605, chapterId: 'g9-math-tri', question: 'The sum of any two sides of a triangle is always ___ the third side.', options: ['less than', 'equal to', 'greater than', 'half of'], correctAnswer: 2, explanation: 'This is the Triangle Inequality Theorem.' },
  { id: 1606, chapterId: 'g9-math-tri', question: 'If ∆ABC ≅ ∆PQR, then which of the following is true?', options: ['AB = QR', '∠B = ∠P', 'AC = PR', 'BC = PQ'], correctAnswer: 2, explanation: 'Corresponding parts of congruent triangles are equal. AC corresponds to PR.' },
  { id: 1607, chapterId: 'g9-math-tri', question: 'In an isosceles triangle, angles opposite to equal sides are:', options: ['Unequal', 'Equal', 'Complementary', 'Supplementary'], correctAnswer: 1, explanation: 'This is a property of isosceles triangles.' },
  { id: 1608, chapterId: 'g9-math-tri', question: 'A triangle with all sides equal is called:', options: ['Scalene', 'Isosceles', 'Equilateral', 'Right-angled'], correctAnswer: 2, explanation: 'This is the definition of an equilateral triangle.' },
  { id: 1609, chapterId: 'g9-math-tri', question: 'What is the measure of each angle in an equilateral triangle?', options: ['90°', '45°', '60°', '30°'], correctAnswer: 2, explanation: 'All angles are equal, and their sum is 180°. So, 180°/3 = 60°.' },
  { id: 1610, chapterId: 'g9-math-tri', question: 'In ∆PQR, if ∠R > ∠Q, then:', options: ['QR > PR', 'PQ > PR', 'PQ < PR', 'QR < PR'], correctAnswer: 1, explanation: 'The side opposite the larger angle is longer. PQ is opposite ∠R and PR is opposite ∠Q.' },
  { id: 1611, chapterId: 'g9-math-tri', question: 'Which congruence criterion can be used to prove that two right-angled triangles are congruent?', options: ['SAS', 'ASA', 'SSS', 'RHS'], correctAnswer: 3, explanation: 'RHS (Right angle-Hypotenuse-Side) is a special criterion for right-angled triangles.' },
  { id: 1612, chapterId: 'g9-math-tri', question: 'In ∆ABC, AB = AC and ∠B = 50°. Then ∠A is:', options: ['50°', '80°', '40°', '130°'], correctAnswer: 1, explanation: 'Since AB = AC, ∠C = ∠B = 50°. The sum of angles is 180°, so ∠A = 180° - 50° - 50° = 80°.' },
  { id: 1613, chapterId: 'g9-math-tri', question: 'It is possible to construct a triangle with which of the following side lengths?', options: ['5cm, 7cm, 12cm', '3cm, 4cm, 8cm', '7cm, 8cm, 9cm', '2cm, 3cm, 6cm'], correctAnswer: 2, explanation: 'The sum of any two sides must be greater than the third. 7+8 > 9, 7+9 > 8, 8+9 > 7. Other options fail this test.' },
  { id: 1614, chapterId: 'g9-math-tri', question: 'The point of concurrency of the three altitudes of a triangle is called the:', options: ['Centroid', 'Incenter', 'Circumcenter', 'Orthocenter'], correctAnswer: 3, explanation: 'This is the definition of the orthocenter.' },
  { id: 1615, chapterId: 'g9-math-tri', question: 'The point of concurrency of the three medians of a triangle is called the:', options: ['Centroid', 'Incenter', 'Circumcenter', 'Orthocenter'], correctAnswer: 0, explanation: 'This is the definition of the centroid, which is also the center of gravity.' },
  { id: 1616, chapterId: 'g9-math-tri', question: 'If ∆ABC and ∆PQR are congruent, which notation is correct?', options: ['∆ABC ~ ∆PQR', '∆ABC ≅ ∆PQR', '∆ABC = ∆PQR', '∆ABC ≈ ∆PQR'], correctAnswer: 1, explanation: 'The symbol for congruence is ≅.' },
  { id: 1617, chapterId: 'g9-math-tri', question: 'In ∆ABC, ∠A = 30°, ∠B = 60°, ∠C = 90°. Which side is the longest?', options: ['AB', 'BC', 'AC', 'All are equal'], correctAnswer: 0, explanation: 'The longest side is opposite the largest angle. AB is opposite ∠C (90°).' },
  { id: 1618, chapterId: 'g9-math-tri', question: 'If two triangles are congruent, their areas are:', options: ['Unequal', 'Equal', 'In ratio 1:2', 'In ratio 1:4'], correctAnswer: 1, explanation: 'Congruent figures have the same size and shape, therefore they have the same area.' },
  { id: 1619, chapterId: 'g9-math-tri', question: 'A triangle with no two sides equal is called:', options: ['Scalene', 'Isosceles', 'Equilateral', 'Right-angled'], correctAnswer: 0, explanation: 'This is the definition of a scalene triangle.' },
  { id: 1620, chapterId: 'g9-math-tri', question: 'In ∆XYZ, XY = XZ. Which angles are equal?', options: ['∠X and ∠Y', '∠Y and ∠Z', '∠X and ∠Z', 'All are equal'], correctAnswer: 1, explanation: 'Angles opposite to equal sides are equal. ∠Z is opposite XY, and ∠Y is opposite XZ.' },
];
