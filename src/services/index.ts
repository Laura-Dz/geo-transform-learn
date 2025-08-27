// Services Index - Centralized exports for all services
export { AuthService } from './AuthService';
export { QuizService, quizService } from './QuizService';
export { ChallengeService, challengeService } from './ChallengeService';
export { PracticeService, practiceService } from './PracticeService';
export { ConceptService, conceptService } from './ConceptService';
export { AchievementService, achievementService } from './AchievementService';
export { default as ProfileService, profileService } from './ProfileService';

// Import instances for re-export
import { quizService } from './QuizService';
import { challengeService } from './ChallengeService';
import { practiceService } from './PracticeService';
import { conceptService } from './ConceptService';
import { achievementService } from './AchievementService';
import { profileService } from './ProfileService';

// Re-export singleton instances for convenience
export const services = {
  quiz: quizService,
  challenge: challengeService,
  practice: practiceService,
  concept: conceptService,
  achievement: achievementService,
  profile: profileService,
} as const;
