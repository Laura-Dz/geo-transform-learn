import React from 'react';
import PracticeMode from '@/components/practice/PracticeMode';
import { PracticeProgress } from '@/types/quiz';

const PracticePage = () => {
  const handleScenarioComplete = (progress: PracticeProgress) => {
    console.log('Scenario completed:', progress);
    // Here you would typically save to backend
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900 p-6">
      <PracticeMode onScenarioComplete={handleScenarioComplete} />
    </div>
  );
};

export default PracticePage;
