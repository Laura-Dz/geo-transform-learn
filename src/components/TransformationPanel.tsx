import React from 'react';
import { Card } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';
import { RotateCcw, Move, Scale, FlipHorizontal } from 'lucide-react';
import { FunctionParser, FunctionInfo } from '@/lib/functionParser';

interface TransformationPanelProps {
  transformations: {
    translation: { x: number; y: number; z: number };
    rotation: { x: number; y: number; z: number };
    scale: { x: number; y: number; z: number };
  };
  onChange: (type: string, values: any) => void;
  functionInfo?: FunctionInfo;
}

const TransformationPanel: React.FC<TransformationPanelProps> = ({
  transformations,
  onChange,
  functionInfo
}) => {
  const handleTranslationChange = (axis: 'x' | 'y' | 'z', value: number[]) => {
    onChange('translation', {
      ...transformations.translation,
      [axis]: value[0]
    });
  };

  const handleRotationChange = (axis: 'x' | 'y' | 'z', value: number[]) => {
    onChange('rotation', {
      ...transformations.rotation,
      [axis]: value[0]
    });
  };

  const handleScaleChange = (axis: 'x' | 'y' | 'z', value: number[]) => {
    onChange('scale', {
      ...transformations.scale,
      [axis]: value[0]
    });
  };


  const resetTransformations = () => {
    onChange('translation', { x: 0, y: 0, z: 0 });
    onChange('rotation', { x: 0, y: 0, z: 0 });
    onChange('scale', { x: 1, y: 1, z: 1 });
  };

  const getTransformedEquation = () => {
    if (!functionInfo) return 'f(x,y) = x² + y²';
    
    const { translation, rotation, scale } = transformations;
    const variables = functionInfo.variables;
    
    let equation = `f(${variables.join(',')}) = `;
    
    // Build transformation description based on function type
    const transformations_applied = [];
    
    // Check for translations
    const nonZeroTranslations = Object.entries(translation)
      .filter(([_, value]) => value !== 0)
      .map(([axis, value]) => `${axis}: ${value > 0 ? '+' : ''}${value}`);
    if (nonZeroTranslations.length > 0) {
      transformations_applied.push(`Translated (${nonZeroTranslations.join(', ')})`);
    }
    
    // Check for rotations
    const nonZeroRotations = Object.entries(rotation)
      .filter(([_, value]) => value !== 0)
      .map(([axis, value]) => `${axis}: ${value}°`);
    if (nonZeroRotations.length > 0) {
      transformations_applied.push(`Rotated (${nonZeroRotations.join(', ')})`);
    }
    
    // Check for scaling
    const nonUnityScaling = Object.entries(scale)
      .filter(([_, value]) => value !== 1)
      .map(([axis, value]) => `${axis}: ×${value}`);
    if (nonUnityScaling.length > 0) {
      transformations_applied.push(`Scaled (${nonUnityScaling.join(', ')})`);
    }
    
    
    if (transformations_applied.length === 0) {
      equation += functionInfo.expression;
    } else {
      equation += `${functionInfo.expression} [${transformations_applied.join(', ')}]`;
    }
    
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
          Reset All
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
            {(['x', 'y', 'z'] as const).map((axis) => {
              // Show relevant axes based on function type
              const isRelevant = !functionInfo || 
                functionInfo.variables.includes(axis) || 
                (axis === 'z' && functionInfo.type !== 'single');
              
              if (!isRelevant) return null;
              
              return (
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
              );
            })}
          </div>
        </div>

        {/* Rotation */}
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <RotateCcw className="h-4 w-4" />
            <Label className="font-medium">Rotation</Label>
          </div>
          
          {(['x', 'y', 'z'] as const).map((axis) => (
            <div key={axis} className="space-y-2">
              <div className="flex items-center justify-between">
                <Label className="text-sm">{axis.toUpperCase()}-axis</Label>
                <span className="text-sm text-muted-foreground">
                  {transformations.rotation[axis].toFixed(0)}°
                </span>
              </div>
              <Slider
                value={[transformations.rotation[axis]]}
                onValueChange={(value) => handleRotationChange(axis, value)}
                min={-180}
                max={180}
                step={1}
                className="w-full"
              />
            </div>
          ))}
        </div>

        {/* Scale */}
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <Scale className="h-4 w-4" />
            <Label className="font-medium">Scale</Label>
          </div>
          
          {(['x', 'y', 'z'] as const).map((axis) => (
            <div key={axis} className="space-y-2">
              <div className="flex items-center justify-between">
                <Label className="text-sm">{axis.toUpperCase()}-axis</Label>
                <span className="text-sm text-muted-foreground">
                  {transformations.scale[axis].toFixed(2)}
                </span>
              </div>
              <Slider
                value={[transformations.scale[axis]]}
                onValueChange={(value) => handleScaleChange(axis, value)}
                min={0.1}
                max={3}
                step={0.1}
                className="w-full"
              />
            </div>
          ))}
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
