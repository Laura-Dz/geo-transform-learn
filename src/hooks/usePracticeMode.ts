
import { useState } from 'react';
import { Problem, UserTransformations } from '@/types/practice';
import { practiceProblems } from '@/data/practiceProblems';

export function usePracticeMode() {
  const [currentProblem, setCurrentProblem] = useState<Problem>(practiceProblems[0]);
  const [userAnswer, setUserAnswer] = useState('');
  const [attempts, setAttempts] = useState(0);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [userTransformations, setUserTransformations] = useState<UserTransformations>({
    translation: { x: 0, y: 0, z: 0 },
    scaling: { x: 1, y: 1, z: 1 },
    reflection: { x: false, y: false, z: false }
  });

  const checkAnswer = () => {
    const correct = userAnswer.toLowerCase().replace(/\s/g, '') === 
                   currentProblem.expectedAnswer.toLowerCase().replace(/\s/g, '');
    
    setIsCorrect(correct);
    setShowFeedback(true);
    setAttempts(prev => prev + 1);

    if (correct) {
      console.log('Correct answer! Awarding points...');
    }
  };

  const nextProblem = () => {
    const nextIndex = (practiceProblems.indexOf(currentProblem) + 1) % practiceProblems.length;
    setCurrentProblem(practiceProblems[nextIndex]);
    resetState();
  };

  const resetState = () => {
    setUserAnswer('');
    setAttempts(0);
    setIsCorrect(null);
    setShowFeedback(false);
    setUserTransformations({
      translation: { x: 0, y: 0, z: 0 },
      scaling: { x: 1, y: 1, z: 1 },
      reflection: { x: false, y: false, z: false }
    });
  };

  const resetProblem = () => {
    resetState();
  };

  return {
    currentProblem,
    userAnswer,
    setUserAnswer,
    attempts,
    isCorrect,
    showFeedback,
    userTransformations,
    checkAnswer,
    nextProblem,
    resetProblem
  };
}
