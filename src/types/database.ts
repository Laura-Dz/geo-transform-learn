// Database Types - Generated from Prisma Schema

export type Role = 'STUDENT' | 'TEACHER' | 'ADMIN';
export type SkillLevel = 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED' | 'EXPERT';
export type Difficulty = 'EASY' | 'MEDIUM' | 'HARD' | 'EXPERT';
export type Category = 'ALGEBRA' | 'GEOMETRY' | 'CALCULUS' | 'TRIGONOMETRY' | 'STATISTICS' | 'LINEAR_ALGEBRA' | 'DIFFERENTIAL_EQUATIONS';
export type QuestionType = 'MULTIPLE_CHOICE' | 'TRUE_FALSE' | 'SHORT_ANSWER' | 'EQUATION_INPUT' | 'GRAPH_INTERPRETATION';
export type ProgressStatus = 'NOT_STARTED' | 'IN_PROGRESS' | 'COMPLETED' | 'MASTERED';
export type AchievementCategory = 'LEARNING' | 'PRACTICE' | 'SOCIAL' | 'MILESTONE' | 'STREAK';

export interface User {
  id: string;
  email: string;
  name: string;
  password: string;
  role: Role;
  avatar?: string;
  createdAt: string;
  updatedAt: string;
  profile?: UserProfile;
  progress?: Progress[];
  quizAttempts?: QuizAttempt[];
  achievements?: UserAchievement[];
  aiInteractions?: AIInteraction[];
  savedFunctions?: SavedFunction[];
  studySessions?: StudySession[];
}

export interface UserProfile {
  id: string;
  userId: string;
  bio?: string;
  learningGoals?: string;
  preferredTopics: string[];
  skillLevel: SkillLevel;
  totalStudyTime: number;
  streakDays: number;
  lastActiveDate: string;
  settings?: any;
  createdAt: string;
  updatedAt: string;
  user: User;
}

export interface Concept {
  id: string;
  title: string;
  description: string;
  content: string;
  difficulty: Difficulty;
  category: Category;
  tags: string[];
  prerequisites: string[];
  estimatedTime: number;
  isPublished: boolean;
  createdAt: string;
  updatedAt: string;
  examples?: ConceptExample[];
  quizzes?: Quiz[];
  progress?: Progress[];
}

export interface ConceptExample {
  id: string;
  conceptId: string;
  title: string;
  description?: string;
  functionExpression: string;
  parameters?: any;
  explanation: string;
  createdAt: string;
  concept: Concept;
}

export interface Quiz {
  id: string;
  conceptId: string;
  title: string;
  description?: string;
  difficulty: Difficulty;
  timeLimit?: number;
  isPublished: boolean;
  createdAt: string;
  updatedAt: string;
  concept: Concept;
  questions?: QuizQuestion[];
  attempts?: QuizAttempt[];
}

export interface QuizQuestion {
  id: string;
  quizId: string;
  question: string;
  questionType: QuestionType;
  options?: any;
  correctAnswer: string;
  explanation?: string;
  points: number;
  order: number;
  createdAt: string;
  quiz: Quiz;
  answers?: QuizAnswer[];
}

export interface QuizAttempt {
  id: string;
  userId: string;
  quizId: string;
  score: number;
  maxScore: number;
  timeSpent: number;
  completedAt: string;
  createdAt: string;
  user: User;
  quiz: Quiz;
  answers?: QuizAnswer[];
}

export interface QuizAnswer {
  id: string;
  attemptId: string;
  questionId: string;
  userAnswer: string;
  isCorrect: boolean;
  timeSpent: number;
  createdAt: string;
  attempt: QuizAttempt;
  question: QuizQuestion;
}

export interface Progress {
  id: string;
  userId: string;
  conceptId: string;
  status: ProgressStatus;
  completion: number;
  timeSpent: number;
  lastAccessed: string;
  createdAt: string;
  updatedAt: string;
  user: User;
  concept: Concept;
}

export interface StudySession {
  id: string;
  userId: string;
  startTime: string;
  endTime?: string;
  duration?: number;
  activitiesCount: number;
  conceptsStudied: string[];
  createdAt: string;
  user: User;
}

export interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  category: AchievementCategory;
  criteria: any;
  points: number;
  isActive: boolean;
  createdAt: string;
  userAchievements?: UserAchievement[];
}

export interface UserAchievement {
  id: string;
  userId: string;
  achievementId: string;
  unlockedAt: string;
  progress: number;
  user: User;
  achievement: Achievement;
}

export interface AIInteraction {
  id: string;
  userId: string;
  question: string;
  response: string;
  context?: any;
  feedback?: string;
  rating?: number;
  createdAt: string;
  user: User;
}

export interface SavedFunction {
  id: string;
  userId: string;
  name: string;
  expression: string;
  description?: string;
  parameters?: any;
  category?: string;
  tags: string[];
  isPublic: boolean;
  createdAt: string;
  updatedAt: string;
  user: User;
}
