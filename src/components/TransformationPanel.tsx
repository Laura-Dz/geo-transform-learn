import React from 'react';
import { Card } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';
import { RotateCcw, Move, Scale, FlipHorizontal } from 'lucide-react';

interface TransformationPanelProps {
  transformations: {
    translation: { x: number; y: number; z: number };
    scaling: { x: number; y: number; z: number };
    reflection: { x: boolean; y: boolean; z: boolean };
  };
  onChange: (type: string, values: any) => void;
}

const TransformationPanel: React.FC<TransformationPanelProps> = ({
  transformations,
  onChange
}) => {
  const handleTranslationChange = (axis: 'x' | 'y' | 'z', value: number[]) => {
    onChange('translation', {
      ...transformations.translation,
      [axis]: value[0]
    });
  };

  const handleScalingChange = (axis: 'x' | 'y' | 'z', value: number[]) => {
    onChange('scaling', {
      ...transformations.scaling,
      [axis]: value[0]
    });
  };

  const handleReflectionChange = (axis: 'x' | 'y' | 'z', checked: boolean) => {
    onChange('reflection', {
      ...transformations.reflection,
      [axis]: checked
    });
  };

  const resetTransformations = () => {
    onChange('translation', { x: 0, y: 0, z: 0 });
    onChange('scaling', { x: 1, y: 1, z: 1 });
    onChange('reflection', { x: false, y: false, z: false });
  };

  const getTransformedEquation = () => {
    const { translation, scaling, reflection } = transformations;
    let equation = 'f(x,y) = ';
    
    // Build the transformed equation string
    let xTerm = 'x';
    let yTerm = 'y';
    
    // Apply scaling
    if (scaling.x !== 1) xTerm = `${scaling.x}x`;
    if (scaling.y !== 1) yTerm = `${scaling.y}y`;
    
    // Apply reflection
    if (reflection.x) xTerm = `-${xTerm}`;
    if (reflection.y) yTerm = `-${yTerm}`;
    
    // Apply translation
    if (translation.x !== 0) {
      xTerm = `(${xTerm} ${translation.x >= 0 ? '+' : ''}${translation.x})`;
    }
    if (translation.y !== 0) {
      yTerm = `(${yTerm} ${translation.y >= 0 ? '+' : ''}${translation.y})`;
    }
    
    equation += `${xTerm}² + ${yTerm}²`;
    
    // Apply vertical scaling and translation
    if (scaling.z !== 1) equation = `${scaling.z} × (${equation})`;
    if (translation.z !== 0) equation += ` ${translation.z >= 0 ? '+' : ''}${translation.z}`;
    
    return equation;
  };

  return (
    <Card className="p-6 bg-black/30 border-white/20">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-white">Transformations</h3>
        <Button 
          variant="outline" 
          size="sm" 
          onClick={resetTransformations}
          className="border-white/30 text-white hover:bg-white/10"
        >
          <RotateCcw className="h-4 w-4 mr-2" />
          Reset
        </Button>
      </div>

      <div className="space-y-6">
        {/* Translation */}
        <div className="space-y-4">
          <div className="flex items-center space-x-2">
            <Move className="h-4 w-4 text-cyan-400" />
            <Label className="text-white font-medium">Translation</Label>
          </div>
          
          <div className="space-y-3">
            {(['x', 'y', 'z'] as const).map((axis) => (
              <div key={axis} className="space-y-2">
                <div className="flex justify-between">
                  <Label className="text-sm text-gray-300">{axis.toUpperCase()}-axis</Label>
                  <span className="text-sm text-white">
                    {transformations.translation[axis].toFixed(1)}
                  </span>
                </div>
                <Slider
                  value={[transformations.translation[axis]]}
                  onValueChange={(value) => handleTranslationChange(axis, value)}
                  min={-5}
                  max={5}
                  step={0.1}
                  className="slider-cyan"
                />
              </div>
            ))}
          </div>
        </div>

        {/* Scaling */}
        <div className="space-y-4">
          <div className="flex items-center space-x-2">
            <Scale className="h-4 w-4 text-yellow-400" />
            <Label className="text-white font-medium">Scaling</Label>
          </div>
          
          <div className="space-y-3">
            {(['x', 'y', 'z'] as const).map((axis) => (
              <div key={axis} className="space-y-2">
                <div className="flex justify-between">
                  <Label className="text-sm text-gray-300">{axis.toUpperCase()}-axis</Label>
                  <span className="text-sm text-white">
                    {transformations.scaling[axis].toFixed(1)}
                  </span>
                </div>
                <Slider
                  value={[transformations.scaling[axis]]}
                  onValueChange={(value) => handleScalingChange(axis, value)}
                  min={0.1}
                  max={3}
                  step={0.1}
                  className="slider-yellow"
                />
              </div>
            ))}
          </div>
        </div>

        {/* Reflection */}
        <div className="space-y-4">
          <div className="flex items-center space-x-2">
            <FlipHorizontal className="h-4 w-4 text-purple-400" />
            <Label className="text-white font-medium">Reflection</Label>
          </div>
          
          <div className="space-y-3">
            {(['x', 'y', 'z'] as const).map((axis) => (
              <div key={axis} className="flex items-center justify-between">
                <Label className="text-sm text-gray-300">
                  Reflect over {axis.toUpperCase()}-axis
                </Label>
                <Switch
                  checked={transformations.reflection[axis]}
                  onCheckedChange={(checked) => handleReflectionChange(axis, checked)}
                />
              </div>
            ))}
          </div>
        </div>

        {/* Current Equation */}
        <div className="p-4 bg-slate-800/50 rounded-lg border border-white/10">
          <Label className="text-sm text-gray-300 mb-2 block">Current Equation</Label>
          <p className="text-sm font-mono text-cyan-300">
            {getTransformedEquation()}
          </p>
        </div>
      </div>
    </Card>
  );
};

export default TransformationPanel;
