import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  BookOpen, 
  CheckCircle, 
  ArrowRight, 
  Lightbulb, 
  MessageSquare,
  Target,
  Clock,
  Award,
  RotateCcw,
  Play
} from 'lucide-react';
import MathVisualization from '@/components/MathVisualization';
import { PracticeScenario, PracticeStep, PracticeProgress } from '@/types/quiz';
import { PRACTICE_SCENARIOS } from '@/data/quizData';
import { useToast } from '@/hooks/use-toast';

interface PracticeModeProps {
  onScenarioComplete?: (progress: PracticeProgress) => void;
}

const PracticeMode: React.FC<PracticeModeProps> = ({ onScenarioComplete }) => {
  const [selectedScenario, setSelectedScenario] = useState<PracticeScenario | null>(null);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [currentStep, setCurrentStep] = useState<PracticeStep | null>(null);
  const [userAnswer, setUserAnswer] = useState('');
  const [showFeedback, setShowFeedback] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [completedSteps, setCompletedSteps] = useState<string[]>([]);
  const [reflectionAnswers, setReflectionAnswers] = useState<Record<string, string>>({});
  const [timeStarted, setTimeStarted] = useState<Date | null>(null);
  const [currentFunction, setCurrentFunction] = useState('x^2');
  const [transformations, setTransformations] = useState({
    translation: { x: 0, y: 0, z: 0 },
    rotation: { x: 0, y: 0, z: 0 },
    scale: { x: 1, y: 1, z: 1 }
  });
  const { toast } = useToast();

  useEffect(() => {
    if (selectedScenario && selectedScenario.guidedSteps.length > 0) {
      setCurrentStep(selectedScenario.guidedSteps[0]);
      setTimeStarted(new Date());
    }
  }, [selectedScenario]);

  useEffect(() => {
    if (selectedScenario && currentStepIndex < selectedScenario.guidedSteps.length) {
      setCurrentStep(selectedScenario.guidedSteps[currentStepIndex]);
      setUserAnswer('');
      setShowFeedback(false);
      setIsCorrect(false);
    }
  }, [currentStepIndex, selectedScenario]);

  const startScenario = (scenario: PracticeScenario) => {
    setSelectedScenario(scenario);
    setCurrentStepIndex(0);
    setCompletedSteps([]);
    setReflectionAnswers({});
    setTimeStarted(new Date());
    setUserAnswer('');
    setShowFeedback(false);
    setIsCorrect(false);
    
    // Set initial function based on scenario
    if (scenario.id === 'p1') {
      setCurrentFunction('-0.5*9.81*x^2 + 10'); // Bouncing ball
    } else if (scenario.id === 'p2') {
      setCurrentFunction('sin(70*x/60)'); // Heart rate
    }
  };

  const handleAnswerSubmit = () => {
    if (!currentStep || !userAnswer.trim()) return;

    const correct = evaluateAnswer(userAnswer, currentStep.expectedAnswer || '');
    setIsCorrect(correct);
    setShowFeedback(true);

    if (correct) {
      setCompletedSteps(prev => [...prev, currentStep.id]);
      toast({
        title: "Correct!",
        description: currentStep.feedback.correct,
        duration: 3000
      });
    } else {
      toast({
        title: "Not quite right",
        description: currentStep.feedback.incorrect,
        variant: "destructive",
        duration: 3000
      });
    }
  };

  const evaluateAnswer = (userAnswer: string, expectedAnswer: string): boolean => {
    const userLower = userAnswer.toLowerCase().trim();
    const expectedLower = expectedAnswer.toLowerCase().trim();
    
    // Simple keyword matching - in a real app, this would be more sophisticated
    return userLower.includes(expectedLower) || 
           expectedLower.includes(userLower) ||
           userLower === expectedLower;
  };

  const handleNextStep = () => {
    if (!selectedScenario) return;

    const nextIndex = currentStepIndex + 1;
    
    if (nextIndex >= selectedScenario.guidedSteps.length) {
      // Move to reflection phase
      showReflectionPhase();
    } else {
      setCurrentStepIndex(nextIndex);
    }
  };

  const showReflectionPhase = () => {
    // This would show reflection prompts
    completeScenario();
  };

  const completeScenario = () => {
    if (!selectedScenario || !timeStarted) return;

    const timeSpent = Math.floor((Date.now() - timeStarted.getTime()) / 1000);
    const progress: PracticeProgress = {
      scenarioId: selectedScenario.id,
      completedSteps,
      reflectionAnswers,
      timeSpent,
      isCompleted: completedSteps.length === selectedScenario.guidedSteps.length,
      score: Math.round((completedSteps.length / selectedScenario.guidedSteps.length) * 100),
      insights: generateInsights()
    };

    onScenarioComplete?.(progress);
    
    toast({
      title: "Scenario Complete!",
      description: `You completed ${completedSteps.length}/${selectedScenario.guidedSteps.length} steps`,
      duration: 5000
    });

    setSelectedScenario(null);
  };

  const generateInsights = (): string[] => {
    const insights: string[] = [];
    
    if (completedSteps.length === selectedScenario?.guidedSteps.length) {
      insights.push("Perfect completion! You understood all the key concepts.");
    }
    
    if (selectedScenario?.id === 'p1') {
      insights.push("You've learned how gravity affects projectile motion through quadratic functions.");
    }
    
    return insights;
  };

  const getContextColor = (context: string) => {
    switch (context) {
      case 'physics': return 'bg-blue-500';
      case 'biology': return 'bg-green-500';
      case 'economics': return 'bg-yellow-500';
      case 'engineering': return 'bg-purple-500';
      case 'music': return 'bg-pink-500';
      case 'sports': return 'bg-orange-500';
      default: return 'bg-gray-500';
    }
  };

  if (!selectedScenario) {
    return (
      <div className="space-y-6">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-white mb-4">🧪 Practice Mode</h2>
          <p className="text-gray-300 mb-8">Learn through real-world scenarios and guided exploration</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {PRACTICE_SCENARIOS.map((scenario) => (
            <Card key={scenario.id} className="bg-black/30 border-white/20 hover:border-white/40 transition-colors">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <CardTitle className="text-white text-lg">{scenario.title}</CardTitle>
                  <Badge className={`${getContextColor(scenario.context)} text-white`}>
                    {scenario.context}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-gray-300 text-sm">{scenario.description}</p>
                
                <div className="bg-blue-900/20 border border-blue-500/30 rounded-lg p-3">
                  <p className="text-blue-100 text-sm">{scenario.realWorldExample}</p>
                </div>

                <div className="flex items-center gap-2 text-sm text-gray-400">
                  <BookOpen className="h-4 w-4" />
                  {scenario.guidedSteps.length} guided steps
                </div>

                <div className="flex items-center gap-2 text-sm text-gray-400">
                  <MessageSquare className="h-4 w-4" />
                  {scenario.reflectionPrompts.length} reflection questions
                </div>

                <Button
                  onClick={() => startScenario(scenario)}
                  className="w-full bg-green-600 hover:bg-green-700"
                >
                  <Play className="h-4 w-4 mr-2" />
                  Start Scenario
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  if (!currentStep) return null;

  const progress = ((currentStepIndex + 1) / selectedScenario.guidedSteps.length) * 100;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button
            onClick={() => setSelectedScenario(null)}
            variant="ghost"
            className="text-gray-400 hover:text-white"
          >
            ← Back to Scenarios
          </Button>
          <h2 className="text-2xl font-bold text-white">{selectedScenario.title}</h2>
          <Badge className={`${getContextColor(selectedScenario.context)} text-white`}>
            {selectedScenario.context}
          </Badge>
        </div>
        
        <div className="flex items-center gap-4">
          <div className="text-white">
            Step {currentStepIndex + 1} of {selectedScenario.guidedSteps.length}
          </div>
          <div className="text-white">
            {completedSteps.length}/{selectedScenario.guidedSteps.length} completed
          </div>
        </div>
      </div>

      {/* Progress Bar */}
      <Progress value={progress} className="h-2" />

      {/* Scenario Context */}
      <Card className="bg-black/30 border-white/20">
        <CardContent className="p-4">
          <p className="text-gray-300">{selectedScenario.realWorldExample}</p>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Step Content */}
        <Card className="bg-black/30 border-white/20">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <Target className="h-5 w-5" />
              {currentStep.title}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-gray-300">{currentStep.instruction}</p>

            {/* Interactive Elements */}
            {currentStep.interactiveElements?.allowGraphRotation && (
              <div className="h-48 bg-gray-900 rounded-lg">
                <MathVisualization
                  functionExpression={currentFunction}
                  transformations={transformations}
                />
              </div>
            )}

            {/* Answer Input */}
            <div className="space-y-2">
              <label className="text-sm text-gray-400">Your Answer:</label>
              {currentStep.type === 'interpret' ? (
                <Textarea
                  value={userAnswer}
                  onChange={(e) => setUserAnswer(e.target.value)}
                  placeholder="Explain your reasoning..."
                  className="bg-black/50 border-white/30 text-white"
                  rows={3}
                />
              ) : (
                <Input
                  value={userAnswer}
                  onChange={(e) => setUserAnswer(e.target.value)}
                  placeholder="Enter your answer..."
                  className="bg-black/50 border-white/30 text-white"
                />
              )}
            </div>

            {/* Feedback */}
            {showFeedback && (
              <Card className={`${
                isCorrect 
                  ? 'bg-green-900/20 border-green-500/50' 
                  : 'bg-red-900/20 border-red-500/50'
              }`}>
                <CardContent className="p-4">
                  <div className="flex items-start gap-2">
                    {isCorrect ? (
                      <CheckCircle className="h-5 w-5 text-green-400 mt-0.5" />
                    ) : (
                      <RotateCcw className="h-5 w-5 text-red-400 mt-0.5" />
                    )}
                    <div>
                      <p className="text-white font-medium mb-2">
                        {isCorrect ? 'Excellent!' : 'Not quite right'}
                      </p>
                      <p className="text-gray-300 text-sm">
                        {isCorrect ? currentStep.feedback.correct : currentStep.feedback.incorrect}
                      </p>
                      {!isCorrect && (
                        <div className="mt-3 p-3 bg-yellow-900/20 border border-yellow-500/30 rounded">
                          <div className="flex items-start gap-2">
                            <Lightbulb className="h-4 w-4 text-yellow-400 mt-0.5" />
                            <div>
                              <p className="text-yellow-200 font-medium text-sm">Hint:</p>
                              <p className="text-yellow-100 text-sm">{currentStep.feedback.hint}</p>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Action Buttons */}
            <div className="flex gap-3 pt-4">
              {!showFeedback ? (
                <Button
                  onClick={handleAnswerSubmit}
                  disabled={!userAnswer.trim()}
                  className="flex-1 bg-blue-600 hover:bg-blue-700"
                >
                  Submit Answer
                </Button>
              ) : (
                <Button
                  onClick={handleNextStep}
                  className="flex-1 bg-green-600 hover:bg-green-700"
                >
                  {currentStepIndex + 1 >= selectedScenario.guidedSteps.length ? (
                    'Complete Scenario'
                  ) : (
                    <>
                      Next Step <ArrowRight className="h-4 w-4 ml-2" />
                    </>
                  )}
                </Button>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Progress Panel */}
        <Card className="bg-black/30 border-white/20">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <Award className="h-5 w-5" />
              Progress
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Step Progress */}
            <div className="space-y-2">
              <h4 className="text-white font-medium">Steps Completed</h4>
              <div className="space-y-1">
                {selectedScenario.guidedSteps.map((step, index) => (
                  <div
                    key={step.id}
                    className={`flex items-center gap-2 p-2 rounded text-sm ${
                      completedSteps.includes(step.id)
                        ? 'bg-green-900/20 border border-green-500/30'
                        : index === currentStepIndex
                        ? 'bg-blue-900/20 border border-blue-500/30'
                        : 'bg-gray-900/20 border border-gray-500/30'
                    }`}
                  >
                    {completedSteps.includes(step.id) ? (
                      <CheckCircle className="h-4 w-4 text-green-400" />
                    ) : index === currentStepIndex ? (
                      <Clock className="h-4 w-4 text-blue-400" />
                    ) : (
                      <div className="h-4 w-4 rounded-full border border-gray-500" />
                    )}
                    <span className={
                      completedSteps.includes(step.id) ? 'text-green-300' :
                      index === currentStepIndex ? 'text-blue-300' : 'text-gray-400'
                    }>
                      {step.title}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Key Concepts */}
            <div className="space-y-2">
              <h4 className="text-white font-medium">Key Concepts</h4>
              <div className="space-y-1">
                {selectedScenario.id === 'p1' && (
                  <>
                    <Badge variant="outline" className="border-blue-500 text-blue-300">
                      Quadratic Functions
                    </Badge>
                    <Badge variant="outline" className="border-green-500 text-green-300">
                      Gravity & Physics
                    </Badge>
                    <Badge variant="outline" className="border-purple-500 text-purple-300">
                      Transformations
                    </Badge>
                  </>
                )}
                {selectedScenario.id === 'p2' && (
                  <>
                    <Badge variant="outline" className="border-pink-500 text-pink-300">
                      Trigonometric Functions
                    </Badge>
                    <Badge variant="outline" className="border-green-500 text-green-300">
                      Periodic Patterns
                    </Badge>
                    <Badge variant="outline" className="border-blue-500 text-blue-300">
                      Biological Systems
                    </Badge>
                  </>
                )}
              </div>
            </div>

            {/* Time Spent */}
            {timeStarted && (
              <div className="text-center">
                <div className="text-lg font-bold text-blue-400">
                  {Math.floor((Date.now() - timeStarted.getTime()) / 60000)} min
                </div>
                <div className="text-sm text-gray-400">Time Spent</div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default PracticeMode;
