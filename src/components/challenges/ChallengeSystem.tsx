import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Slider } from '@/components/ui/slider';
import { 
  Target, 
  Lightbulb, 
  Clock, 
  Trophy, 
  Zap, 
  RotateCcw, 
  Move, 
  Scale, 
  FlipHorizontal,
  CheckCircle,
  Star
} from 'lucide-react';
import MathVisualization from '@/components/MathVisualization';
import { Challenge, ChallengeSubmission, ChallengeStep } from '@/types/quiz';
import { CHALLENGES } from '@/data/quizData';
import { useToast } from '@/hooks/use-toast';

interface ChallengeSystemProps {
  onChallengeComplete?: (submission: ChallengeSubmission) => void;
}

const ChallengeSystem: React.FC<ChallengeSystemProps> = ({ onChallengeComplete }) => {
  const [selectedChallenge, setSelectedChallenge] = useState<Challenge | null>(null);
  const [currentFunction, setCurrentFunction] = useState('x^2');
  const [transformations, setTransformations] = useState({
    translation: { x: 0, y: 0, z: 0 },
    rotation: { x: 0, y: 0, z: 0 },
    scale: { x: 1, y: 1, z: 1 }
  });
  const [steps, setSteps] = useState<ChallengeStep[]>([]);
  const [timeStarted, setTimeStarted] = useState<Date | null>(null);
  const [hintsUsed, setHintsUsed] = useState(0);
  const [showHint, setShowHint] = useState(false);
  const [currentHintIndex, setCurrentHintIndex] = useState(0);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    if (selectedChallenge && !timeStarted) {
      setTimeStarted(new Date());
    }
  }, [selectedChallenge, timeStarted]);

  const startChallenge = (challenge: Challenge) => {
    setSelectedChallenge(challenge);
    setCurrentFunction('x^2');
    setTransformations({
      translation: { x: 0, y: 0, z: 0 },
      rotation: { x: 0, y: 0, z: 0 },
      scale: { x: 1, y: 1, z: 1 }
    });
    setSteps([]);
    setTimeStarted(new Date());
    setHintsUsed(0);
    setShowHint(false);
    setCurrentHintIndex(0);
    setIsSubmitted(false);
  };

  const handleTransformationChange = (type: string, axis: string, value: number) => {
    const newTransformations = { ...transformations };
    
    if (type === 'translation' || type === 'rotation' || type === 'scale') {
      (newTransformations[type] as any)[axis] = value;
    }

    setTransformations(newTransformations);

    // Record the step
    const step: ChallengeStep = {
      id: `step-${Date.now()}`,
      type: 'transformation',
      description: `${type} ${axis}: ${value}`,
      transformations: newTransformations
    };

    setSteps(prev => [...prev, step]);
  };

  const handleFunctionChange = (newFunction: string) => {
    setCurrentFunction(newFunction);
    
    const step: ChallengeStep = {
      id: `step-${Date.now()}`,
      type: 'function-change',
      description: `Changed function to: ${newFunction}`,
      functionExpression: newFunction
    };

    setSteps(prev => [...prev, step]);
  };

  const resetTransformations = () => {
    setTransformations({
      translation: { x: 0, y: 0, z: 0 },
      rotation: { x: 0, y: 0, z: 0 },
      scale: { x: 1, y: 1, z: 1 }
    });
    setSteps([]);
  };

  const showNextHint = () => {
    if (!selectedChallenge || currentHintIndex >= selectedChallenge.hints.length) return;
    
    setShowHint(true);
    setHintsUsed(prev => prev + 1);
    
    toast({
      title: "Hint Revealed",
      description: selectedChallenge.hints[currentHintIndex],
      duration: 5000
    });
  };

  const submitChallenge = () => {
    if (!selectedChallenge || !timeStarted) return;

    const timeSpent = Math.floor((Date.now() - timeStarted.getTime()) / 1000);
    const isCorrect = evaluateSubmission();
    const efficiency = calculateEfficiency();
    const creativity = calculateCreativity();

    const submission: ChallengeSubmission = {
      challengeId: selectedChallenge.id,
      steps,
      finalFunction: currentFunction,
      finalTransformations: transformations,
      timeSpent,
      hintsUsed,
      isCorrect,
      efficiency,
      creativity
    };

    setIsSubmitted(true);
    onChallengeComplete?.(submission);

    toast({
      title: isCorrect ? "Challenge Completed!" : "Keep Trying!",
      description: isCorrect 
        ? `Great work! Efficiency: ${Math.round(efficiency * 100)}%` 
        : "Your solution doesn't match the target. Try adjusting your approach.",
      variant: isCorrect ? "default" : "destructive"
    });
  };

  const evaluateSubmission = (): boolean => {
    if (!selectedChallenge?.targetGraph) return true; // Creative challenges are always "correct"

    const target = selectedChallenge.targetGraph;
    
    // Simple evaluation - in a real app, this would be more sophisticated
    const functionMatch = currentFunction === target.functionExpression;
    const transformationMatch = JSON.stringify(transformations) === JSON.stringify(target.transformations);
    
    return functionMatch || transformationMatch; // Allow either approach to work
  };

  const calculateEfficiency = (): number => {
    if (!selectedChallenge?.constraints?.maxTransformations) return 1.0;
    
    const maxSteps = selectedChallenge.constraints.maxTransformations;
    const actualSteps = steps.length;
    
    return Math.max(0, 1 - (actualSteps - maxSteps) / maxSteps);
  };

  const calculateCreativity = (): number => {
    // Simple creativity score based on unique approach
    const uniqueTransformations = new Set(steps.map(s => s.type)).size;
    return Math.min(1.0, uniqueTransformations / 3);
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner': return 'bg-green-500';
      case 'intermediate': return 'bg-yellow-500';
      case 'advanced': return 'bg-orange-500';
      case 'expert': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  if (!selectedChallenge) {
    return (
      <div className="space-y-6">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-white mb-4">🧩 Challenges</h2>
          <p className="text-gray-300 mb-8">Apply transformations creatively to solve real-world problems</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {CHALLENGES.map((challenge) => (
            <Card key={challenge.id} className="bg-black/30 border-white/20 hover:border-white/40 transition-colors">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <CardTitle className="text-white text-lg">{challenge.title}</CardTitle>
                  <Badge className={`${getDifficultyColor(challenge.difficulty)} text-white`}>
                    {challenge.difficulty}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-gray-300 text-sm">{challenge.description}</p>
                
                <div className="flex items-center gap-2">
                  <Target className="h-4 w-4 text-blue-400" />
                  <span className="text-sm text-blue-300">{challenge.category}</span>
                </div>

                {challenge.constraints && (
                  <div className="space-y-1">
                    {challenge.constraints.maxTransformations && (
                      <div className="flex items-center gap-2 text-sm text-gray-400">
                        <Zap className="h-3 w-3" />
                        Max {challenge.constraints.maxTransformations} transformations
                      </div>
                    )}
                    {challenge.constraints.timeLimit && (
                      <div className="flex items-center gap-2 text-sm text-gray-400">
                        <Clock className="h-3 w-3" />
                        {Math.floor(challenge.constraints.timeLimit / 60)} minutes
                      </div>
                    )}
                  </div>
                )}

                <div className="flex items-center justify-between pt-2">
                  <div className="flex items-center gap-1">
                    <Trophy className="h-4 w-4 text-yellow-400" />
                    <span className="text-sm text-yellow-300">{challenge.points} pts</span>
                  </div>
                  <Button
                    onClick={() => startChallenge(challenge)}
                    size="sm"
                    className="bg-blue-600 hover:bg-blue-700"
                  >
                    Start Challenge
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Challenge Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button
            onClick={() => setSelectedChallenge(null)}
            variant="ghost"
            className="text-gray-400 hover:text-white"
          >
            ← Back to Challenges
          </Button>
          <h2 className="text-2xl font-bold text-white">{selectedChallenge.title}</h2>
          <Badge className={`${getDifficultyColor(selectedChallenge.difficulty)} text-white`}>
            {selectedChallenge.difficulty}
          </Badge>
        </div>
        
        <div className="flex items-center gap-4">
          <div className="text-white">
            Steps: {steps.length}
            {selectedChallenge.constraints?.maxTransformations && 
              `/${selectedChallenge.constraints.maxTransformations}`
            }
          </div>
          <div className="text-white">
            Hints: {hintsUsed}/{selectedChallenge.hints.length}
          </div>
        </div>
      </div>

      {/* Challenge Description */}
      <Card className="bg-black/30 border-white/20">
        <CardContent className="p-6">
          <p className="text-gray-300 mb-4">{selectedChallenge.description}</p>
          {selectedChallenge.scenario && (
            <div className="bg-blue-900/20 border border-blue-500/30 rounded-lg p-4">
              <h4 className="text-blue-300 font-medium mb-2">Scenario:</h4>
              <p className="text-blue-100 text-sm">{selectedChallenge.scenario}</p>
            </div>
          )}
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Visualization Panel */}
        <Card className="bg-black/30 border-white/20">
          <CardHeader>
            <CardTitle className="text-white">Your Solution</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Function Input */}
            <div className="space-y-2">
              <label className="text-sm text-gray-400">Function:</label>
              <Input
                value={currentFunction}
                onChange={(e) => handleFunctionChange(e.target.value)}
                placeholder="Enter function (e.g., x^2, sin(x))"
                className="bg-black/50 border-white/30 text-white"
              />
            </div>

            {/* 3D Visualization */}
            <div className="h-64 bg-gray-900 rounded-lg">
              <MathVisualization
                functionExpression={currentFunction}
                transformations={transformations}
              />
            </div>

            {/* Transformation Controls */}
            <div className="space-y-4">
              <h4 className="text-white font-medium">Transformations</h4>
              
              {/* Translation */}
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Move className="h-4 w-4 text-blue-400" />
                  <span className="text-sm text-blue-300">Translation</span>
                </div>
                <div className="grid grid-cols-3 gap-2">
                  {['x', 'y', 'z'].map(axis => (
                    <div key={axis} className="space-y-1">
                      <label className="text-xs text-gray-400">{axis.toUpperCase()}</label>
                      <Slider
                        value={[(transformations.translation as any)[axis]]}
                        onValueChange={([value]) => handleTransformationChange('translation', axis, value)}
                        min={-10}
                        max={10}
                        step={0.1}
                        className="w-full"
                      />
                      <span className="text-xs text-gray-400">
                        {(transformations.translation as any)[axis].toFixed(1)}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Rotation */}
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <RotateCcw className="h-4 w-4 text-green-400" />
                  <span className="text-sm text-green-300">Rotation</span>
                </div>
                <div className="grid grid-cols-3 gap-2">
                  {['x', 'y', 'z'].map(axis => (
                    <div key={axis} className="space-y-1">
                      <label className="text-xs text-gray-400">{axis.toUpperCase()}</label>
                      <Slider
                        value={[(transformations.rotation as any)[axis]]}
                        onValueChange={([value]) => handleTransformationChange('rotation', axis, value)}
                        min={-180}
                        max={180}
                        step={1}
                        className="w-full"
                      />
                      <span className="text-xs text-gray-400">
                        {(transformations.rotation as any)[axis].toFixed(0)}°
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Scaling */}
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Scale className="h-4 w-4 text-purple-400" />
                  <span className="text-sm text-purple-300">Scale</span>
                </div>
                <div className="grid grid-cols-3 gap-2">
                  {['x', 'y', 'z'].map(axis => (
                    <div key={axis} className="space-y-1">
                      <label className="text-xs text-gray-400">{axis.toUpperCase()}</label>
                      <Slider
                        value={[(transformations.scale as any)[axis]]}
                        onValueChange={([value]) => handleTransformationChange('scale', axis, value)}
                        min={0.1}
                        max={5}
                        step={0.1}
                        className="w-full"
                      />
                      <span className="text-xs text-gray-400">
                        {(transformations.scale as any)[axis].toFixed(1)}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-2 pt-4">
              <Button
                onClick={resetTransformations}
                variant="outline"
                size="sm"
                className="border-gray-500 text-gray-300"
              >
                <RotateCcw className="h-4 w-4 mr-2" />
                Reset
              </Button>
              <Button
                onClick={showNextHint}
                variant="outline"
                size="sm"
                className="border-yellow-500 text-yellow-300"
                disabled={currentHintIndex >= selectedChallenge.hints.length}
              >
                <Lightbulb className="h-4 w-4 mr-2" />
                Hint
              </Button>
              <Button
                onClick={submitChallenge}
                className="flex-1 bg-green-600 hover:bg-green-700"
                disabled={isSubmitted}
              >
                {isSubmitted ? <CheckCircle className="h-4 w-4 mr-2" /> : null}
                Submit Solution
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Target/Progress Panel */}
        <Card className="bg-black/30 border-white/20">
          <CardHeader>
            <CardTitle className="text-white">
              {selectedChallenge.targetGraph ? 'Target Graph' : 'Progress'}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Target Visualization */}
            {selectedChallenge.targetGraph && (
              <div className="h-64 bg-gray-900 rounded-lg">
                <MathVisualization
                  functionExpression={selectedChallenge.targetGraph.functionExpression}
                  transformations={selectedChallenge.targetGraph.transformations}
                />
              </div>
            )}

            {/* Step History */}
            <div className="space-y-2">
              <h4 className="text-white font-medium">Steps Taken ({steps.length})</h4>
              <div className="max-h-40 overflow-y-auto space-y-1">
                {steps.map((step, index) => (
                  <div key={step.id} className="text-sm text-gray-300 bg-black/20 p-2 rounded">
                    {index + 1}. {step.description}
                  </div>
                ))}
              </div>
            </div>

            {/* Constraints Progress */}
            {selectedChallenge.constraints && (
              <div className="space-y-2">
                <h4 className="text-white font-medium">Constraints</h4>
                {selectedChallenge.constraints.maxTransformations && (
                  <div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-400">Transformations</span>
                      <span className="text-white">
                        {steps.length}/{selectedChallenge.constraints.maxTransformations}
                      </span>
                    </div>
                    <Progress 
                      value={(steps.length / selectedChallenge.constraints.maxTransformations) * 100} 
                      className="h-2"
                    />
                  </div>
                )}
              </div>
            )}

            {/* Hints */}
            {showHint && currentHintIndex < selectedChallenge.hints.length && (
              <Card className="bg-yellow-900/20 border-yellow-500/50">
                <CardContent className="p-4">
                  <div className="flex items-start gap-2">
                    <Lightbulb className="h-5 w-5 text-yellow-400 mt-0.5" />
                    <div>
                      <p className="text-yellow-200 font-medium">Hint {currentHintIndex + 1}:</p>
                      <p className="text-yellow-100 text-sm">
                        {selectedChallenge.hints[currentHintIndex]}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ChallengeSystem;
