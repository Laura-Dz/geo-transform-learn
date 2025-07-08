
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { CheckCircle, XCircle, Brain } from 'lucide-react';

interface QuizModalProps {
  isOpen: boolean;
  onClose: () => void;
  onComplete: (score: number) => void;
  transformations: any;
}

const quizQuestions = [
  {
    id: 1,
    question: "What happens when you translate a function f(x,y) by adding 3 to the x-coordinate?",
    options: [
      "The graph moves 3 units to the right",
      "The graph moves 3 units to the left",
      "The graph moves 3 units up",
      "The graph moves 3 units down"
    ],
    correct: 1,
    explanation: "Translation f(x,y) → f(x-3,y) moves the graph 3 units to the left, as we subtract from x."
  },
  {
    id: 2,
    question: "If you scale a function by multiplying y-values by 2, what happens to the graph?",
    options: [
      "It becomes twice as wide",
      "It becomes twice as tall",
      "It moves up by 2 units",
      "It becomes half as tall"
    ],
    correct: 1,
    explanation: "Vertical scaling f(x,y) → 2·f(x,y) stretches the graph vertically, making it twice as tall."
  },
  {
    id: 3,
    question: "What does reflecting a function over the x-axis do mathematically?",
    options: [
      "Multiplies all x-values by -1",
      "Multiplies all y-values by -1",
      "Multiplies the function output by -1",
      "Adds -1 to the function"
    ],
    correct: 2,
    explanation: "Reflection over x-axis: f(x,y) → -f(x,y), which multiplies the output (z-values) by -1."
  },
  {
    id: 4,
    question: "Which transformation preserves the shape of the function?",
    options: [
      "Only translation",
      "Only scaling",
      "Translation and reflection",
      "All transformations preserve shape"
    ],
    correct: 2,
    explanation: "Translation and reflection preserve the shape, while scaling changes the proportions."
  },
  {
    id: 5,
    question: "If f(x,y) = x² + y², what is f(x-1, y+2) + 3?",
    options: [
      "(x-1)² + (y+2)² + 3",
      "(x+1)² + (y-2)² + 3",
      "x² + y² + 3",
      "(x-1)² + (y+2)²"
    ],
    correct: 0,
    explanation: "Substitute x-1 for x and y+2 for y, then add 3: f(x-1,y+2) + 3 = (x-1)² + (y+2)² + 3"
  }
];

