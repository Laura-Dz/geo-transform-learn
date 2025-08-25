import React from 'react';
import EnhancedQuizSystem from '@/components/quiz/EnhancedQuizSystem';
import { QuizResult } from '@/types/quiz';

const QuizPage = () => {
  const handleQuizComplete = (result: QuizResult) => {
    console.log('Quiz completed:', result);
    // Here you would typically save to backend
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900 p-6">
      <EnhancedQuizSystem onQuizComplete={handleQuizComplete} />
    </div>
  );
};

export default QuizPage;
