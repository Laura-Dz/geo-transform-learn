
import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Play, Pause, RotateCcw, ChevronRight } from 'lucide-react';

interface StepByStepTransformationProps {
  functionExpression: string;
  transformations: {
    translation: { x: number; y: number; z: number };
    rotation: { x: number; y: number; z: number };
    scale: { x: number; y: number; z: number };
  };
  onTransformationChange: (type: string, values: any) => void;
}

export function StepByStepTransformation({ 
  functionExpression, 
  transformations, 
  onTransformationChange 
}: StepByStepTransformationProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const [animationSpeed, setAnimationSpeed] = useState(1000);

  const steps = [
    {
      title: 'Original Function',
      description: 'Starting with the base function',
      equation: functionExpression,
      transformValues: {
        translation: { x: 0, y: 0, z: 0 },
        rotation: { x: 0, y: 0, z: 0 },
        scale: { x: 1, y: 1, z: 1 }
      }
    },
    {
      title: 'Apply Translation',
      description: 'Moving the graph in 3D space',
      equation: `f(x-${transformations.translation.x}, y-${transformations.translation.y}) + ${transformations.translation.z}`,
      transformValues: {
        translation: transformations.translation,
        rotation: { x: 0, y: 0, z: 0 },
        scale: { x: 1, y: 1, z: 1 }
      }
    },
    {
      title: 'Apply Rotation',
      description: 'Rotating the graph around axes',
      equation: `Rotated by (${transformations.rotation.x}°, ${transformations.rotation.y}°, ${transformations.rotation.z}°)`,
      transformValues: {
        translation: transformations.translation,
        rotation: transformations.rotation,
        scale: { x: 1, y: 1, z: 1 }
      }
    },
    {
      title: 'Apply Scaling',
      description: 'Stretching or compressing the graph',
      equation: `Scaled by (${transformations.scale.x}, ${transformations.scale.y}, ${transformations.scale.z})`,
      transformValues: transformations
    }
  ];

  const playAnimation = () => {
    setIsAnimating(true);
    setCurrentStep(0);
    
    const interval = setInterval(() => {
      setCurrentStep(prev => {
        if (prev >= steps.length - 1) {
          setIsAnimating(false);
          clearInterval(interval);
          return prev;
        }
        onTransformationChange('translation', steps[prev + 1].transformValues.translation);
        onTransformationChange('rotation', steps[prev + 1].transformValues.rotation);
        onTransformationChange('scale', steps[prev + 1].transformValues.scale);
        return prev + 1;
      });
    }, animationSpeed);
  };

  const resetAnimation = () => {
    setCurrentStep(0);
    setIsAnimating(false);
    onTransformationChange('translation', { x: 0, y: 0, z: 0 });
    onTransformationChange('rotation', { x: 0, y: 0, z: 0 });
    onTransformationChange('scale', { x: 1, y: 1, z: 1 });
  };

  const goToStep = (stepIndex: number) => {
    setCurrentStep(stepIndex);
    const step = steps[stepIndex];
    onTransformationChange('translation', step.transformValues.translation);
    onTransformationChange('rotation', step.transformValues.rotation);
    onTransformationChange('scale', step.transformValues.scale);
  };

  return (
    <Card className="p-6 bg-black/30 border-white/20">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-semibold text-white">Step-by-Step Transformation</h3>
        <div className="flex items-center space-x-2">
          <Button
            onClick={playAnimation}
            disabled={isAnimating}
            size="sm"
            className="bg-green-500 hover:bg-green-600"
          >
            <Play className="h-4 w-4 mr-2" />
            {isAnimating ? 'Playing...' : 'Play Animation'}
          </Button>
          <Button
            onClick={resetAnimation}
            size="sm"
            variant="outline"
            className="border-white/30 text-white hover:bg-white/10"
          >
            <RotateCcw className="h-4 w-4 mr-2" />
            Reset
          </Button>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="mb-6">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm text-gray-300">Progress</span>
          <span className="text-sm text-cyan-400">
            Step {currentStep + 1} of {steps.length}
          </span>
        </div>
        <div className="w-full bg-gray-700 rounded-full h-2">
          <div
            className="bg-cyan-500 h-2 rounded-full transition-all duration-300"
            style={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
          />
        </div>
      </div>

      {/* Steps */}
      <div className="space-y-4">
        {steps.map((step, index) => (
          <div
            key={index}
            className={`p-4 rounded-lg border transition-all cursor-pointer ${
              index === currentStep
                ? 'bg-cyan-500/20 border-cyan-400 text-white'
                : index < currentStep
                ? 'bg-green-500/10 border-green-400 text-gray-300'
                : 'bg-gray-800/50 border-gray-600 text-gray-400'
            }`}
            onClick={() => goToStep(index)}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <Badge
                  variant={index === currentStep ? 'default' : index < currentStep ? 'secondary' : 'outline'}
                  className={
                    index === currentStep 
                      ? 'bg-cyan-500 text-white' 
                      : index < currentStep 
                      ? 'bg-green-500 text-white' 
                      : 'border-gray-600 text-gray-400'
                  }
                >
                  {index + 1}
                </Badge>
                <div>
                  <h4 className="font-medium">{step.title}</h4>
                  <p className="text-sm opacity-80">{step.description}</p>
                </div>
              </div>
              <ChevronRight className="h-4 w-4" />
            </div>
            
            {index === currentStep && (
              <div className="mt-3 p-3 bg-black/30 rounded border border-cyan-400/30">
                <p className="text-sm font-mono text-cyan-300">{step.equation}</p>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Animation Speed Control */}
      <div className="mt-6 p-4 bg-black/20 rounded-lg">
        <label className="text-sm text-gray-300 block mb-2">Animation Speed</label>
        <input
          type="range"
          min="500"
          max="3000"
          value={animationSpeed}
          onChange={(e) => setAnimationSpeed(Number(e.target.value))}
          className="w-full"
        />
        <div className="flex justify-between text-xs text-gray-400 mt-1">
          <span>Fast (0.5s)</span>
          <span>Slow (3s)</span>
        </div>
      </div>
    </Card>
  );
}
