
import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, XCircle, Lightbulb, RotateCcw } from 'lucide-react';
import MathVisualization from '@/components/MathVisualization';
import { SmartHintsSystem } from '@/components/features/SmartHintsSystem';

interface TransformationValue {
  x: number | boolean;
  y: number | boolean;
  z: number | boolean;
}

interface Problem {
  baseFunction: string;
  instruction: string;
  expectedAnswer: string;
  transformationType: string;
  transformationValue: TransformationValue;
}

const PracticeModePage = () => {
  const [currentProblem, setCurrentProblem] = useState<Problem>({
    baseFunction: 'x^2 + y^2',
    instruction: 'Apply a vertical translation of +2 units',
    expectedAnswer: 'x^2 + y^2 + 2',
    transformationType: 'translation',
    transformationValue: { x: 0, y: 0, z: 2 }
  });

  const [userAnswer, setUserAnswer] = useState('');
  const [attempts, setAttempts] = useState(0);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [userTransformations, setUserTransformations] = useState({
    translation: { x: 0, y: 0, z: 0 },
    scaling: { x: 1, y: 1, z: 1 },
    reflection: { x: false, y: false, z: false }
  });

  const problems: Problem[] = [
    {
      baseFunction: 'x^2 + y^2',
      instruction: 'Apply a vertical translation of +2 units',
      expectedAnswer: 'x^2 + y^2 + 2',
      transformationType: 'translation',
      transformationValue: { x: 0, y: 0, z: 2 }
    },
    {
      baseFunction: 'sin(x) * cos(y)',
      instruction: 'Reflect over the x-axis',
      expectedAnswer: '-sin(x) * cos(y)',
      transformationType: 'reflection',
      transformationValue: { x: false, y: true, z: false }
    },
    {
      baseFunction: 'x^2',
      instruction: 'Scale vertically by factor of 2',
      expectedAnswer: '2x^2',
      transformationType: 'scaling',
      transformationValue: { x: 1, y: 2, z: 1 }
    }
  ];

  const checkAnswer = () => {
    const correct = userAnswer.toLowerCase().replace(/\s/g, '') === 
                   currentProblem.expectedAnswer.toLowerCase().replace(/\s/g, '');
    
    setIsCorrect(correct);
    setShowFeedback(true);
    setAttempts(prev => prev + 1);

    if (correct) {
      // Award points, update progress, etc.
      console.log('Correct answer! Awarding points...');
    }
  };

  const nextProblem = () => {
    const nextIndex = (problems.indexOf(currentProblem) + 1) % problems.length;
    setCurrentProblem(problems[nextIndex]);
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

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-white">Practice Mode</h1>
        <div className="flex items-center space-x-4">
          <Badge variant="outline" className="border-cyan-400 text-cyan-400">
            Attempts: {attempts}
          </Badge>
          <Button onClick={resetProblem} variant="outline" size="sm">
            <RotateCcw className="h-4 w-4 mr-2" />
            Reset
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Problem Statement */}
        <Card className="p-6 bg-black/30 border-white/20">
          <h3 className="text-xl font-semibold text-white mb-4">Current Challenge</h3>
          
          <div className="space-y-4">
            <div className="p-4 bg-blue-500/20 border border-blue-400/30 rounded-lg">
              <h4 className="font-medium text-blue-300 mb-2">Base Function</h4>
              <p className="font-mono text-lg text-white">f(x,y) = {currentProblem.baseFunction}</p>
            </div>

            <div className="p-4 bg-yellow-500/20 border border-yellow-400/30 rounded-lg">
              <h4 className="font-medium text-yellow-300 mb-2">Task</h4>
              <p className="text-white">{currentProblem.instruction}</p>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-300">Your Answer:</label>
              <Input
                value={userAnswer}
                onChange={(e) => setUserAnswer(e.target.value)}
                placeholder="Enter the transformed function..."
                className="bg-black/50 border-white/30 text-white font-mono"
              />
            </div>

            <Button 
              onClick={checkAnswer}
              className="w-full bg-cyan-500 hover:bg-cyan-600"
              disabled={!userAnswer.trim()}
            >
              Check Answer
            </Button>

            {showFeedback && (
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
                    <p>Expected: <code className="font-mono">{currentProblem.expectedAnswer}</code></p>
                    <p className="text-sm">
                      Hint: {currentProblem.transformationType === 'translation' 
                        ? 'Remember that vertical translations add or subtract from the entire function.'
                        : currentProblem.transformationType === 'reflection'
                        ? 'Reflections change the sign of the function or its variables.'
                        : 'Scaling multiplies the function by a constant factor.'}
                    </p>
                  </div>
                )}

                {isCorrect && (
                  <Button onClick={nextProblem} className="mt-3 bg-green-600 hover:bg-green-700">
                    Next Problem
                  </Button>
                )}
              </div>
            )}
          </div>
        </Card>

        {/* Interactive Visualization */}
        <Card className="bg-black/30 border-white/20">
          <MathVisualization 
            functionExpression={currentProblem.baseFunction}
            transformations={userTransformations}
          />
        </Card>
      </div>

      {/* Smart Hints System */}
      {attempts >= 2 && !isCorrect && (
        <SmartHintsSystem 
          problemType={currentProblem.transformationType}
          attempts={attempts}
          baseFunction={currentProblem.baseFunction}
        />
      )}
    </div>
  );
};

export default PracticeModePage;
