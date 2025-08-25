import { QuizQuestion, Challenge, PracticeScenario, Badge } from '@/types/quiz';

// Enhanced Quiz Questions with Dynamic 3D Rendering
export const QUIZ_QUESTIONS: QuizQuestion[] = [
  // Easy Level - Basic Transformations
  {
    id: 'q1',
    type: 'multiple-choice',
    difficulty: 'easy',
    category: 'transformation',
    question: 'What transformation moves the graph f(x) = x² to f(x) = x² + 3?',
    functionExpression: 'x^2',
    transformations: {
      translation: { x: 0, y: 3, z: 0 },
      rotation: { x: 0, y: 0, z: 0 },
      scale: { x: 1, y: 1, z: 1 }
    },
    options: [
      { id: 'a', text: 'Translation up by 3 units' },
      { id: 'b', text: 'Translation down by 3 units' },
      { id: 'c', text: 'Horizontal stretch by factor 3' },
      { id: 'd', text: 'Vertical compression by factor 3' }
    ],
    correctAnswer: 'a',
    explanation: 'Adding a constant to a function translates the graph vertically. f(x) + 3 moves the graph up by 3 units.',
    hint: 'Look at what happens to the y-values when you add a constant.',
    timeLimit: 60,
    points: 10
  },
  {
    id: 'q2',
    type: 'graph-identification',
    difficulty: 'easy',
    category: 'function-type',
    question: 'Which function type creates this 3D surface?',
    functionExpression: 'x^2 + y^2',
    options: [
      { id: 'a', text: 'Linear function' },
      { id: 'b', text: 'Quadratic paraboloid' },
      { id: 'c', text: 'Trigonometric function' },
      { id: 'd', text: 'Exponential function' }
    ],
    correctAnswer: 'b',
    explanation: 'The function f(x,y) = x² + y² creates a paraboloid opening upward, which is a quadratic surface.',
    points: 15
  },

  // Moderate Level - Complex Transformations
  {
    id: 'q3',
    type: 'transformation-match',
    difficulty: 'moderate',
    category: 'transformation',
    question: 'Match the transformation sequence that converts sin(x) to -2sin(x-π/2) + 1',
    functionExpression: 'sin(x)',
    options: [
      { id: 'a', text: '1. Reflect over x-axis, 2. Vertical stretch by 2, 3. Translate right π/2, 4. Translate up 1' },
      { id: 'b', text: '1. Translate right π/2, 2. Vertical stretch by 2, 3. Reflect over x-axis, 4. Translate up 1' },
      { id: 'c', text: '1. Vertical stretch by 2, 2. Translate right π/2, 3. Reflect over x-axis, 4. Translate up 1' },
      { id: 'd', text: '1. Translate up 1, 2. Reflect over x-axis, 3. Vertical stretch by 2, 4. Translate right π/2' }
    ],
    correctAnswer: 'b',
    explanation: 'The correct order is: translate right π/2, stretch vertically by 2, reflect over x-axis, then translate up 1.',
    hint: 'Work from the inside of the function outward: f(x-h) → af(x-h) → -af(x-h) → -af(x-h) + k',
    timeLimit: 120,
    points: 25
  },

  // Advanced Level - Prediction and Analysis
  {
    id: 'q4',
    type: 'prediction',
    difficulty: 'advanced',
    category: 'prediction',
    question: 'If f(x,y) = sin(x)cos(y) is scaled by (2, 0.5, 3), what happens to the wave pattern?',
    functionExpression: 'sin(x)*cos(y)',
    transformations: {
      translation: { x: 1, y: 0, z: 0 },
      rotation: { x: 0, y: 0, z: 0 },
      scale: { x: 2, y: 1, z: 1 }
    },
    options: [
      { id: 'a', text: 'Wavelength doubles in x, halves in y, amplitude triples' },
      { id: 'b', text: 'Wavelength halves in x, doubles in y, amplitude triples' },
      { id: 'c', text: 'Frequency doubles in x, halves in y, amplitude triples' },
      { id: 'd', text: 'Pattern compresses in x, stretches in y, amplitude triples' }
    ],
    correctAnswer: 'b',
    explanation: 'Scaling by (2, 0.5, 3) compresses the x-period by half, stretches the y-period by 2, and triples the amplitude.',
    timeLimit: 180,
    points: 40
  }
];

