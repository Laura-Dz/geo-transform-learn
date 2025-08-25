import React, { useState, useEffect, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Timer, Brain, Trophy, Target, Zap, CheckCircle, XCircle, Lightbulb } from 'lucide-react';
import MathVisualization from '@/components/MathVisualization';
import { QuizQuestion, QuizSession, QuizAnswer, QuizResult } from '@/types/quiz';
import { QUIZ_QUESTIONS } from '@/data/quizData';
import { useToast } from '@/hooks/use-toast';

interface EnhancedQuizSystemProps {
  onQuizComplete?: (result: QuizResult) => void;
}

const EnhancedQuizSystem: React.FC<EnhancedQuizSystemProps> = ({ onQuizComplete }) => {
  const [quizSession, setQuizSession] = useState<QuizSession | null>(null);
  const [currentQuestion, setCurrentQuestion] = useState<QuizQuestion | null>(null);
  const [selectedAnswer, setSelectedAnswer] = useState<string>('');
  const [showFeedback, setShowFeedback] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState<number>(0);
  const [hintsUsed, setHintsUsed] = useState(0);
  const [showHint, setShowHint] = useState(false);
  const [isTimedMode, setIsTimedMode] = useState(false);
  const [adaptiveDifficulty, setAdaptiveDifficulty] = useState(true);
  const { toast } = useToast();

  // Timer effect
  useEffect(() => {
    if (timeRemaining > 0 && !showFeedback) {
      const timer = setTimeout(() => {
        setTimeRemaining(prev => prev - 1);
      }, 1000);
      return () => clearTimeout(timer);
    } else if (timeRemaining === 0 && currentQuestion && !showFeedback) {
      handleTimeUp();
    }
  }, [timeRemaining, showFeedback, currentQuestion]);

  const startQuiz = (timed: boolean = false, adaptive: boolean = true) => {
    const questions = getAdaptiveQuestions(adaptive ? 'easy' : 'easy');
    const session: QuizSession = {
      id: `quiz-${Date.now()}`,
      questions,
      currentQuestionIndex: 0,
      answers: [],
      startTime: new Date(),
      isTimedMode: timed,
      totalTimeLimit: timed ? questions.length * 90 : undefined,
      score: 0,
      maxScore: questions.reduce((sum, q) => sum + q.points, 0),
      adaptiveDifficulty: adaptive
    };

    setQuizSession(session);
    setCurrentQuestion(questions[0]);
    setTimeRemaining(timed ? questions[0].timeLimit || 90 : 0);
    setSelectedAnswer('');
    setShowFeedback(false);
    setHintsUsed(0);
    setShowHint(false);
    setIsTimedMode(timed);
    setAdaptiveDifficulty(adaptive);
  };

  const getAdaptiveQuestions = (startDifficulty: string): QuizQuestion[] => {
    // Start with questions of the specified difficulty
    const easyQuestions = QUIZ_QUESTIONS.filter(q => q.difficulty === 'easy');
    const moderateQuestions = QUIZ_QUESTIONS.filter(q => q.difficulty === 'moderate');
    const advancedQuestions = QUIZ_QUESTIONS.filter(q => q.difficulty === 'advanced');

    // Return a mix starting with easier questions
    return [
      ...easyQuestions.slice(0, 2),
      ...moderateQuestions.slice(0, 2),
      ...advancedQuestions.slice(0, 1)
    ];
  };

  const handleAnswerSelect = (answerId: string) => {
    if (showFeedback) return;
    setSelectedAnswer(answerId);
  };

  const handleSubmitAnswer = () => {
    if (!selectedAnswer || !currentQuestion || !quizSession) return;

    const isCorrect = selectedAnswer === currentQuestion.correctAnswer;
    const timeSpent = currentQuestion.timeLimit ? 
      (currentQuestion.timeLimit - timeRemaining) : 
      Math.floor((Date.now() - quizSession.startTime.getTime()) / 1000);

    const answer: QuizAnswer = {
      questionId: currentQuestion.id,
      selectedAnswer,
      isCorrect,
      timeSpent,
      hintsUsed
    };

    const updatedSession = {
      ...quizSession,
      answers: [...quizSession.answers, answer],
      score: quizSession.score + (isCorrect ? currentQuestion.points : 0)
    };

    setQuizSession(updatedSession);
    setShowFeedback(true);

    // Show toast feedback
    toast({
      title: isCorrect ? "Correct!" : "Incorrect",
      description: isCorrect ? 
        `+${currentQuestion.points} points` : 
        "Don't worry, keep learning!",
      variant: isCorrect ? "default" : "destructive"
    });
  };

  const handleNextQuestion = () => {
    if (!quizSession) return;

    const nextIndex = quizSession.currentQuestionIndex + 1;
    
    if (nextIndex >= quizSession.questions.length) {
      // Quiz complete
      completeQuiz();
      return;
    }

    // Adaptive difficulty adjustment
    let nextQuestion = quizSession.questions[nextIndex];
    if (adaptiveDifficulty && quizSession.answers.length > 0) {
      const recentAccuracy = calculateRecentAccuracy();
      nextQuestion = adjustDifficultyIfNeeded(nextQuestion, recentAccuracy);
    }

    setQuizSession({
      ...quizSession,
      currentQuestionIndex: nextIndex
    });
    setCurrentQuestion(nextQuestion);
    setTimeRemaining(isTimedMode ? nextQuestion.timeLimit || 90 : 0);
    setSelectedAnswer('');
    setShowFeedback(false);
    setHintsUsed(0);
    setShowHint(false);
  };

  const calculateRecentAccuracy = (): number => {
    if (!quizSession || quizSession.answers.length === 0) return 0.5;
    
    const recentAnswers = quizSession.answers.slice(-3); // Last 3 answers
    const correct = recentAnswers.filter(a => a.isCorrect).length;
    return correct / recentAnswers.length;
  };

  const adjustDifficultyIfNeeded = (question: QuizQuestion, accuracy: number): QuizQuestion => {
    // If accuracy is high (>0.8), try to use a harder question
    if (accuracy > 0.8) {
      const harderQuestions = QUIZ_QUESTIONS.filter(q => 
        q.difficulty === 'advanced' && q.category === question.category
      );
      if (harderQuestions.length > 0) {
        return harderQuestions[Math.floor(Math.random() * harderQuestions.length)];
      }
    }
    
    // If accuracy is low (<0.4), try to use an easier question
    if (accuracy < 0.4) {
      const easierQuestions = QUIZ_QUESTIONS.filter(q => 
        q.difficulty === 'easy' && q.category === question.category
      );
      if (easierQuestions.length > 0) {
        return easierQuestions[Math.floor(Math.random() * easierQuestions.length)];
      }
    }

    return question;
  };

  const handleTimeUp = () => {
    if (!currentQuestion || !quizSession) return;

    const answer: QuizAnswer = {
      questionId: currentQuestion.id,
      selectedAnswer: '',
      isCorrect: false,
      timeSpent: currentQuestion.timeLimit || 90,
      hintsUsed
    };

    setQuizSession({
      ...quizSession,
      answers: [...quizSession.answers, answer]
    });
    setShowFeedback(true);

    toast({
      title: "Time's Up!",
      description: "Moving to the next question.",
      variant: "destructive"
    });
  };

  const handleShowHint = () => {
    setShowHint(true);
    setHintsUsed(prev => prev + 1);
  };

  const completeQuiz = () => {
    if (!quizSession) return;

    const result: QuizResult = {
      sessionId: quizSession.id,
      totalQuestions: quizSession.questions.length,
      correctAnswers: quizSession.answers.filter(a => a.isCorrect).length,
      score: quizSession.score,
      accuracy: quizSession.answers.filter(a => a.isCorrect).length / quizSession.answers.length,
      averageTimePerQuestion: quizSession.answers.reduce((sum, a) => sum + a.timeSpent, 0) / quizSession.answers.length,
      categoryBreakdown: calculateCategoryBreakdown(),
      difficultyProgression: quizSession.questions.map(q => q.difficulty),
      badgesEarned: calculateBadgesEarned(),
      recommendations: generateRecommendations()
    };

    onQuizComplete?.(result);
    setQuizSession(null);
    setCurrentQuestion(null);
  };

  const calculateCategoryBreakdown = (): Record<string, { correct: number; total: number }> => {
    if (!quizSession) return {};

    const breakdown: Record<string, { correct: number; total: number }> = {};
    
    quizSession.questions.forEach((question, index) => {
      const category = question.category;
      const answer = quizSession.answers[index];
      
      if (!breakdown[category]) {
        breakdown[category] = { correct: 0, total: 0 };
      }
      
      breakdown[category].total++;
      if (answer?.isCorrect) {
        breakdown[category].correct++;
      }
    });

    return breakdown;
  };

  const calculateBadgesEarned = (): string[] => {
    const badges: string[] = [];
    if (!quizSession) return badges;

    const accuracy = quizSession.answers.filter(a => a.isCorrect).length / quizSession.answers.length;
    
    if (accuracy >= 0.9) badges.push('accuracy-master');
    if (accuracy === 1.0) badges.push('perfect-score');
    
    const avgTime = quizSession.answers.reduce((sum, a) => sum + a.timeSpent, 0) / quizSession.answers.length;
    if (avgTime < 30 && accuracy >= 0.8) badges.push('speed-demon');

    return badges;
  };

  const generateRecommendations = (): string[] => {
    const recommendations: string[] = [];
    if (!quizSession) return recommendations;

    const categoryBreakdown = calculateCategoryBreakdown();
    
    Object.entries(categoryBreakdown).forEach(([category, stats]) => {
      const accuracy = stats.correct / stats.total;
      if (accuracy < 0.6) {
        recommendations.push(`Review ${category} concepts in the Concept Library`);
      }
    });

    return recommendations;
  };

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  if (!quizSession || !currentQuestion) {
    return (
      <div className="space-y-6">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-white mb-4">🧠 Quiz Zone</h2>
          <p className="text-gray-300 mb-8">Test your understanding with interactive 3D math questions</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="bg-black/30 border-white/20">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <Target className="h-6 w-6" />
                Practice Mode
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-300 mb-4">Take your time to learn and explore</p>
              <Button 
                onClick={() => startQuiz(false, true)}
                className="w-full bg-blue-600 hover:bg-blue-700"
              >
                Start Practice Quiz
              </Button>
            </CardContent>
          </Card>

          <Card className="bg-black/30 border-white/20">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <Zap className="h-6 w-6" />
                Challenge Mode
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-300 mb-4">Timed questions with adaptive difficulty</p>
              <Button 
                onClick={() => startQuiz(true, true)}
                className="w-full bg-orange-600 hover:bg-orange-700"
              >
                Start Challenge Quiz
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  const progress = ((quizSession.currentQuestionIndex + 1) / quizSession.questions.length) * 100;

  return (
    <div className="space-y-6">
      {/* Quiz Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <h2 className="text-2xl font-bold text-white">Quiz in Progress</h2>
          <Badge variant="outline" className="border-cyan-500 text-cyan-300">
            Question {quizSession.currentQuestionIndex + 1} of {quizSession.questions.length}
          </Badge>
          <Badge variant="outline" className="border-purple-500 text-purple-300">
            {currentQuestion.difficulty}
          </Badge>
        </div>
        
        <div className="flex items-center gap-4">
          {isTimedMode && (
            <div className="flex items-center gap-2 text-white">
              <Timer className="h-5 w-5" />
              <span className={timeRemaining < 10 ? 'text-red-400' : ''}>
                {formatTime(timeRemaining)}
              </span>
            </div>
          )}
          <div className="text-white">
            Score: {quizSession.score}/{quizSession.maxScore}
          </div>
        </div>
      </div>

      {/* Progress Bar */}
      <Progress value={progress} className="h-2" />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Question Panel */}
        <Card className="bg-black/30 border-white/20">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <Brain className="h-5 w-5" />
              {currentQuestion.question}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* 3D Visualization for graph questions */}
            {(currentQuestion.type === 'graph-identification' || 
              currentQuestion.type === 'transformation-match') && 
              currentQuestion.functionExpression && (
              <div className="h-64 bg-gray-900 rounded-lg">
                <MathVisualization
                  functionExpression={currentQuestion.functionExpression}
                  transformations={currentQuestion.transformations || {
                    translation: { x: 0, y: 0, z: 0 },
                    rotation: { x: 0, y: 0, z: 0 },
                    scale: { x: 1, y: 1, z: 1 }
                  }}
                />
              </div>
            )}

            {/* Answer Options */}
            <div className="space-y-3">
              {currentQuestion.options.map((option) => (
                <Button
                  key={option.id}
                  variant={selectedAnswer === option.id ? "default" : "outline"}
                  className={`w-full justify-start text-left p-4 h-auto ${
                    showFeedback
                      ? option.id === currentQuestion.correctAnswer
                        ? 'bg-green-600 border-green-500'
                        : option.id === selectedAnswer && selectedAnswer !== currentQuestion.correctAnswer
                        ? 'bg-red-600 border-red-500'
                        : 'opacity-50'
                      : selectedAnswer === option.id
                      ? 'bg-blue-600 border-blue-500'
                      : 'bg-black/20 border-white/20 text-white hover:bg-white/10'
                  }`}
                  onClick={() => handleAnswerSelect(option.id)}
                  disabled={showFeedback}
                >
                  <div className="flex items-center gap-3">
                    <span className="font-bold">{option.id.toUpperCase()}.</span>
                    <span>{option.text}</span>
                    {showFeedback && option.id === currentQuestion.correctAnswer && (
                      <CheckCircle className="h-5 w-5 ml-auto" />
                    )}
                    {showFeedback && option.id === selectedAnswer && 
                     selectedAnswer !== currentQuestion.correctAnswer && (
                      <XCircle className="h-5 w-5 ml-auto" />
                    )}
                  </div>
                </Button>
              ))}
            </div>

            {/* Feedback Section */}
            {showFeedback && (
              <Card className={`${
                selectedAnswer === currentQuestion.correctAnswer 
                  ? 'bg-green-900/20 border-green-500/50' 
                  : 'bg-red-900/20 border-red-500/50'
              }`}>
                <CardContent className="p-4">
                  <p className="text-white font-medium mb-2">
                    {selectedAnswer === currentQuestion.correctAnswer ? '✅ Correct!' : '❌ Incorrect'}
                  </p>
                  <p className="text-gray-300 text-sm">
                    {currentQuestion.explanation}
                  </p>
                </CardContent>
              </Card>
            )}

            {/* Hint Section */}
            {showHint && currentQuestion.hint && (
              <Card className="bg-yellow-900/20 border-yellow-500/50">
                <CardContent className="p-4">
                  <div className="flex items-start gap-2">
                    <Lightbulb className="h-5 w-5 text-yellow-400 mt-0.5" />
                    <div>
                      <p className="text-yellow-200 font-medium">Hint:</p>
                      <p className="text-yellow-100 text-sm">{currentQuestion.hint}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Action Buttons */}
            <div className="flex gap-3 pt-4">
              {!showFeedback && (
                <>
                  <Button
                    onClick={handleSubmitAnswer}
                    disabled={!selectedAnswer}
                    className="flex-1 bg-green-600 hover:bg-green-700"
                  >
                    Submit Answer
                  </Button>
                  {currentQuestion.hint && !showHint && (
                    <Button
                      onClick={handleShowHint}
                      variant="outline"
                      className="border-yellow-500 text-yellow-300 hover:bg-yellow-900/20"
                    >
                      <Lightbulb className="h-4 w-4" />
                    </Button>
                  )}
                </>
              )}
              
              {showFeedback && (
                <Button
                  onClick={handleNextQuestion}
                  className="flex-1 bg-blue-600 hover:bg-blue-700"
                >
                  {quizSession.currentQuestionIndex + 1 >= quizSession.questions.length 
                    ? 'Complete Quiz' 
                    : 'Next Question'
                  }
                </Button>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Stats Panel */}
        <Card className="bg-black/30 border-white/20">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <Trophy className="h-5 w-5" />
              Quiz Statistics
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-green-400">
                  {quizSession.answers.filter(a => a.isCorrect).length}
                </div>
                <div className="text-sm text-gray-400">Correct</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-red-400">
                  {quizSession.answers.filter(a => !a.isCorrect).length}
                </div>
                <div className="text-sm text-gray-400">Incorrect</div>
              </div>
            </div>
            
            <div className="text-center">
              <div className="text-xl font-bold text-blue-400">
                {quizSession.answers.length > 0 
                  ? Math.round((quizSession.answers.filter(a => a.isCorrect).length / quizSession.answers.length) * 100)
                  : 0
                }%
              </div>
              <div className="text-sm text-gray-400">Accuracy</div>
            </div>

            {hintsUsed > 0 && (
              <div className="text-center">
                <div className="text-lg font-bold text-yellow-400">{hintsUsed}</div>
                <div className="text-sm text-gray-400">Hints Used</div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default EnhancedQuizSystem;
