import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { BarChart3, Play, Pause } from 'lucide-react';
import MathVisualization from '@/components/MathVisualization';
import { FunctionParser } from '@/lib/functionParser';

interface GraphInteractionPanelProps {
  functionExpression?: string;
  onParameterChange?: (params: any) => void;
}

const GraphInteractionPanel: React.FC<GraphInteractionPanelProps> = ({ 
  functionExpression = 'x^2 + y^2',
  onParameterChange 
}) => {
  const [transformations, setTransformations] = useState({
    translation: { x: 0, y: 0, z: 0 },
    rotation: { x: 0, y: 0, z: 0 },
    scale: { x: 1, y: 1, z: 1 }
  });
  const [isAnimating, setIsAnimating] = useState(false);
  const [animationSpeed, setAnimationSpeed] = useState([1]);

  const functionInfo = FunctionParser.parse(functionExpression);

  useEffect(() => {
    if (onParameterChange) {
      onParameterChange({ transformations, functionExpression });
    }
  }, [transformations, functionExpression, onParameterChange]);

  const handleTransformationChange = (type: string, axis: string, value: number) => {
    setTransformations(prev => ({
      ...prev,
      [type]: {
        ...prev[type as keyof typeof prev],
        [axis]: value
      }
    }));
  };

  const resetTransformations = () => {
    setTransformations({
      translation: { x: 0, y: 0, z: 0 },
      rotation: { x: 0, y: 0, z: 0 },
      scale: { x: 1, y: 1, z: 1 }
    });
  };

  // Simple animation effect
  useEffect(() => {
    if (!isAnimating) return;

    const interval = setInterval(() => {
      setTransformations(prev => ({
        ...prev,
        rotation: {
          ...prev.rotation,
          y: (prev.rotation.y + animationSpeed[0] * 0.02) % (Math.PI * 2)
        }
      }));
    }, 50);

    return () => clearInterval(interval);
  }, [isAnimating, animationSpeed]);

  if (!functionExpression || functionInfo.variables.length === 0) {
    return (
      <Card className="bg-black/30 border-white/20 h-fit">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <BarChart3 className="h-5 w-5" />
            Graph Interaction
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="text-center py-12">
            <div className="text-6xl mb-4">📊</div>
            <p className="text-gray-300 text-lg mb-2">Ready to visualize!</p>
            <p className="text-gray-400">Share a mathematical function to see it come to life.</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-black/30 border-white/20 h-fit">
      <CardHeader>
        <CardTitle className="text-white flex items-center gap-2">
          <BarChart3 className="h-5 w-5" />
          Interactive Graph
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Function Info */}
        <div className="space-y-2">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-sm text-gray-400">Function:</span>
            <Badge variant="outline" className="border-cyan-500/50 text-cyan-300">
              f({functionInfo.variables.join(',')}) = {functionExpression}
            </Badge>
          </div>
        </div>

        {/* 3D Visualization */}
        <div className="h-64 rounded-lg overflow-hidden bg-black/50">
          <MathVisualization 
            functionExpression={functionExpression}
            transformations={transformations}
          />
        </div>

        {/* Animation Controls */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-gray-300">Animation</span>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setIsAnimating(!isAnimating)}
                className={`p-2 rounded-lg transition-colors ${
                  isAnimating 
                    ? 'bg-green-600 hover:bg-green-700' 
                    : 'bg-gray-600 hover:bg-gray-700'
                }`}
              >
                {isAnimating ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
              </button>
            </div>
          </div>
          
          {isAnimating && (
            <div className="space-y-2">
              <label className="text-xs text-gray-400">Speed</label>
              <Slider
                value={animationSpeed}
                onValueChange={setAnimationSpeed}
                max={5}
                min={0.1}
                step={0.1}
                className="w-full"
              />
            </div>
          )}
        </div>

        {/* Transformation Controls */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-gray-300">Transformations</span>
            <button
              onClick={resetTransformations}
              className="text-xs text-gray-400 hover:text-gray-200 transition-colors"
            >
              Reset
            </button>
          </div>

          {/* Translation */}
          <div className="space-y-3">
            <label className="text-xs font-medium text-gray-400 uppercase tracking-wide">Translation</label>
            {['x', 'y', 'z'].map(axis => (
              <div key={`trans-${axis}`} className="space-y-1">
                <div className="flex justify-between">
                  <span className="text-xs text-gray-400">{axis.toUpperCase()}</span>
                  <span className="text-xs text-gray-300">{transformations.translation[axis as keyof typeof transformations.translation].toFixed(2)}</span>
                </div>
                <Slider
                  value={[transformations.translation[axis as keyof typeof transformations.translation]]}
                  onValueChange={(value) => handleTransformationChange('translation', axis, value[0])}
                  max={5}
                  min={-5}
                  step={0.1}
                  className="w-full"
                />
              </div>
            ))}
          </div>

          {/* Scale */}
          <div className="space-y-3">
            <label className="text-xs font-medium text-gray-400 uppercase tracking-wide">Scale</label>
            {['x', 'y', 'z'].map(axis => (
              <div key={`scale-${axis}`} className="space-y-1">
                <div className="flex justify-between">
                  <span className="text-xs text-gray-400">{axis.toUpperCase()}</span>
                  <span className="text-xs text-gray-300">{transformations.scale[axis as keyof typeof transformations.scale].toFixed(2)}</span>
                </div>
                <Slider
                  value={[transformations.scale[axis as keyof typeof transformations.scale]]}
                  onValueChange={(value) => handleTransformationChange('scale', axis, value[0])}
                  max={3}
                  min={0.1}
                  step={0.1}
                  className="w-full"
                />
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default GraphInteractionPanel;