export type OnboardingQuestion = {
    id: number;
    text: string;
    type: 'single-choice' | 'multi-select' | 'slider';
    firestoreField: string;
    options?: { label: string; value: string }[];
  };
  
  export const onboardingQuestions: OnboardingQuestion[] = [
    {
      id: 1,
      text: "Which class are you in?",
      type: 'single-choice',
      firestoreField: 'class',
      options: [
        { label: "Class 9", value: "9" },
        { label: "Class 10", value: "10" },
        { label: "Class 11", value: "11" },
        { label: "Class 12", value: "12" },
      ],
    },
    {
      id: 2,
      text: "Which exam are you preparing for?",
      type: 'single-choice',
      firestoreField: 'exam',
      options: [
        { label: "School/Board Exams", value: "board" },
        { label: "JEE (Engineering)", value: "jee" },
        { label: "NEET (Medical)", value: "neet" },
        { label: "Other", value: "other" },
      ],
    },
    {
      id: 3,
      text: "What do you struggle with the most?",
      type: 'multi-select',
      firestoreField: 'weakAreas',
      options: [
        { label: "Understanding concepts", value: "concepts" },
        { label: "Solving problems", value: "problem-solving" },
        { label: "Remembering formulas", value: "formulas" },
        { label: "Time management", value: "time-management" },
      ],
    },
    {
        id: 4,
        text: "How confident are you with formulas?",
        type: 'slider',
        firestoreField: 'confidenceLevel',
    },
    {
      id: 5,
      text: "How much time can you study daily?",
      type: 'single-choice',
      firestoreField: 'dailyStudyTime',
      options: [
        { label: "Less than 30 minutes", value: "<30m" },
        { label: "30-60 minutes", value: "30-60m" },
        { label: "1-2 hours", value: "1-2h" },
        { label: "More than 2 hours", value: ">2h" },
      ],
    },
  ];
  