export type OnboardingQuestion = {
    id: number;
    text: string;
    type: 'single-choice' | 'multi-select' | 'slider' | 'date';
    firestoreField: string;
    options?: { label: string; value: string }[];
  };
  
  export const onboardingQuestions: OnboardingQuestion[] = [
    {
      id: 1,
      text: "What grade are you in?",
      type: 'single-choice',
      firestoreField: 'grade',
      options: [
        { label: "Class 9", value: "9" },
        { label: "Class 10", value: "10" },
        { label: "Class 11", value: "11" },
        { label: "Class 12", value: "12" },
      ],
    },
    {
        id: 2,
        text: "Which subject troubles you the most?",
        type: 'single-choice',
        firestoreField: 'troublingSubject',
        options: [
          { label: "Mathematics", value: "math" },
          { label: "Physics", value: "phy" },
          { label: "Chemistry", value: "chem" },
          { label: "Biology", value: "bio" },
        ],
    },
    {
      id: 3,
      text: "How much time can you study daily?",
      type: 'single-choice',
      firestoreField: 'studyTime',
      options: [
        { label: "Less than 30 minutes", value: "<30m" },
        { label: "30-60 minutes", value: "30-60m" },
        { label: "1-2 hours", value: "1-2h" },
        { label: "More than 2 hours", value: ">2h" },
      ],
    },
    {
        id: 4,
        text: "When do you usually study?",
        type: 'multi-select',
        firestoreField: 'studySchedule',
        options: [
          { label: "Morning", value: "morning" },
          { label: "Afternoon", value: "afternoon" },
          { label: "Evening", value: "evening" },
          { label: "Night", value: "night" },
        ],
    },
    {
        id: 5,
        text: "How difficult is your biggest problem right now?",
        type: 'slider',
        firestoreField: 'difficulty',
    },
    {
      id: 6,
      text: "When is your next exam?",
      type: 'date',
      firestoreField: 'nextExamDate',
    },
  ];
  