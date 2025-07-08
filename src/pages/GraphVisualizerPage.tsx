
import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import MathVisualization from '@/components/MathVisualization';
import TransformationPanel from '@/components/TransformationPanel';
import ConceptExplanation from '@/components/ConceptExplanation';
import { StepByStepTransformation } from '@/components/features/StepByStepTransformation';

const GraphVisualizerPage = () => {
  const [currentFunction, setCurrentFunction] = useState('x^2 + y^2');
  const [transformations, setTransformations] = useState({
    translation: { x: 0, y: 0, z: 0 },
    scaling: { x: 1, y: 1, z: 1 },
    reflection: { x: false, y: false, z: false }
  });
  const [showStepByStep, setShowStepByStep] = useState(false);

  const handleTransformationChange = (type: string, values: any) => {
    setTransformations(prev => ({
      ...prev,
      [type]: values
    }));
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-white">Graph Visualizer</h1>
        <button
          onClick={() => setShowStepByStep(!showStepByStep)}
          className="px-4 py-2 bg-cyan-500 text-white rounded-lg hover:bg-cyan-600 transition-colors"
        >
          {showStepByStep ? 'Hide' : 'Show'} Step-by-Step
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Function Input */}
        <Card className="p-6 bg-black/30 border-white/20">
          <h3 className="text-lg font-semibold text-white mb-4">Function Input</h3>
          <Input
            value={currentFunction}
            onChange={(e) => setCurrentFunction(e.target.value)}
            placeholder="Enter function (e.g., x^2 + y^2)"
            className="bg-black/50 border-white/30 text-white"
          />
          <p className="text-sm text-gray-400 mt-2">
            Current: f(x,y) = {currentFunction}
          </p>
        </Card>

        {/* 3D Visualization */}
        <Card className="lg:col-span-2 bg-black/30 border-white/20">
          <MathVisualization 
            functionExpression={currentFunction}
            transformations={transformations}
          />
        </Card>
      </div>

      {showStepByStep && (
        <StepByStepTransformation
          functionExpression={currentFunction}
          transformations={transformations}
          onTransformationChange={handleTransformationChange}
        />
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <TransformationPanel
          transformations={transformations}
          onChange={handleTransformationChange}
        />

        <ConceptExplanation 
          transformations={transformations}
          onConceptExplored={(concept) => console.log('Concept explored:', concept)}
        />
      </div>
    </div>
  );
};

export default GraphVisualizerPage;
