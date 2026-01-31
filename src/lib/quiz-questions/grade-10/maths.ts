import type { QuizQuestion } from '../../types';

export const grade10MathQuestions: QuizQuestion[] = [
  // Chapter 1: Real Numbers
  {
    id: 10001,
    chapterId: 'g10-math-real',
    question: 'The Fundamental Theorem of Arithmetic states that every composite number can be expressed as a product of:',
    options: ['Even numbers', 'Prime numbers', 'Odd numbers', 'Rational numbers'],
    correctAnswer: 1,
    difficulty: 'easy',
    explanation: 'Every composite number can be uniquely factored into prime numbers, regardless of the order.'
  },
  {
    id: 10002,
    chapterId: 'g10-math-real',
    question: 'Which of the following is an irrational number?',
    options: ['$\\sqrt{9}$', '3.14', '$\\pi$', '22/7'],
    correctAnswer: 2,
    difficulty: 'easy',
    explanation: 'While 22/7 and 3.14 are rational approximations, $\\pi$ is non-terminating and non-recurring.'
  },
  {
    id: 10003,
    chapterId: 'g10-math-real',
    question: 'If $LCM(x, 18) = 36$ and $HCF(x, 18) = 2$, then the value of $x$ is:',
    options: ['2', '3', '4', '1'],
    correctAnswer: 2,
    difficulty: 'easy',
    explanation: 'Using the formula $LCM \\times HCF = a \\times b$, we get $36 \\times 2 = x \\times 18$, so $x = 4$.'
  },
  {
    id: 10004,
    chapterId: 'g10-math-real',
    question: 'The decimal expansion of 17/8 is:',
    options: ['Terminating', 'Non-terminating repeating', 'Non-terminating non-repeating', 'None of these'],
    correctAnswer: 0,
    difficulty: 'easy',
    explanation: 'The denominator 8 is $2^3$. Since it is in the form $2^n \\times 5^m$, the decimal terminates.'
  },
  {
    id: 10005,
    chapterId: 'g10-math-real',
    question: 'If $p$ is a prime number and $p$ divides $a^2$, then $p$ also divides:',
    options: ['$a$', '$2a$', '$\\sqrt{a}$', '$a/2$'],
    correctAnswer: 0,
    difficulty: 'easy',
    explanation: 'This is a standard theorem: if a prime divides the square of a positive integer, it divides the integer itself.'
  },
  {
    id: 10006,
    chapterId: 'g10-math-real',
    question: 'The HCF of 92 and 510 is:',
    options: ['2', '4', '6', '8'],
    correctAnswer: 0,
    difficulty: 'medium',
    explanation: 'Prime factorization: $92 = 2^2 \\times 23$ and $510 = 2 \\times 3 \\times 5 \\times 17$. The common factor is 2.'
  },
  {
    id: 10007,
    chapterId: 'g10-math-real',
    question: 'If $n$ is any natural number, then $6^n - 5^n$ always ends with the digit:',
    options: ['1', '3', '5', '7'],
    correctAnswer: 0,
    difficulty: 'medium',
    explanation: '$6^n$ always ends in 6 and $5^n$ always ends in 5. Their difference $6-5$ results in 1.'
  },
  {
    id: 10008,
    chapterId: 'g10-math-real',
    question: 'The largest number that divides 70 and 125 leaving remainders 5 and 8 respectively is:',
    options: ['13', '65', '875', '1750'],
    correctAnswer: 0,
    difficulty: 'medium',
    explanation: 'Find $HCF(70-5, 125-8)$, which is $HCF(65, 117) = 13$.'
  },
  {
    id: 10009,
    chapterId: 'g10-math-real',
    question: 'If $HCF(a, b) = 12$ and $a \\times b = 1800$, then $LCM(a, b)$ is:',
    options: ['150', '90', '120', '1500'],
    correctAnswer: 0,
    difficulty: 'medium',
    explanation: '$LCM = (a \\times b) / HCF = 1800 / 12 = 150$.'
  },
  {
    id: 10010,
    chapterId: 'g10-math-real',
    question: 'Which of the following rational numbers have a terminating decimal expansion?',
    options: ['125/441', '77/210', '15/1600', '129/($2^2 5^7 7^5$)'],
    correctAnswer: 2,
    difficulty: 'medium',
    explanation: '15/1600 simplifies to 3/320. Denominator $320 = 2^6 \\times 5^1$, which is in the form $2^n 5^m$.'
  },
  {
    id: 10011,
    chapterId: 'g10-math-real',
    question: 'Let $x = p/q$ be a rational number such that the prime factorization of $q$ is NOT of the form $2^n 5^m$. Then $x$ has a decimal expansion which is:',
    options: ['Terminating', 'Non-terminating repeating', 'Non-terminating non-repeating', 'Undefined'],
    correctAnswer: 1,
    difficulty: 'hard',
    explanation: 'If the denominator contains factors other than 2 or 5, the decimal expansion is non-terminating repeating.'
  },
  {
    id: 10012,
    chapterId: 'g10-math-real',
    question: 'The product of a non-zero rational and an irrational number is:',
    options: ['Always rational', 'Always irrational', 'Rational or irrational', 'One'],
    correctAnswer: 1,
    difficulty: 'hard',
    explanation: 'The product of a non-zero rational number and an irrational number is always irrational.'
  },
  {
    id: 10013,
    chapterId: 'g10-math-real',
    question: 'If two positive integers $p$ and $q$ can be expressed as $p = ab^2$ and $q = a^3b$, where $a, b$ are prime numbers, then $LCM(p, q)$ is:',
    options: ['$ab$', '$a^2b^2$', '$a^3b^2$', '$a^3b^3$'],
    correctAnswer: 2,
    difficulty: 'hard',
    explanation: 'LCM is the product of the highest powers of all prime factors involved: $a^3$ and $b^2$.'
  },
  {
    id: 10014,
    chapterId: 'g10-math-real',
    question: 'What is the exponent of 2 in the prime factorization of 144?',
    options: ['2', '3', '4', '5'],
    correctAnswer: 2,
    difficulty: 'hard',
    explanation: '$144 = 12 \\times 12 = (2^2 \\times 3) \\times (2^2 \\times 3) = 2^4 \\times 3^2$.'
  },
  {
    id: 10015,
    chapterId: 'g10-math-real',
    question: 'If the HCF of 65 and 117 is expressible in the form $65m - 117$, then the value of $m$ is:',
    options: ['4', '2', '1', '3'],
    correctAnswer: 1,
    difficulty: 'hard',
    explanation: '$HCF(65, 117) = 13$. $65m - 117 = 13 \\implies 65m = 130 \\implies m = 2$.'
  },

  // Chapter 2: Polynomials
  {
    id: 10016,
    chapterId: 'g10-math-poly',
    question: 'A quadratic polynomial can have at most how many zeroes?',
    options: ['0', '1', '2', '3'],
    correctAnswer: 2,
    difficulty: 'easy',
    explanation: 'The number of zeroes of a polynomial is equal to its degree; for quadratic, it is 2.'
  },
  {
    id: 10017,
    chapterId: 'g10-math-poly',
    question: 'The zeroes of the polynomial $x^2 - 3$ are:',
    options: ['3, -3', '$\\sqrt{3}, -\\sqrt{3}$', '3, 0', '$\\sqrt{3}, 3$'],
    correctAnswer: 1,
    difficulty: 'easy',
    explanation: '$x^2 - 3 = 0 \\implies x^2 = 3 \\implies x = \\pm \\sqrt{3}$.'
  },
  {
    id: 10018,
    chapterId: 'g10-math-poly',
    question: 'If $\\alpha$ and $\\beta$ are zeroes of $ax^2 + bx + c$, then $\\alpha + \\beta$ is:',
    options: ['$-b/a$', '$c/a$', '$b/a$', '$-c/a$'],
    correctAnswer: 0,
    difficulty: 'easy',
    explanation: 'The sum of zeroes is given by the formula -coefficient of $x$ / coefficient of $x^2$.'
  },
  {
    id: 10019,
    chapterId: 'g10-math-poly',
    question: 'The degree of a linear polynomial is:',
    options: ['0', '1', '2', '3'],
    correctAnswer: 1,
    difficulty: 'easy',
    explanation: 'A linear polynomial is of the form $ax+b$, where the highest power of $x$ is 1.'
  },
  {
    id: 10020,
    chapterId: 'g10-math-poly',
    question: 'The value of $p(x) = x^2 - 3x - 4$ at $x = -1$ is:',
    options: ['0', '1', '2', '3'],
    correctAnswer: 0,
    difficulty: 'easy',
    explanation: '$(-1)^2 - 3(-1) - 4 = 1 + 3 - 4 = 0$.'
  },
  {
    id: 10021,
    chapterId: 'g10-math-poly',
    question: 'If one zero of the quadratic polynomial $x^2 + 3x + k$ is 2, then the value of $k$ is:',
    options: ['10', '-10', '5', '-5'],
    correctAnswer: 1,
    difficulty: 'medium',
    explanation: 'Substitute $x=2$: $(2)^2 + 3(2) + k = 0 \\implies 4 + 6 + k = 0 \\implies k = -10$.'
  },
  {
    id: 10022,
    chapterId: 'g10-math-poly',
    question: 'A quadratic polynomial whose zeroes are -3 and 4 is:',
    options: ['$x^2 - x + 12$', '$x^2 + x + 12$', '$x^2 - x - 12$', '$x^2 + x - 12$'],
    correctAnswer: 2,
    difficulty: 'medium',
    explanation: 'Sum = 1, Product = -12. Formula: $x^2 - (Sum)x + Product = x^2 - x - 12$.'
  },
  {
    id: 10023,
    chapterId: 'g10-math-poly',
    question: 'If the zeroes of the quadratic polynomial $x^2 + (a+1)x + b$ are 2 and -3, then:',
    options: ['$a=-7, b=-1$', '$a=5, b=-1$', '$a=2, b=-6$', '$a=0, b=-6$'],
    correctAnswer: 3,
    difficulty: 'medium',
    explanation: 'Sum $2-3 = -1 = -(a+1) \\implies a=0$. Product $2 \\times -3 = -6 = b$.'
  },
  {
    id: 10024,
    chapterId: 'g10-math-poly',
    question: 'The number of polynomials having zeroes as -2 and 5 is:',
    options: ['1', '2', '3', 'More than 3'],
    correctAnswer: 3,
    difficulty: 'medium',
    explanation: 'For any constant $k$, $k(x^2 - 3x - 10)$ will have the same zeroes.'
  },
  {
    id: 10025,
    chapterId: 'g10-math-poly',
    question: 'If the product of zeroes of $ax^2 - 6x - 6$ is 4, find the value of $a$.',
    options: ['-3/2', '3/2', '1', '2'],
    correctAnswer: 0,
    difficulty: 'medium',
    explanation: 'Product = $c/a = -6/a = 4 \\implies a = -6/4 = -3/2$.'
  },
  {
    id: 10026,
    chapterId: 'g10-math-poly',
    question: 'If $\\alpha, \\beta$ are zeroes of $x^2 - p(x+1) - c$ such that $(\\alpha+1)(\\beta+1) = 0$, then $c$ is:',
    options: ['1', '0', '-1', '2'],
    correctAnswer: 0,
    difficulty: 'hard',
    explanation: 'Expand: $\\alpha\\beta + \\alpha + \\beta + 1 = 0$. Substituting values from $x^2 - px - (p+c)$ gives $-(p+c) + p + 1 = 0 \\implies c = 1$.'
  },
  {
    id: 10027,
    chapterId: 'g10-math-poly',
    question: 'If one zero of $3x^2 + 8x + k$ is the reciprocal of the other, then $k$ is:',
    options: ['3', '-3', '1/3', '-1/3'],
    correctAnswer: 0,
    difficulty: 'hard',
    explanation: 'Product of zeroes $\\alpha \\times (1/\\alpha) = 1$. So $k/3 = 1 \\implies k = 3$.'
  },
  {
    id: 10028,
    chapterId: 'g10-math-poly',
    question: 'If the sum of the zeroes of $kx^2 + 2x + 3k$ is equal to their product, then $k$ is:',
    options: ['1/3', '-1/3', '2/3', '-2/3'],
    correctAnswer: 3,
    difficulty: 'hard',
    explanation: 'Sum = $-2/k$, Product = $3k/k = 3$. Setting $-2/k = 3$ gives $k = -2/3$.'
  },
  {
    id: 10029,
    chapterId: 'g10-math-poly',
    question: 'The zeroes of $x^2 + 99x + 127$ are:',
    options: ['Both positive', 'Both negative', 'One positive, one negative', 'Both equal'],
    correctAnswer: 1,
    difficulty: 'hard',
    explanation: 'Since $a, b, c$ are all positive, the sum of zeroes is negative and product is positive, implying both roots are negative.'
  },
  {
    id: 10030,
    chapterId: 'g10-math-poly',
    question: 'If $\\alpha, \\beta$ are zeroes of $x^2 + x + 1$, then $1/\\alpha + 1/\\beta$ is:',
    options: ['1', '-1', '0', 'None'],
    correctAnswer: 1,
    difficulty: 'hard',
    explanation: '$1/\\alpha + 1/\\beta = (\\alpha+\\beta)/(\\alpha\\beta) = -1/1 = -1$.'
  },

  // Chapter 3: Pair of Linear Equations in Two Variables
  {
    id: 10031,
    chapterId: 'g10-math-lineq',
    question: 'If a pair of linear equations is consistent, then the lines will be:',
    options: ['Parallel', 'Always coincident', 'Intersecting or coincident', 'Always intersecting'],
    correctAnswer: 2,
    difficulty: 'easy',
    explanation: 'Consistent means at least one solution, which happens for intersecting (one) or coincident (infinite) lines.'
  },
  {
    id: 10032,
    chapterId: 'g10-math-lineq',
    question: 'The pair of equations $y=0$ and $y=-7$ has:',
    options: ['One solution', 'Two solutions', 'Infinitely many solutions', 'No solution'],
    correctAnswer: 3,
    difficulty: 'easy',
    explanation: 'These are two horizontal lines at different heights; they are parallel and never intersect.'
  },
  {
    id: 10033,
    chapterId: 'g10-math-lineq',
    question: 'The value of $k$ for which the equations $x+2y=3$ and $5x+ky+7=0$ are parallel is:',
    options: ['10', '6', '2', '1'],
    correctAnswer: 0,
    difficulty: 'easy',
    explanation: 'For parallel lines, $a_1/a_2 = b_1/b_2$. So $1/5 = 2/k \\implies k = 10$.'
  },
  {
    id: 10034,
    chapterId: 'g10-math-lineq',
    question: 'The solution of $x-y=2$ and $x+y=4$ is:',
    options: ['$x=3, y=1$', '$x=1, y=3$', '$x=3, y=3$', '$x=1, y=1$'],
    correctAnswer: 0,
    difficulty: 'easy',
    explanation: 'Adding the equations gives $2x=6 \\implies x=3$. Substituting $x=3$ gives $y=1$.'
  },
  {
    id: 10035,
    chapterId: 'g10-math-lineq',
    question: 'A pair of linear equations which has no solution is called:',
    options: ['Consistent', 'Inconsistent', 'Dependent', 'Independent'],
    correctAnswer: 1,
    difficulty: 'easy',
    explanation: 'Inconsistent systems are those where the lines are parallel and have no common intersection point.'
  },
  {
    id: 10036,
    chapterId: 'g10-math-lineq',
    question: 'For what value of $k$ do the equations $3x-y+8=0$ and $6x-ky=-16$ represent coincident lines?',
    options: ['1/2', '-1/2', '2', '-2'],
    correctAnswer: 2,
    difficulty: 'medium',
    explanation: 'For coincident lines, $3/6 = -1/-k = 8/16$. All ratios equal 1/2, so $k=2$.'
  },
  {
    id: 10037,
    chapterId: 'g10-math-lineq',
    question: 'If $x=a, y=b$ is the solution of $x-y=2$ and $x+y=4$, then $a$ and $b$ are:',
    options: ['3, 5', '5, 3', '3, 1', '-1, -3'],
    correctAnswer: 2,
    difficulty: 'medium',
    explanation: 'Summing gives $2x=6 \\implies x=3$. Subtracting gives $2y=2 \\implies y=1$.'
  },
  {
    id: 10038,
    chapterId: 'g10-math-lineq',
    question: 'Aruna has only $\\$1 and $\\$2 coins with her. Total coins are 50 and amount is $\\$75. Number of $\\$1 and $\\$2 coins are:',
    options: ['35, 15', '25, 25', '15, 35', '20, 30'],
    correctAnswer: 1,
    difficulty: 'medium',
    explanation: '$x+y=50$ and $x+2y=75$. Subtracting first from second gives $y=25$, so $x=25$.'
  },
  {
    id: 10039,
    chapterId: 'g10-math-lineq',
    question: 'The father’s age is six times his son’s age. Four years hence, the father will be four times his son’s age. Current ages are:',
    options: ['30, 5', '36, 6', '24, 4', '42, 7'],
    correctAnswer: 1,
    difficulty: 'medium',
    explanation: '$F=6S$. Four years later: $(6S+4)=4(S+4) \\implies 2S=12 \\implies S=6, F=36$.'
  },
  {
    id: 10040,
    chapterId: 'g10-math-lineq',
    question: 'The pair of equations $ax+by+c=0$ and $dx+ey+f=0$ has a unique solution if:',
    options: ['$ae = bd$', '$ae \\ne bd$', '$af = cd$', '$ab = de$'],
    correctAnswer: 1,
    difficulty: 'medium',
    explanation: 'Unique solution condition is $a/d \\ne b/e$, which cross-multiplies to $ae \\ne bd$.'
  },
  {
    id: 10041,
    chapterId: 'g10-math-lineq',
    question: 'If $217x + 131y = 913$ and $131x + 217y = 827$, then $x+y$ is:',
    options: ['5', '6', '7', '8'],
    correctAnswer: 0,
    difficulty: 'hard',
    explanation: 'Add the two equations: $348x + 348y = 1740$. Dividing by 348 gives $x+y=5$.'
  },
  {
    id: 10042,
    chapterId: 'g10-math-lineq',
    question: 'A fraction becomes 1/3 when 1 is subtracted from numerator and it becomes 1/4 when 8 is added to denominator. The fraction is:',
    options: ['4/12', '5/12', '7/12', '3/12'],
    correctAnswer: 1,
    difficulty: 'hard',
    explanation: '$(x-1)/y = 1/3 \\implies 3x-y=3$. $x/(y+8) = 1/4 \\implies 4x-y=8$. Solving gives $x=5, y=12$.'
  },
  {
    id: 10043,
    chapterId: 'g10-math-lineq',
    question: 'Two numbers are in the ratio 5:6. If 8 is subtracted from each, the ratio becomes 4:5. The numbers are:',
    options: ['40, 48', '35, 42', '45, 54', '50, 60'],
    correctAnswer: 0,
    difficulty: 'hard',
    explanation: 'Let numbers be $5x, 6x$. $(5x-8)/(6x-8) = 4/5 \\implies 25x-40 = 24x-32 \\implies x=8$. Numbers are 40, 48.'
  },
  {
    id: 10044,
    chapterId: 'g10-math-lineq',
    question: 'The area of a rectangle gets reduced by 9 units if length is reduced by 5 and breadth increased by 3. If we increase length by 3 and breadth by 2, area increases by 67. Length is:',
    options: ['17', '16', '15', '14'],
    correctAnswer: 0,
    difficulty: 'hard',
    explanation: '$(x-5)(y+3) = xy-9 \\implies 3x-5y=6$. $(x+3)(y+2) = xy+67 \\implies 2x+3y=61$. Solving gives $x=17$.'
  },
  {
    id: 10045,
    chapterId: 'g10-math-lineq',
    question: 'For what value of $k$ will the system $kx+3y=k-3$ and $12x+ky=k$ have no solution?',
    options: ['6', '-6', '0', 'None'],
    correctAnswer: 1,
    difficulty: 'hard',
    explanation: '$k/12 = 3/k \\implies k^2=36 \\implies k= \\pm 6$. For $k=-6$, the third ratio is different, making it no solution.'
  },

  // Chapter 4: Quadratic Equations
  {
    id: 10046,
    chapterId: 'g10-math-quad',
    question: 'Which of the following is a quadratic equation?',
    options: ['$x^2 + 2x + 1 = (4-x)^2 + 3$', '$x^3 - x^2 = (x-1)^3$', '$x^2+3x+1=0$', 'All of these'],
    correctAnswer: 2,
    difficulty: 'easy',
    explanation: 'A quadratic equation must have $x^2$ as its highest degree after simplification.'
  },
  {
    id: 10047,
    chapterId: 'g10-math-quad',
    question: 'If the discriminant of a quadratic equation is greater than zero, the roots are:',
    options: ['Real and equal', 'Real and distinct', 'No real roots', 'Imaginary'],
    correctAnswer: 1,
    difficulty: 'easy',
    explanation: '$D > 0$ indicates two different real solutions.'
  },
  {
    id: 10048,
    chapterId: 'g10-math-quad',
    question: 'The roots of $x^2 - 0.04 = 0$ are:',
    options: ['$\\pm 0.2$', '$\\pm 0.02$', '0.4', '2'],
    correctAnswer: 0,
    difficulty: 'easy',
    explanation: '$x^2 = 0.04 \\implies x = \\pm \\sqrt{0.04} = \\pm 0.2$.'
  },
  {
    id: 10049,
    chapterId: 'g10-math-quad',
    question: 'What is the discriminant of $x^2 - 4x + 4 = 0$?',
    options: ['16', '8', '0', '-16'],
    correctAnswer: 2,
    difficulty: 'easy',
    explanation: '$D = b^2 - 4ac = (-4)^2 - 4(1)(4) = 16 - 16 = 0$.'
  },
  {
    id: 10050,
    chapterId: 'g10-math-quad',
    question: 'If 1/2 is a root of $x^2 + kx - 5/4 = 0$, then $k$ is:',
    options: ['2', '-2', '1', '1/2'],
    correctAnswer: 0,
    difficulty: 'easy',
    explanation: '$(1/2)^2 + k(1/2) - 5/4 = 0 \\implies 1/4 + k/2 - 5/4 = 0 \\implies k/2 = 1 \\implies k=2$.'
  },
  {
    id: 10051,
    chapterId: 'g10-math-quad',
    question: 'The values of $k$ for which the equation $2x^2 - kx + k = 0$ has equal roots is:',
    options: ['0 only', '4', '8 only', '0, 8'],
    correctAnswer: 3,
    difficulty: 'medium',
    explanation: '$D=0 \\implies k^2 - 4(2)(k) = 0 \\implies k(k-8) = 0$, so $k=0$ or $k=8$.'
  },
  {
    id: 10052,
    chapterId: 'g10-math-quad',
    question: 'The sum of the squares of two consecutive natural numbers is 313. The numbers are:',
    options: ['12, 13', '13, 14', '11, 12', '14, 15'],
    correctAnswer: 0,
    difficulty: 'medium',
    explanation: '$x^2 + (x+1)^2 = 313 \\implies 2x^2 + 2x - 312 = 0 \\implies x^2 + x - 156 = 0$. Roots are 12 and -13.'
  },
  {
    id: 10053,
    chapterId: 'g10-math-quad',
    question: 'If the roots of $ax^2+bx+c=0$ are reciprocal to each other, then:',
    options: ['$a=b$', '$b=c$', '$c=a$', '$a=0$'],
    correctAnswer: 2,
    difficulty: 'medium',
    explanation: 'Product of roots $\\alpha \\times (1/\\alpha) = 1$. Since Product = $c/a$, then $c/a = 1 \\implies c=a$.'
  },
  {
    id: 10054,
    chapterId: 'g10-math-quad',
    question: 'The roots of the equation $2x^2 - x - 6 = 0$ are:',
    options: ['-2, 3/2', '2, -3/2', '-2, -3/2', '2, 3/2'],
    correctAnswer: 1,
    difficulty: 'medium',
    explanation: 'Factorizing: $2x^2 - 4x + 3x - 6 = 0 \\implies 2x(x-2) + 3(x-2) = 0$. Roots are 2, -3/2.'
  },
  {
    id: 10055,
    chapterId: 'g10-math-quad',
    question: 'A natural number, when increased by 12, equals 160 times its reciprocal. The number is:',
    options: ['3', '8', '4', '7'],
    correctAnswer: 1,
    difficulty: 'medium',
    explanation: '$x + 12 = 160/x \\implies x^2 + 12x - 160 = 0 \\implies (x+20)(x-8)=0$. Natural number is 8.'
  },
  {
    id: 10056,
    chapterId: 'g10-math-quad',
    question: 'If $\\sin \\theta$ and $\\cos \\theta$ are the roots of $ax^2 + bx + c = 0$, then $b^2$ is:',
    options: ['$a^2+2ac$', '$a^2-2ac$', '$a+c$', '$a^2+ac$'],
    correctAnswer: 0,
    difficulty: 'hard',
    explanation: '$(\\sin+\\cos)^2 = \\sin^2+\\cos^2+2\\sin\\cos \\implies (-b/a)^2 = 1 + 2(c/a) \\implies b^2/a^2 = (a+2c)/a \\implies b^2 = a^2+2ac$.'
  },
  {
    id: 10057,
    chapterId: 'g10-math-quad',
    question: 'The roots of the equation $(b-c)x^2 + (c-a)x + (a-b) = 0$ are equal. Then $2b$ is equal to:',
    options: ['$a+c$', '$a-c$', '$c-a$', 'None'],
    correctAnswer: 0,
    difficulty: 'hard',
    explanation: 'The sum of coefficients is 0, so $x=1$ is a root. Since roots are equal, both are 1. Product $(a-b)/(b-c) = 1 \\implies a-b = b-c \\implies 2b = a+c$.'
  },
  {
    id: 10058,
    chapterId: 'g10-math-quad',
    question: 'If the root of $x^2 - kx + 1 = 0$ are not real, then $k$ lies in:',
    options: ['(-2, 2)', '(-infinity, -2)', '(2, infinity)', 'None'],
    correctAnswer: 0,
    difficulty: 'hard',
    explanation: '$D < 0 \\implies k^2 - 4 < 0 \\implies k^2 < 4 \\implies -2 < k < 2$.'
  },
  {
    id: 10059,
    chapterId: 'g10-math-quad',
    question: 'The ratio of sum and product of the roots of $7x^2 - 12x + 18 = 0$ is:',
    options: ['7:12', '2:3', '3:2', '7:18'],
    correctAnswer: 1,
    difficulty: 'hard',
    explanation: 'Sum = 12/7, Product = 18/7. Ratio = (12/7) / (18/7) = 12/18 = 2/3.'
  },
  {
    id: 10060,
    chapterId: 'g10-math-quad',
    question: 'Find $k$ if $x^2 - (k+6)x + 2(2k-1) = 0$ has sum of roots equal to half their product.',
    options: ['7', '6', '5', '4'],
    correctAnswer: 0,
    difficulty: 'hard',
    explanation: '$(k+6) = 1/2 \\times 2(2k-1) \\implies k+6 = 2k-1 \\implies k=7$.'
  }
];
