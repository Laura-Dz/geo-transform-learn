
import React from 'react';
import { Button } from '@/components/ui/button';
import { CheckCircle, XCircle } from 'lucide-react';
import { Problem } from '@/types/practice';

interface FeedbackPanelProps {
  isCorrect: boolean | null;
  showFeedback: boolean;
  problem: Problem;
  onNextProblem: () => void;
}

export function FeedbackPanel({
  isCorrect,
  showFeedback,
  problem,
  onNextProblem
}: FeedbackPanelProps) {
  if (!showFeedback) return null;

  const getHintMessage = (transformationType: string) => {
    switch (transformationType) {
      case 'translation':
        return 'Remember that vertical translations add or subtract from the entire function.';
      case 'reflection':
        return 'Reflections change the sign of the function or its variables.';
      case 'scaling':
        return 'Scaling multiplies the function by a constant factor.';
      default:
        return 'Check your transformation carefully.';
    }
  };

  return (
    <div className={`p-4 rounded-lg border ${
      isCorrect 
        ? 'bg-green-500/20 border-green-400 text-green-300'
        : 'bg-red-500/20 border-red-400 text-red-300'
    }`}>
      <div className="flex items-center space-x-2 mb-2">
        {isCorrect ? (
          <CheckCircle className="h-5 w-5" />
        ) : (
          <XCircle className="h-5 w-5" />
        )}
        <span className="font-medium">
          {isCorrect ? 'Correct!' : 'Not quite right.'}
        </span>
      </div>
      
      {!isCorrect && (
        <div className="space-y-2">
          <p>Expected: <code className="font-mono">{problem.expectedAnswer}</code></p>
          <p className="text-sm">
            Hint: {getHintMessage(problem.transformationType)}
          </p>
        </div>
      )}

      {isCorrect && (
        <Button onClick={onNextProblem} className="mt-3 bg-green-600 hover:bg-green-700">
          Next Problem
        </Button>
      )}
    </div>
  );
}
