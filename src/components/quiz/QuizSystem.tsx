import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Clock, CheckCircle, XCircle, Trophy, Target, Brain } from 'lucide-react';
import { Quiz, QuizQuestion, QuizAttempt, QuestionType } from '@/types/database';
import { useToast } from '@/hooks/use-toast';

// Mock quiz data
const MOCK_QUIZZES: Quiz[] = [
  {
    id: '1',
    conceptId: '1',
    title: 'Linear Functions Basics',
    description: 'Test your understanding of linear functions and their properties',
    difficulty: 'EASY',
    timeLimit: 15,
    isPublished: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    concept: {} as any,
    questions: [
      {
        id: 'q1',
        quizId: '1',
        question: 'What is the slope of the line y = 2x + 3?',
        questionType: 'MULTIPLE_CHOICE',
        options: { choices: ['1', '2', '3', '5'] },
        correctAnswer: '2',
        explanation: 'In the form y = mx + b, the coefficient of x (m) is the slope.',
        points: 1,
        order: 1,
        createdAt: new Date().toISOString(),
        quiz: {} as any,
        answers: []
      },
      {
        id: 'q2',
        quizId: '1',
        question: 'A linear function always creates a straight line when graphed.',
        questionType: 'TRUE_FALSE',
        options: { choices: ['True', 'False'] },
        correctAnswer: 'True',
        explanation: 'By definition, linear functions create straight lines.',
        points: 1,
        order: 2,
        createdAt: new Date().toISOString(),
        quiz: {} as any,
        answers: []
      }
    ]
  },
  {
    id: '2',
    conceptId: '2',
    title: 'Quadratic Functions Challenge',
    description: 'Advanced problems on quadratic functions and parabolas',
    difficulty: 'MEDIUM',
    timeLimit: 25,
    isPublished: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    concept: {} as any,
    questions: [
      {
        id: 'q3',
        quizId: '2',
        question: 'Find the vertex of the parabola y = x² - 4x + 3',
        questionType: 'SHORT_ANSWER',
        options: null,
        correctAnswer: '(2, -1)',
        explanation: 'Using the vertex formula x = -b/2a, we get x = 4/2 = 2, then y = 4 - 8 + 3 = -1',
        points: 2,
        order: 1,
        createdAt: new Date().toISOString(),
        quiz: {} as any,
        answers: []
      },
      {
        id: 'q4',
        quizId: '2',
        question: 'Write the equation for a parabola that opens downward with vertex at (0,0)',
        questionType: 'EQUATION_INPUT',
        options: null,
        correctAnswer: 'y = -x^2',
        explanation: 'A downward-opening parabola has a negative coefficient for x²',
        points: 2,
        order: 2,
        createdAt: new Date().toISOString(),
        quiz: {} as any,
        answers: []
      }
    ]
  }
];

interface QuizSystemProps {
  selectedQuizId?: string;
  onQuizComplete?: (attempt: QuizAttempt) => void;
  onBack?: () => void;
}