const QuizModal: React.FC<QuizModalProps> = ({
  isOpen,
  onClose,
  onComplete,
  transformations
}) => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<number[]>([]);
  const [showResults, setShowResults] = useState(false);
  const [quizComplete, setQuizComplete] = useState(false);

  useEffect(() => {
    if (isOpen) {
      // Reset quiz state when modal opens
      setCurrentQuestion(0);
      setSelectedAnswers([]);
      setShowResults(false);
      setQuizComplete(false);
    }
  }, [isOpen]);

  const handleAnswerSelect = (answerIndex: number) => {
    const newAnswers = [...selectedAnswers];
    newAnswers[currentQuestion] = answerIndex;
    setSelectedAnswers(newAnswers);
  };

  const handleNext = () => {
    if (currentQuestion < quizQuestions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      // Quiz completed, show results
      setShowResults(true);
      setQuizComplete(true);
    }
  };

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    }
  };

  const calculateScore = () => {
    let correct = 0;
    selectedAnswers.forEach((answer, index) => {
      if (answer === quizQuestions[index].correct) {
        correct++;
      }
    });
    return Math.round((correct / quizQuestions.length) * 100);
  };

  const handleFinish = () => {
    const score = calculateScore();
    onComplete(score);
    onClose();
  };

  const currentQ = quizQuestions[currentQuestion];
  const progress = ((currentQuestion + 1) / quizQuestions.length) * 100;

  if (showResults) {
    const score = calculateScore();
    const correctAnswers = selectedAnswers.filter((answer, index) => 
      answer === quizQuestions[index].correct
    ).length;

    return (
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="sm:max-w-2xl bg-slate-900 border-slate-700">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold text-center text-white flex items-center justify-center">
              <Brain className="h-6 w-6 mr-2 text-cyan-400" />
              Quiz Results
            </DialogTitle>
          </DialogHeader>

          <div className="text-center py-6">
            <div className="text-6xl font-bold text-cyan-400 mb-4">
              {score}%
            </div>
            <p className="text-xl text-white mb-2">
              You got {correctAnswers} out of {quizQuestions.length} questions correct!
            </p>
            
            <div className="bg-slate-800/50 rounded-lg p-4 my-6">
              <h3 className="text-lg font-semibold text-white mb-4">Review Your Answers</h3>
              <div className="space-y-3 text-left">
                {quizQuestions.map((question, index) => {
                  const isCorrect = selectedAnswers[index] === question.correct;
                  return (
                    <div key={question.id} className="border-b border-slate-600 pb-3 last:border-b-0">
                      <div className="flex items-start space-x-2">
                        {isCorrect ? (
                          <CheckCircle className="h-5 w-5 text-green-400 mt-0.5 flex-shrink-0" />
                        ) : (
                          <XCircle className="h-5 w-5 text-red-400 mt-0.5 flex-shrink-0" />
                        )}
                        <div className="flex-1">
                          <p className="text-sm text-white font-medium mb-1">
                            Q{index + 1}: {question.question}
                          </p>
                          {!isCorrect && (
                            <div className="text-xs space-y-1">
                              <p className="text-red-300">
                                Your answer: {question.options[selectedAnswers[index]]}
                              </p>
                              <p className="text-green-300">
                                Correct answer: {question.options[question.correct]}
                              </p>
                              <p className="text-gray-400 italic">
                                {question.explanation}
                              </p>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="flex justify-center space-x-4">
              <Button 
                onClick={handleFinish}
                className="bg-cyan-500 hover:bg-cyan-600"
              >
                Continue Learning
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-2xl bg-slate-900 border-slate-700">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-center text-white flex items-center justify-center">
            <Brain className="h-6 w-6 mr-2 text-cyan-400" />
            Mathematical Transformations Quiz
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Progress */}
          <div className="space-y-2">
            <div className="flex justify-between text-sm text-gray-300">
              <span>Question {currentQuestion + 1} of {quizQuestions.length}</span>
              <span>{Math.round(progress)}% Complete</span>
            </div>
            <Progress value={progress} className="h-2" />
          </div>

          {/* Question */}
          <div className="bg-slate-800/50 rounded-lg p-6 border border-white/10">
            <h3 className="text-lg font-semibold text-white mb-4">
              {currentQ.question}
            </h3>

            <RadioGroup
              value={selectedAnswers[currentQuestion]?.toString()}
              onValueChange={(value) => handleAnswerSelect(parseInt(value))}
            >
              {currentQ.options.map((option, index) => (
                <div key={index} className="flex items-center space-x-2 p-3 rounded hover:bg-slate-700/50">
                  <RadioGroupItem 
                    value={index.toString()} 
                    id={`option-${index}`}
                    className="border-cyan-400 text-cyan-400"
                  />
                  <Label 
                    htmlFor={`option-${index}`} 
                    className="text-white cursor-pointer flex-1"
                  >
                    {option}
                  </Label>
                </div>
              ))}
            </RadioGroup>
          </div>

          {/* Navigation */}
          <div className="flex justify-between">
            <Button
              variant="outline"
              onClick={handlePrevious}
              disabled={currentQuestion === 0}
              className="border-white/30 text-white hover:bg-white/10"
            >
              Previous
            </Button>
            
            <Button
              onClick={handleNext}
              disabled={selectedAnswers[currentQuestion] === undefined}
              className="bg-cyan-500 hover:bg-cyan-600"
            >
              {currentQuestion === quizQuestions.length - 1 ? 'Finish Quiz' : 'Next'}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default QuizModal;
