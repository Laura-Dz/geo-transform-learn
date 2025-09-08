
import React, { useState, useMemo } from 'react';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import MathVisualization from '@/components/MathVisualization';
import TransformationPanel from '@/components/TransformationPanel';
import ConceptExplanation from '@/components/ConceptExplanation';
import { StepByStepTransformation } from '@/components/features/StepByStepTransformation';
import { FunctionParser } from '@/lib/functionParser';

const GraphVisualizerPage = () => {
  const [currentFunction, setCurrentFunction] = useState('x^2 + y^2');
  const [transformations, setTransformations] = useState({
    translation: { x: 0, y: 0, z: 0 },
    rotation: { x: 0, y: 0, z: 0 },
    scale: { x: 1, y: 1, z: 1 }
  });
  const [showStepByStep, setShowStepByStep] = useState(false);

  const functionInfo = useMemo(() => {
    return FunctionParser.parse(currentFunction);
  }, [currentFunction]);

  const handleTransformationChange = (type: string, values: any) => {
    setTransformations(prev => ({
      ...prev,
      [type]: values
    }));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <div className="container mx-auto px-4 py-6">
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h1 className="text-3xl font-bold text-white">Graph Visualizer</h1>
            <Button
              onClick={() => setShowStepByStep(!showStepByStep)}
              className="px-4 py-2 bg-cyan-500 text-white rounded-lg hover:bg-cyan-600 transition-colors"
            >
              {showStepByStep ? 'Hide' : 'Show'} Step-by-Step
            </Button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Enhanced Function Input */}
            <Card className="p-6 bg-black/30 border-white/20">
              <h3 className="text-lg font-semibold text-white mb-4">Function Input</h3>
              
              {/* Function Expression Input */}
              <div className="space-y-4">
                <Input
                  value={currentFunction}
                  onChange={(e) => setCurrentFunction(e.target.value)}
                  placeholder="Enter function (e.g., x^2 + y^2, sin(x), x^3 + y^2 - z)"
                  className="bg-black/50 border-white/30 text-white placeholder:text-gray-400"
                />
                
                {/* Function Info Display */}
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-400">Variables:</span>
                    {functionInfo.variables.map(variable => (
                      <Badge key={variable} variant="secondary" className="bg-cyan-500/20 text-cyan-300">
                        {variable}
                      </Badge>
                    ))}
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-400">Type:</span>
                    <Badge variant="outline" className="border-yellow-500/50 text-yellow-300">
                      {functionInfo.type}
                    </Badge>
                    <span className="text-sm text-gray-400">Mode:</span>
                    <Badge variant="outline" className="border-purple-500/50 text-purple-300">
                      {FunctionParser.getVisualizationMode(functionInfo)}
                    </Badge>
                  </div>
                </div>
                
                {/* Sample Functions Dropdown */}
                <div className="space-y-2">
                  <label className="text-sm text-gray-400">Quick Examples:</label>
                  <Select onValueChange={(value) => setCurrentFunction(value)}>
                    <SelectTrigger className="bg-black/50 border-white/30 text-white">
                      <SelectValue placeholder="Choose a sample function" />
                    </SelectTrigger>
                    <SelectContent className="bg-slate-800 border-white/30">
                      {Object.entries(FunctionParser.getSampleFunctions()).map(([name, expr]) => (
                        <SelectItem key={name} value={expr} className="text-white hover:bg-slate-700">
                          {name}: {expr}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <p className="text-sm text-gray-400">
                  Current: f({functionInfo.variables.join(',')}) = {currentFunction}
                </p>
              </div>
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
              functionInfo={functionInfo}
            />

            <ConceptExplanation 
              transformations={transformations}
              onConceptExplored={(concept) => console.log('Concept explored:', concept)}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default GraphVisualizerPage;