const QuizSystem: React.FC<QuizSystemProps> = ({ selectedQuizId, onQuizComplete, onBack }) => {
  const [quizzes] = useState<Quiz[]>(MOCK_QUIZZES);
  const [currentQuiz, setCurrentQuiz] = useState<Quiz | null>(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [timeRemaining, setTimeRemaining] = useState<number>(0);
  const [quizStarted, setQuizStarted] = useState(false);
  const [quizCompleted, setQuizCompleted] = useState(false);
  const [results, setResults] = useState<QuizAttempt | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    if (selectedQuizId) {
      const quiz = quizzes.find(q => q.id === selectedQuizId);
      if (quiz) {
        setCurrentQuiz(quiz);
        setTimeRemaining((quiz.timeLimit || 30) * 60); // Convert to seconds
      }
    }
  }, [selectedQuizId, quizzes]);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (quizStarted && !quizCompleted && timeRemaining > 0) {
      timer = setTimeout(() => {
        setTimeRemaining(prev => prev - 1);
      }, 1000);
    } else if (timeRemaining === 0 && quizStarted && !quizCompleted) {
      handleQuizSubmit();
    }
    return () => clearTimeout(timer);
  }, [timeRemaining, quizStarted, quizCompleted]);

  const startQuiz = () => {
    setQuizStarted(true);
    setCurrentQuestionIndex(0);
    setAnswers({});
  };

  const handleAnswerChange = (questionId: string, answer: string) => {
    setAnswers(prev => ({
      ...prev,
      [questionId]: answer
    }));
  };

  const nextQuestion = () => {
    if (currentQuiz && currentQuestionIndex < currentQuiz.questions!.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
    } else {
      handleQuizSubmit();
    }
  };

  const previousQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(prev => prev - 1);
    }
  };

  const handleQuizSubmit = () => {
    if (!currentQuiz) return;

    let totalScore = 0;
    let maxScore = 0;
    const timeSpent = ((currentQuiz.timeLimit || 30) * 60) - timeRemaining;

    currentQuiz.questions?.forEach(question => {
      maxScore += question.points;
      const userAnswer = answers[question.id];
      if (userAnswer && isAnswerCorrect(question, userAnswer)) {
        totalScore += question.points;
      }
    });

    const attempt: QuizAttempt = {
      id: `attempt-${Date.now()}`,
      userId: 'current-user',
      quizId: currentQuiz.id,
      score: totalScore,
      maxScore,
      timeSpent,
      completedAt: new Date().toISOString(),
      createdAt: new Date().toISOString(),
      user: {} as any,
      quiz: currentQuiz,
      answers: []
    };

    setResults(attempt);
    setQuizCompleted(true);
    onQuizComplete?.(attempt);

    toast({
      title: "Quiz Completed!",
      description: `You scored ${totalScore}/${maxScore} points (${Math.round((totalScore/maxScore) * 100)}%)`,
    });
  };

  const isAnswerCorrect = (question: QuizQuestion, userAnswer: string): boolean => {
    const correct = question.correctAnswer.toLowerCase().trim();
    const user = userAnswer.toLowerCase().trim();
    
    if (question.questionType === 'EQUATION_INPUT') {
      // Simple equation comparison (in real app, would use math parser)
      return user === correct || user.replace(/\s/g, '') === correct.replace(/\s/g, '');
    }
    
    return user === correct;
  };

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const renderQuestion = (question: QuizQuestion) => {
    const userAnswer = answers[question.id] || '';

    switch (question.questionType) {
      case 'MULTIPLE_CHOICE':
        return (
          <RadioGroup
            value={userAnswer}
            onValueChange={(value) => handleAnswerChange(question.id, value)}
          >
            {question.options?.choices?.map((choice: string, index: number) => (
              <div key={index} className="flex items-center space-x-2">
                <RadioGroupItem value={choice} id={`${question.id}-${index}`} />
                <Label htmlFor={`${question.id}-${index}`}>{choice}</Label>
              </div>
            ))}
          </RadioGroup>
        );

      case 'TRUE_FALSE':
        return (
          <RadioGroup
            value={userAnswer}
            onValueChange={(value) => handleAnswerChange(question.id, value)}
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="True" id={`${question.id}-true`} />
              <Label htmlFor={`${question.id}-true`}>True</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="False" id={`${question.id}-false`} />
              <Label htmlFor={`${question.id}-false`}>False</Label>
            </div>
          </RadioGroup>
        );

      case 'SHORT_ANSWER':
        return (
          <Input
            value={userAnswer}
            onChange={(e) => handleAnswerChange(question.id, e.target.value)}
            placeholder="Enter your answer..."
            className="max-w-md"
          />
        );

      case 'EQUATION_INPUT':
        return (
          <div className="space-y-2">
            <Input
              value={userAnswer}
              onChange={(e) => handleAnswerChange(question.id, e.target.value)}
              placeholder="Enter equation (e.g., y = x^2)"
              className="max-w-md font-mono"
            />
            <p className="text-sm text-gray-500">Use ^ for exponents (e.g., x^2 for x²)</p>
          </div>
        );

      default:
        return (
          <Textarea
            value={userAnswer}
            onChange={(e) => handleAnswerChange(question.id, e.target.value)}
            placeholder="Enter your answer..."
            className="max-w-md"
          />
        );
    }
  };

  if (!currentQuiz) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold">Quiz Center</h1>
          {onBack && (
            <Button variant="outline" onClick={onBack}>
              Back to Concepts
            </Button>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {quizzes.map((quiz) => (
            <Card key={quiz.id} className="hover:shadow-lg transition-shadow cursor-pointer">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="flex items-center space-x-2">
                      <Brain className="h-5 w-5" />
                      <span>{quiz.title}</span>
                    </CardTitle>
                    <CardDescription className="mt-2">{quiz.description}</CardDescription>
                  </div>
                  <Badge variant={quiz.difficulty === 'EASY' ? 'default' : quiz.difficulty === 'MEDIUM' ? 'secondary' : 'destructive'}>
                    {quiz.difficulty}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-sm text-gray-600">
                    <div className="flex items-center space-x-1">
                      <Target className="h-4 w-4" />
                      <span>{quiz.questions?.length || 0} questions</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Clock className="h-4 w-4" />
                      <span>{quiz.timeLimit} min</span>
                    </div>
                  </div>
                  <Button 
                    className="w-full" 
                    onClick={() => setCurrentQuiz(quiz)}
                  >
                    Start Quiz
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  if (quizCompleted && results) {
    const percentage = Math.round((results.score / results.maxScore) * 100);
    const passed = percentage >= 70;

    return (
      <div className="max-w-2xl mx-auto space-y-6">
        <Card className="text-center">
          <CardHeader>
            <div className="mx-auto mb-4">
              {passed ? (
                <Trophy className="h-16 w-16 text-yellow-500" />
              ) : (
                <Target className="h-16 w-16 text-gray-400" />
              )}
            </div>
            <CardTitle className="text-2xl">
              {passed ? 'Congratulations!' : 'Quiz Complete'}
            </CardTitle>
            <CardDescription>
              {passed ? 'You passed the quiz!' : 'Keep practicing to improve your score'}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="text-center">
              <div className="text-4xl font-bold mb-2">
                {results.score}/{results.maxScore}
              </div>
              <div className="text-lg text-gray-600">
                {percentage}% Score
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex justify-between text-sm">
                <span>Time Spent:</span>
                <span>{formatTime(results.timeSpent)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Questions Correct:</span>
                <span>{Math.round((results.score / results.maxScore) * currentQuiz.questions!.length)}/{currentQuiz.questions!.length}</span>
              </div>
            </div>

            <div className="flex space-x-3">
              <Button variant="outline" onClick={() => {
                setQuizCompleted(false);
                setQuizStarted(false);
                setCurrentQuestionIndex(0);
                setAnswers({});
                setTimeRemaining((currentQuiz.timeLimit || 30) * 60);
              }}>
                Retake Quiz
              </Button>
              <Button onClick={onBack}>
                Back to Concepts
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Question Review */}
        <Card>
          <CardHeader>
            <CardTitle>Review Your Answers</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {currentQuiz.questions?.map((question, index) => {
              const userAnswer = answers[question.id];
              const isCorrect = isAnswerCorrect(question, userAnswer || '');
              
              return (
                <div key={question.id} className="border-l-4 border-gray-200 pl-4 space-y-2">
                  <div className="flex items-start space-x-2">
                    {isCorrect ? (
                      <CheckCircle className="h-5 w-5 text-green-500 mt-0.5" />
                    ) : (
                      <XCircle className="h-5 w-5 text-red-500 mt-0.5" />
                    )}
                    <div className="flex-1">
                      <p className="font-medium">Question {index + 1}: {question.question}</p>
                      <p className="text-sm text-gray-600">Your answer: {userAnswer || 'No answer'}</p>
                      <p className="text-sm text-green-600">Correct answer: {question.correctAnswer}</p>
                      {question.explanation && (
                        <p className="text-sm text-blue-600 mt-1">{question.explanation}</p>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!quizStarted) {
    return (
      <div className="max-w-2xl mx-auto">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Brain className="h-6 w-6" />
              <span>{currentQuiz.title}</span>
            </CardTitle>
            <CardDescription>{currentQuiz.description}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-2 gap-4 text-center">
              <div>
                <div className="text-2xl font-bold">{currentQuiz.questions?.length || 0}</div>
                <div className="text-sm text-gray-600">Questions</div>
              </div>
              <div>
                <div className="text-2xl font-bold">{currentQuiz.timeLimit}</div>
                <div className="text-sm text-gray-600">Minutes</div>
              </div>
            </div>

            <div className="space-y-3">
              <h4 className="font-medium">Instructions:</h4>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Answer all questions to the best of your ability</li>
                <li>• You can navigate between questions</li>
                <li>• Your progress is saved automatically</li>
                <li>• Submit before time runs out</li>
              </ul>
            </div>

            <div className="flex space-x-3">
              <Button onClick={startQuiz} className="flex-1">
                Start Quiz
              </Button>
              <Button variant="outline" onClick={onBack}>
                Cancel
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  const currentQuestion = currentQuiz.questions![currentQuestionIndex];
  const progress = ((currentQuestionIndex + 1) / currentQuiz.questions!.length) * 100;

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">{currentQuiz.title}</h1>
          <p className="text-gray-600">Question {currentQuestionIndex + 1} of {currentQuiz.questions!.length}</p>
        </div>
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <Clock className="h-4 w-4" />
            <span className={`font-mono ${timeRemaining < 300 ? 'text-red-600' : ''}`}>
              {formatTime(timeRemaining)}
            </span>
          </div>
          <Badge variant="outline">
            {Math.round(progress)}% Complete
          </Badge>
        </div>
      </div>

      {/* Progress */}
      <Progress value={progress} className="h-2" />

      {/* Question */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">{currentQuestion.question}</CardTitle>
          <div className="flex items-center space-x-2">
            <Badge variant="outline">{currentQuestion.questionType.replace('_', ' ')}</Badge>
            <Badge variant="secondary">{currentQuestion.points} point{currentQuestion.points > 1 ? 's' : ''}</Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {renderQuestion(currentQuestion)}
        </CardContent>
      </Card>

      {/* Navigation */}
      <div className="flex items-center justify-between">
        <Button
          variant="outline"
          onClick={previousQuestion}
          disabled={currentQuestionIndex === 0}
        >
          Previous
        </Button>
        
        <div className="flex space-x-2">
          {currentQuiz.questions!.map((_, index) => (
            <Button
              key={index}
              variant={index === currentQuestionIndex ? "default" : "outline"}
              size="sm"
              className="w-8 h-8 p-0"
              onClick={() => setCurrentQuestionIndex(index)}
            >
              {index + 1}
            </Button>
          ))}
        </div>

        <Button
          onClick={nextQuestion}
          disabled={!answers[currentQuestion.id]}
        >
          {currentQuestionIndex === currentQuiz.questions!.length - 1 ? 'Submit' : 'Next'}
        </Button>
      </div>
    </div>
  );
};

export default QuizSystem;