// Challenge Scenarios
export const CHALLENGES: Challenge[] = [
  {
    id: 'c1',
    title: 'Basketball Trajectory Match',
    description: 'Transform a basic parabola to match the trajectory of a basketball shot.',
    type: 'match-target',
    difficulty: 'beginner',
    category: 'sports-physics',
    targetGraph: {
      functionExpression: '-0.1*(x-5)^2 + 3',
      transformations: {
        translation: { x: 5, y: 3, z: 0 },
        scaling: { x: 1, y: 0.1, z: 1 },
        reflection: { x: false, y: true, z: false }
      }
    },
    constraints: {
      maxTransformations: 4,
      allowedTransformations: ['translation', 'scaling', 'reflection'],
      timeLimit: 300
    },
    scenario: 'A basketball player shoots from position (0,2) toward a hoop at (10,3). The ball follows a parabolic path.',
    hints: [
      'Start with a basic downward parabola',
      'Consider where the ball starts and ends',
      'Think about the peak of the trajectory'
    ],
    points: 50,
    unlockRequirements: ['complete-basic-transformations']
  },
  {
    id: 'c2',
    title: 'Sound Wave Designer',
    description: 'Create a complex waveform by combining and transforming basic trigonometric functions.',
    type: 'creative-design',
    difficulty: 'intermediate',
    category: 'music-physics',
    scenario: 'Design a sound wave that represents a musical chord (combination of frequencies).',
    realWorldContext: 'Musicians and audio engineers use wave interference to create rich, complex sounds.',
    constraints: {
      maxTransformations: 6,
      timeLimit: 600
    },
    hints: [
      'Combine multiple sine waves with different frequencies',
      'Use amplitude scaling to balance the components',
      'Consider phase shifts for interesting interference patterns'
    ],
    points: 100,
    unlockRequirements: ['complete-trigonometric-basics', 'score-80-percent-quiz']
  },
  {
    id: 'c3',
    title: 'Population Growth Reconstruction',
    description: 'Given the final population curve, determine the transformation sequence that created it.',
    type: 'reconstruction',
    difficulty: 'advanced',
    category: 'biology-math',
    targetGraph: {
      functionExpression: '1000*e^(0.05*x)',
      transformations: {
        translation: { x: 0, y: 0, z: 0 },
        scaling: { x: 0.05, y: 1000, z: 1 },
        reflection: { x: false, y: false, z: false }
      }
    },
    scenario: 'A biologist observed a population that started at 1000 and grew exponentially with a 5% growth rate.',
    hints: [
      'Identify the base exponential function',
      'Determine the growth rate from the curve steepness',
      'Find the initial population value'
    ],
    points: 150,
    unlockRequirements: ['complete-exponential-functions', 'advanced-quiz-badge']
  }
];

