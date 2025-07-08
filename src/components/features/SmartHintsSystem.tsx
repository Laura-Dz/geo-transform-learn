
import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Lightbulb, Eye, BookOpen } from 'lucide-react';

interface SmartHintsSystemProps {
  problemType: string;
  attempts: number;
  baseFunction: string;
}

export function SmartHintsSystem({ problemType, attempts, baseFunction }: SmartHintsSystemProps) {
  const [currentHintLevel, setCurrentHintLevel] = useState(0);
  const [showHints, setShowHints] = useState(false);

  const hints = {
    translation: [
      {
        level: 1,
        type: 'text',
        title: 'Direction Hint',
        content: 'Vertical translations affect the output (result) of the function, not the input variables.',
        icon: <Lightbulb className="h-4 w-4" />
      },
      {
        level: 2,
        type: 'visual',
        title: 'Formula Pattern',
        content: 'For vertical translation by k units: f(x,y) becomes f(x,y) + k',
        icon: <Eye className="h-4 w-4" />
      },
      {
        level: 3,
        type: 'example',
        title: 'Specific Example',
        content: `If your base function is ${baseFunction}, adding 2 units vertically gives: ${baseFunction} + 2`,
        icon: <BookOpen className="h-4 w-4" />
      }
    ],
    reflection: [
      {
        level: 1,
        type: 'text',
        title: 'Sign Change',
        content: 'Reflections involve changing signs. Think about which part of the function needs a negative sign.',
        icon: <Lightbulb className="h-4 w-4" />
      },
      {
        level: 2,
        type: 'visual',
        title: 'Axis Reflection',
        content: 'Reflecting over the x-axis means multiplying the entire function by -1.',
        icon: <Eye className="h-4 w-4" />
      },
      {
        level: 3,
        type: 'example',
        title: 'Applied Example',
        content: `${baseFunction} reflected over x-axis becomes -(${baseFunction})`,
        icon: <BookOpen className="h-4 w-4" />
      }
    ],
    scaling: [
      {
        level: 1,
        type: 'text',
        title: 'Multiplication Factor',
        content: 'Vertical scaling multiplies the entire function by a constant.',
        icon: <Lightbulb className="h-4 w-4" />
      },
      {
        level: 2,
        type: 'visual',
        title: 'Scale Pattern',
        content: 'To scale vertically by factor k: f(x,y) becomes k × f(x,y)',
        icon: <Eye className="h-4 w-4" />
      },
      {
        level: 3,
        type: 'example',
        title: 'Concrete Example',
        content: `Scaling ${baseFunction} by factor 2 gives: 2 × (${baseFunction})`,
        icon: <BookOpen className="h-4 w-4" />
      }
    ]
  };

  const currentHints = hints[problemType] || hints.translation;
  const maxHints = currentHints.length;

  const showNextHint = () => {
    if (currentHintLevel < maxHints - 1) {
      setCurrentHintLevel(prev => prev + 1);
    }
  };

  const resetHints = () => {
    setCurrentHintLevel(0);
    setShowHints(false);
  };

  if (!showHints) {
    return (
      <Card className="p-6 bg-yellow-500/10 border-yellow-400/30">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Lightbulb className="h-6 w-6 text-yellow-400" />
            <div>
              <h3 className="font-semibold text-yellow-300">Need a Hint?</h3>
              <p className="text-sm text-yellow-200">
                You've made {attempts} attempts. Get some guidance to help you succeed!
              </p>
            </div>
          </div>
          <Button 
            onClick={() => setShowHints(true)}
            className="bg-yellow-500 hover:bg-yellow-600 text-black font-medium"
          >
            Get Hint
          </Button>
        </div>
      </Card>
    );
  }

  return (
    <Card className="p-6 bg-yellow-500/10 border-yellow-400/30">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-2">
          <Lightbulb className="h-5 w-5 text-yellow-400" />
          <h3 className="font-semibold text-yellow-300">Smart Hints</h3>
          <Badge variant="outline" className="border-yellow-400 text-yellow-400">
            Level {currentHintLevel + 1} of {maxHints}
          </Badge>
        </div>
        <Button 
          onClick={resetHints}
          variant="outline"
          size="sm"
          className="border-yellow-400/50 text-yellow-300 hover:bg-yellow-500/20"
        >
          Close Hints
        </Button>
      </div>

      <div className="space-y-4">
        {currentHints.slice(0, currentHintLevel + 1).map((hint, index) => (
          <div 
            key={index}
            className={`p-4 rounded-lg border transition-all ${
              index === currentHintLevel 
                ? 'bg-yellow-500/20 border-yellow-400 text-yellow-100'
                : 'bg-yellow-500/10 border-yellow-400/50 text-yellow-200'
            }`}
          >
            <div className="flex items-start space-x-3">
              <div className="mt-1">{hint.icon}</div>
              <div>
                <h4 className="font-medium mb-1">{hint.title}</h4>
                <p className="text-sm">{hint.content}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {currentHintLevel < maxHints - 1 && (
        <div className="mt-4 text-center">
          <Button 
            onClick={showNextHint}
            variant="outline"
            className="border-yellow-400/50 text-yellow-300 hover:bg-yellow-500/20"
          >
            Need More Help? ({maxHints - currentHintLevel - 1} hints remaining)
          </Button>
        </div>
      )}
    </Card>
  );
}
