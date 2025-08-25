// Enhanced Quiz System Types

export interface QuizQuestion {
  id: string;
  type: 'multiple-choice' | 'graph-identification' | 'transformation-match' | 'prediction';
  difficulty: 'easy' | 'moderate' | 'advanced';
  category: 'transformation' | 'function-type' | 'prediction' | 'conceptual';
  question: string;
  functionExpression?: string;
  transformations?: {
    translation: { x: number; y: number; z: number };
    rotation: { x: number; y: number; z: number };
    scale: { x: number; y: number; z: number };
  };
  options: QuizOption[];
  correctAnswer: string;
  explanation: string;
  hint?: string;
  timeLimit?: number; // seconds
  points: number;
}

export interface QuizOption {
  id: string;
  text: string;
  functionExpression?: string;
  transformations?: any;
}

export interface QuizSession {
  id: string;
  questions: QuizQuestion[];
  currentQuestionIndex: number;
  answers: QuizAnswer[];
  startTime: Date;
  endTime?: Date;
  isTimedMode: boolean;
  totalTimeLimit?: number;
  score: number;
  maxScore: number;
  adaptiveDifficulty: boolean;
}

export interface QuizAnswer {
  questionId: string;
  selectedAnswer: string;
  isCorrect: boolean;
  timeSpent: number;
  hintsUsed: number;
}

export interface QuizResult {
  sessionId: string;
  totalQuestions: number;
  correctAnswers: number;
  score: number;
  accuracy: number;
  averageTimePerQuestion: number;
  categoryBreakdown: Record<string, { correct: number; total: number }>;
  difficultyProgression: string[];
  badgesEarned: string[];
  recommendations: string[];
}

// Challenge System Types
export interface Challenge {
  id: string;
  title: string;
  description: string;
  type: 'match-target' | 'reconstruction' | 'creative-design' | 'optimization';
  difficulty: 'beginner' | 'intermediate' | 'advanced' | 'expert';
  category: string;
  targetGraph?: {
    functionExpression: string;
    transformations: any;
  };
  constraints?: {
    maxTransformations?: number;
    allowedTransformations?: string[];
    timeLimit?: number;
  };
  scenario?: string;
  realWorldContext?: string;
  hints: string[];
  solution?: {
    steps: ChallengeStep[];
    explanation: string;
  };
  points: number;
  unlockRequirements?: string[];
}

export interface ChallengeStep {
  id: string;
  type: 'transformation' | 'function-change' | 'parameter-adjustment';
  description: string;
  transformations?: any;
  functionExpression?: string;
}

export interface ChallengeSubmission {
  challengeId: string;
  steps: ChallengeStep[];
  finalFunction: string;
  finalTransformations: any;
  timeSpent: number;
  hintsUsed: number;
  isCorrect: boolean;
  efficiency: number; // 0-1 score based on minimal steps
  creativity: number; // 0-1 score for unique solutions
}

// Practice Mode Types
export interface PracticeScenario {
  id: string;
  title: string;
  description: string;
  context: 'physics' | 'biology' | 'economics' | 'engineering' | 'music' | 'sports';
  realWorldExample: string;
  imageUrl?: string;
  animationUrl?: string;
  guidedSteps: PracticeStep[];
  reflectionPrompts: string[];
  unlockRequirements?: string[];
  nextScenarios?: string[];
}

export interface PracticeStep {
  id: string;
  title: string;
  instruction: string;
  type: 'identify-function' | 'choose-transformation' | 'visualize' | 'interpret';
  interactiveElements?: {
    allowGraphRotation?: boolean;
    showAnnotationTools?: boolean;
    highlightKeyPoints?: boolean;
  };
  expectedAnswer?: string;
  feedback: {
    correct: string;
    incorrect: string;
    hint: string;
  };
}

export interface PracticeProgress {
  scenarioId: string;
  completedSteps: string[];
  reflectionAnswers: Record<string, string>;
  timeSpent: number;
  isCompleted: boolean;
  score: number;
  insights: string[];
}

// Badge System
export interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
  category: 'accuracy' | 'speed' | 'streak' | 'creativity' | 'progress';
  requirements: {
    type: string;
    threshold: number;
    timeframe?: string;
  };
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
  points: number;
}

// Analytics Types
export interface QuizAnalytics {
  totalQuizzesTaken: number;
  averageScore: number;
  accuracyByCategory: Record<string, number>;
  timeSpentByDifficulty: Record<string, number>;
  improvementTrend: { date: string; score: number }[];
  weakAreas: string[];
  strongAreas: string[];
  recommendedTopics: string[];
}