// Practice Scenarios
export const PRACTICE_SCENARIOS: PracticeScenario[] = [
  {
    id: 'p1',
    title: 'Modeling a Bouncing Ball',
    description: 'Learn how quadratic functions model projectile motion in real life.',
    context: 'physics',
    realWorldExample: 'When you drop a ball, its height over time follows a quadratic function due to gravity.',
    imageUrl: '/images/bouncing-ball.jpg',
    guidedSteps: [
      {
        id: 's1',
        title: 'Identify the Base Function',
        instruction: 'A ball dropped from height h follows the equation h(t) = -½gt² + h₀. What type of function is this?',
        type: 'identify-function',
        expectedAnswer: 'quadratic',
        feedback: {
          correct: 'Correct! The -½gt² term makes this a quadratic function.',
          incorrect: 'Look at the highest power of t in the equation.',
          hint: 'Focus on the t² term - what type of function has a squared variable?'
        }
      },
      {
        id: 's2',
        title: 'Apply Transformations',
        instruction: 'If the ball is dropped from 10 meters high, how does this transform the basic function h(t) = -½gt²?',
        type: 'choose-transformation',
        interactiveElements: {
          allowGraphRotation: true,
          showAnnotationTools: true
        },
        expectedAnswer: 'vertical translation up by 10',
        feedback: {
          correct: 'Excellent! Adding 10 translates the parabola upward.',
          incorrect: 'Think about what happens when you add a constant to a function.',
          hint: 'The initial height affects the y-intercept of the parabola.'
        }
      },
      {
        id: 's3',
        title: 'Interpret the Result',
        instruction: 'What does the vertex of this parabola represent in real life?',
        type: 'interpret',
        expectedAnswer: 'maximum height',
        feedback: {
          correct: 'Perfect! The vertex represents the maximum height the ball reaches.',
          incorrect: 'Consider what the highest point of the trajectory means.',
          hint: 'Think about when the ball stops moving upward and starts falling down.'
        }
      }
    ],
    reflectionPrompts: [
      'How would changing the initial height affect the graph?',
      'What would happen if we threw the ball upward instead of dropping it?',
      'How does air resistance change this model in real life?'
    ],
    unlockRequirements: ['complete-tutorial'],
    nextScenarios: ['p2', 'p3']
  },
  {
    id: 'p2',
    title: 'Heart Rate Monitoring',
    description: 'Use trigonometric functions to model periodic biological processes.',
    context: 'biology',
    realWorldExample: 'Heart rate, breathing, and brain waves all follow periodic patterns that can be modeled with sine and cosine functions.',
    guidedSteps: [
      {
        id: 's1',
        title: 'Identify the Pattern',
        instruction: 'A resting heart beats about 70 times per minute. What type of function best models this?',
        type: 'identify-function',
        expectedAnswer: 'trigonometric',
        feedback: {
          correct: 'Right! Periodic patterns like heartbeats are modeled with trigonometric functions.',
          incorrect: 'Think about the repeating nature of a heartbeat.',
          hint: 'What type of function repeats the same pattern over and over?'
        }
      }
    ],
    reflectionPrompts: [
      'How would exercise affect the frequency of this function?',
      'What other biological processes follow periodic patterns?'
    ],
    unlockRequirements: ['complete-p1']
  }
];

// Badge Definitions
export const BADGES: Badge[] = [
  {
    id: 'first-quiz',
    name: 'Quiz Rookie',
    description: 'Complete your first quiz',
    icon: '🎯',
    category: 'progress',
    requirements: { type: 'quizzes-completed', threshold: 1 },
    rarity: 'common',
    points: 10
  },
  {
    id: 'accuracy-master',
    name: 'Precision Expert',
    description: 'Achieve 90% accuracy on 5 consecutive quizzes',
    icon: '🎯',
    category: 'accuracy',
    requirements: { type: 'consecutive-accuracy', threshold: 0.9, timeframe: '5-quizzes' },
    rarity: 'rare',
    points: 50
  },
  {
    id: 'speed-demon',
    name: 'Lightning Fast',
    description: 'Complete a quiz in under 2 minutes with 80% accuracy',
    icon: '⚡',
    category: 'speed',
    requirements: { type: 'time-and-accuracy', threshold: 120 },
    rarity: 'epic',
    points: 75
  },
  {
    id: 'transformation-guru',
    name: 'Transformation Master',
    description: 'Perfect score on all transformation-related questions',
    icon: '🔄',
    category: 'accuracy',
    requirements: { type: 'category-mastery', threshold: 1.0 },
    rarity: 'legendary',
    points: 100
  },
  {
    id: 'creative-genius',
    name: 'Creative Problem Solver',
    description: 'Find unique solutions in 3 different challenges',
    icon: '💡',
    category: 'creativity',
    requirements: { type: 'creative-solutions', threshold: 3 },
    rarity: 'epic',
    points: 80
  },
  {
    id: 'streak-champion',
    name: 'Unstoppable',
    description: 'Maintain a 7-day learning streak',
    icon: '🔥',
    category: 'streak',
    requirements: { type: 'daily-streak', threshold: 7 },
    rarity: 'rare',
    points: 60
  }
];
