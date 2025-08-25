import React from 'react';
import ChallengeSystem from '@/components/challenges/ChallengeSystem';
import { ChallengeSubmission } from '@/types/quiz';

const ChallengesPage = () => {
  const handleChallengeComplete = (submission: ChallengeSubmission) => {
    console.log('Challenge completed:', submission);
    // Here you would typically save to backend
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900 p-6">
      <ChallengeSystem onChallengeComplete={handleChallengeComplete} />
    </div>
  );
};

export default ChallengesPage;
