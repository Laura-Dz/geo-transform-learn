
import React from 'react';
import { Card } from '@/components/ui/card';
import MathVisualization from '@/components/MathVisualization';
import { SmartHintsSystem } from '@/components/features/SmartHintsSystem';
import { PracticeHeader } from '@/components/practice/PracticeHeader';
import { ProblemStatement } from '@/components/practice/ProblemStatement';
import { FeedbackPanel } from '@/components/practice/FeedbackPanel';
import { usePracticeMode } from '@/hooks/usePracticeMode';

const PracticeModePage = () => {
  const {
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
  } = usePracticeMode();

  return (
    <div className="space-y-6">
      <PracticeHeader attempts={attempts} onReset={resetProblem} />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Problem Statement */}
        <div className="space-y-4">
          <ProblemStatement
            problem={currentProblem}
            userAnswer={userAnswer}
            onAnswerChange={setUserAnswer}
            onCheckAnswer={checkAnswer}
          />

          <FeedbackPanel
            isCorrect={isCorrect}
            showFeedback={showFeedback}
            problem={currentProblem}
            onNextProblem={nextProblem}
          />
        </div>

        {/* Interactive Visualization */}
        <Card className="bg-black/30 border-white/20">
          <MathVisualization 
            functionExpression={currentProblem.baseFunction}
            transformations={{
              translation: userTransformations.translation,
              rotation: { x: 0, y: 0, z: 0 },
              scale: userTransformations.scaling
            }}
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
