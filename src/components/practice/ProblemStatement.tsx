
import React from 'react';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Problem } from '@/types/practice';

interface ProblemStatementProps {
  problem: Problem;
  userAnswer: string;
  onAnswerChange: (answer: string) => void;
  onCheckAnswer: () => void;
}

export function ProblemStatement({
  problem,
  userAnswer,
  onAnswerChange,
  onCheckAnswer
}: ProblemStatementProps) {
  return (
    <Card className="p-6 bg-black/30 border-white/20">
      <h3 className="text-xl font-semibold text-white mb-4">Current Challenge</h3>
      
      <div className="space-y-4">
        <div className="p-4 bg-blue-500/20 border border-blue-400/30 rounded-lg">
          <h4 className="font-medium text-blue-300 mb-2">Base Function</h4>
          <p className="font-mono text-lg text-white">f(x,y) = {problem.baseFunction}</p>
        </div>

        <div className="p-4 bg-yellow-500/20 border border-yellow-400/30 rounded-lg">
          <h4 className="font-medium text-yellow-300 mb-2">Task</h4>
          <p className="text-white">{problem.instruction}</p>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-300">Your Answer:</label>
          <Input
            value={userAnswer}
            onChange={(e) => onAnswerChange(e.target.value)}
            placeholder="Enter the transformed function..."
            className="bg-black/50 border-white/30 text-white font-mono"
          />
        </div>

        <Button 
          onClick={onCheckAnswer}
          className="w-full bg-cyan-500 hover:bg-cyan-600"
          disabled={!userAnswer.trim()}
        >
          Check Answer
        </Button>
      </div>
    </Card>
  );
}
