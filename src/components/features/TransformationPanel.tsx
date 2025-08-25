import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { 
  Move3D, 
  RotateCcw, 
  Maximize, 
  RefreshCw, 
  Save, 
  Download,
  Upload,
  Eye,
  EyeOff,
  Palette,
  Settings
} from 'lucide-react';
import { TransformationParameters, VisualizationConfig } from '@/types/ui';

interface TransformationPanelProps {
  currentFunction: string;
  transformations: TransformationParameters;
  visualConfig: VisualizationConfig;
  onTransformationChange: (transformations: TransformationParameters) => void;
  onVisualizationConfigChange: (config: VisualizationConfig) => void;
  onSaveFunction?: (name: string, params: any) => void;
  onLoadFunction?: (params: any) => void;
}

const TransformationPanel: React.FC<TransformationPanelProps> = ({
  currentFunction,
  transformations,
  visualConfig,
  onTransformationChange,
  onVisualizationConfigChange,
  onSaveFunction,
  onLoadFunction
}) => {
  const [isVisible, setIsVisible] = useState(true);
  const [presetName, setPresetName] = useState('');
  const [animationSpeed, setAnimationSpeed] = useState(1);
  const [isAnimating, setIsAnimating] = useState(false);

  // Animation loop for transformations
  useEffect(() => {
    let animationFrame: number;
    
    if (isAnimating) {
      const animate = () => {
        const time = Date.now() * 0.001 * animationSpeed;
        
        onTransformationChange({
          ...transformations,
          rotation: {
            x: transformations.rotation.x,
            y: Math.sin(time) * 45,
            z: transformations.rotation.z
          }
        });
        
        animationFrame = requestAnimationFrame(animate);
      };
      
      animationFrame = requestAnimationFrame(animate);
    }
    
    return () => {
      if (animationFrame) {
        cancelAnimationFrame(animationFrame);
      }
    };
  }, [isAnimating, animationSpeed, transformations, onTransformationChange]);

  const handleTransformationChange = (
    type: 'translation' | 'rotation' | 'scale',
    axis: 'x' | 'y' | 'z',
    value: number
  ) => {
    onTransformationChange({
      ...transformations,
      [type]: {
        ...transformations[type],
        [axis]: value
      }
    });
  };

  const handleVisualizationChange = (key: keyof VisualizationConfig, value: any) => {
    onVisualizationConfigChange({
      ...visualConfig,
      [key]: value
    });
  };

  const resetTransformations = () => {
    onTransformationChange({
      translation: { x: 0, y: 0, z: 0 },
      rotation: { x: 0, y: 0, z: 0 },
      scale: { x: 1, y: 1, z: 1 }
    });
  };

  const saveCurrentState = () => {
    if (presetName && onSaveFunction) {
      onSaveFunction(presetName, {
        function: currentFunction,
        transformations,
        visualConfig
      });
      setPresetName('');
    }
  };

  const exportConfiguration = () => {
    const config = {
      function: currentFunction,
      transformations,
      visualConfig,
      timestamp: new Date().toISOString()
    };
    
    const blob = new Blob([JSON.stringify(config, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `3d-function-config-${Date.now()}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const importConfiguration = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const config = JSON.parse(e.target?.result as string);
          if (config.transformations) {
            onTransformationChange(config.transformations);
          }
          if (config.visualConfig) {
            onVisualizationConfigChange(config.visualConfig);
          }
          if (onLoadFunction && config.function) {
            onLoadFunction(config);
          }
        } catch (error) {
          console.error('Failed to import configuration:', error);
        }
      };
      reader.readAsText(file);
    }
  };

  if (!isVisible) {
    return (
      <Button
        variant="outline"
        size="sm"
        className="fixed right-4 top-20 z-50"
        onClick={() => setIsVisible(true)}
      >
        <Settings className="h-4 w-4" />
      </Button>
    );
  }

  return (
    <Card className="fixed right-4 top-4 w-80 max-h-[calc(100vh-2rem)] overflow-y-auto z-40 bg-white/95 dark:bg-gray-900/95 backdrop-blur-sm">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-lg">3D Controls</CardTitle>
            <CardDescription className="text-sm">Transform and visualize functions</CardDescription>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsVisible(false)}
          >
            <EyeOff className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        <Tabs defaultValue="transform" className="space-y-4">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="transform">Transform</TabsTrigger>
            <TabsTrigger value="visual">Visual</TabsTrigger>
            <TabsTrigger value="presets">Presets</TabsTrigger>
          </TabsList>

          <TabsContent value="transform" className="space-y-4">
            {/* Translation Controls */}
            <div className="space-y-3">
              <div className="flex items-center space-x-2">
                <Move3D className="h-4 w-4" />
                <Label className="font-medium">Translation</Label>
              </div>
              
              {(['x', 'y', 'z'] as const).map((axis) => (
                <div key={axis} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label className="text-sm">{axis.toUpperCase()}</Label>
                    <Badge variant="outline" className="text-xs">
                      {transformations.translation[axis].toFixed(1)}
                    </Badge>
                  </div>
                  <Slider
                    value={[transformations.translation[axis]]}
                    onValueChange={([value]) => handleTransformationChange('translation', axis, value)}
                    min={-10}
                    max={10}
                    step={0.1}
                    className="w-full"
                  />
                </div>
              ))}
            </div>

            {/* Rotation Controls */}
            <div className="space-y-3">
              <div className="flex items-center space-x-2">
                <RotateCcw className="h-4 w-4" />
                <Label className="font-medium">Rotation</Label>
              </div>
              
              {(['x', 'y', 'z'] as const).map((axis) => (
                <div key={axis} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label className="text-sm">{axis.toUpperCase()}</Label>
                    <Badge variant="outline" className="text-xs">
                      {transformations.rotation[axis].toFixed(0)}°
                    </Badge>
                  </div>
                  <Slider
                    value={[transformations.rotation[axis]]}
                    onValueChange={([value]) => handleTransformationChange('rotation', axis, value)}
                    min={-180}
                    max={180}
                    step={1}
                    className="w-full"
                  />
                </div>
              ))}
            </div>

            {/* Scale Controls */}
            <div className="space-y-3">
              <div className="flex items-center space-x-2">
                <Maximize className="h-4 w-4" />
                <Label className="font-medium">Scale</Label>
              </div>
              
              {(['x', 'y', 'z'] as const).map((axis) => (
                <div key={axis} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label className="text-sm">{axis.toUpperCase()}</Label>
                    <Badge variant="outline" className="text-xs">
                      {transformations.scale[axis].toFixed(2)}
                    </Badge>
                  </div>
                  <Slider
                    value={[transformations.scale[axis]]}
                    onValueChange={([value]) => handleTransformationChange('scale', axis, value)}
                    min={0.1}
                    max={3}
                    step={0.1}
                    className="w-full"
                  />
                </div>
              ))}
            </div>

            {/* Animation Controls */}
            <div className="space-y-3 pt-2 border-t">
              <div className="flex items-center justify-between">
                <Label className="font-medium">Auto Rotate</Label>
                <Switch
                  checked={isAnimating}
                  onCheckedChange={setIsAnimating}
                />
              </div>
              
              {isAnimating && (
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label className="text-sm">Speed</Label>
                    <Badge variant="outline" className="text-xs">
                      {animationSpeed.toFixed(1)}x
                    </Badge>
                  </div>
                  <Slider
                    value={[animationSpeed]}
                    onValueChange={([value]) => setAnimationSpeed(value)}
                    min={0.1}
                    max={3}
                    step={0.1}
                    className="w-full"
                  />
                </div>
              )}
            </div>

            <Button
              variant="outline"
              onClick={resetTransformations}
              className="w-full"
            >
              <RefreshCw className="h-4 w-4 mr-2" />
              Reset All
            </Button>
          </TabsContent>

          <TabsContent value="visual" className="space-y-4">
            {/* Grid Controls */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <Label className="font-medium">Show Grid</Label>
                <Switch
                  checked={visualConfig.showGrid}
                  onCheckedChange={(checked) => handleVisualizationChange('showGrid', checked)}
                />
              </div>
              
              {visualConfig.showGrid && (
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label className="text-sm">Grid Size</Label>
                    <Badge variant="outline" className="text-xs">
                      {visualConfig.gridSize}
                    </Badge>
                  </div>
                  <Slider
                    value={[visualConfig.gridSize]}
                    onValueChange={([value]) => handleVisualizationChange('gridSize', value)}
                    min={5}
                    max={50}
                    step={5}
                    className="w-full"
                  />
                </div>
              )}
            </div>

            {/* Axes Controls */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <Label className="font-medium">Show Axes</Label>
                <Switch
                  checked={visualConfig.showAxes}
                  onCheckedChange={(checked) => handleVisualizationChange('showAxes', checked)}
                />
              </div>
              
              {visualConfig.showAxes && (
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label className="text-sm">Axis Length</Label>
                    <Badge variant="outline" className="text-xs">
                      {visualConfig.axisLength}
                    </Badge>
                  </div>
                  <Slider
                    value={[visualConfig.axisLength]}
                    onValueChange={([value]) => handleVisualizationChange('axisLength', value)}
                    min={5}
                    max={20}
                    step={1}
                    className="w-full"
                  />
                </div>
              )}
            </div>

            {/* Lighting Controls */}
            <div className="space-y-3">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label className="text-sm">Light Intensity</Label>
                  <Badge variant="outline" className="text-xs">
                    {visualConfig.lightIntensity.toFixed(1)}
                  </Badge>
                </div>
                <Slider
                  value={[visualConfig.lightIntensity]}
                  onValueChange={([value]) => handleVisualizationChange('lightIntensity', value)}
                  min={0.1}
                  max={2}
                  step={0.1}
                  className="w-full"
                />
              </div>
            </div>

            {/* Background Color */}
            <div className="space-y-3">
              <Label className="font-medium">Background</Label>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { name: 'Dark', value: '#1a1a1a' },
                  { name: 'Light', value: '#ffffff' },
                  { name: 'Blue', value: '#1e3a8a' }
                ].map((color) => (
                  <Button
                    key={color.name}
                    variant={visualConfig.backgroundColor === color.value ? "default" : "outline"}
                    size="sm"
                    onClick={() => handleVisualizationChange('backgroundColor', color.value)}
                    className="text-xs"
                  >
                    <div 
                      className="w-3 h-3 rounded mr-1" 
                      style={{ backgroundColor: color.value }}
                    />
                    {color.name}
                  </Button>
                ))}
              </div>
            </div>

            {/* Camera Position */}
            <div className="space-y-3">
              <Label className="font-medium">Camera Position</Label>
              {(['x', 'y', 'z'] as const).map((axis) => (
                <div key={axis} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label className="text-sm">{axis.toUpperCase()}</Label>
                    <Badge variant="outline" className="text-xs">
                      {visualConfig.cameraPosition[axis].toFixed(1)}
                    </Badge>
                  </div>
                  <Slider
                    value={[visualConfig.cameraPosition[axis]]}
                    onValueChange={([value]) => handleVisualizationChange('cameraPosition', {
                      ...visualConfig.cameraPosition,
                      [axis]: value
                    })}
                    min={axis === 'z' ? 5 : -10}
                    max={axis === 'z' ? 20 : 10}
                    step={0.5}
                    className="w-full"
                  />
                </div>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="presets" className="space-y-4">
            {/* Save Preset */}
            <div className="space-y-3">
              <Label className="font-medium">Save Current State</Label>
              <div className="flex space-x-2">
                <Input
                  placeholder="Preset name..."
                  value={presetName}
                  onChange={(e) => setPresetName(e.target.value)}
                  className="flex-1"
                />
                <Button
                  size="sm"
                  onClick={saveCurrentState}
                  disabled={!presetName}
                >
                  <Save className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {/* Export/Import */}
            <div className="space-y-3">
              <Label className="font-medium">Configuration</Label>
              <div className="flex space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={exportConfiguration}
                  className="flex-1"
                >
                  <Download className="h-4 w-4 mr-2" />
                  Export
                </Button>
                <div className="flex-1">
                  <Input
                    type="file"
                    accept=".json"
                    onChange={importConfiguration}
                    className="hidden"
                    id="import-config"
                  />
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => document.getElementById('import-config')?.click()}
                    className="w-full"
                  >
                    <Upload className="h-4 w-4 mr-2" />
                    Import
                  </Button>
                </div>
              </div>
            </div>

            {/* Quick Presets */}
            <div className="space-y-3">
              <Label className="font-medium">Quick Presets</Label>
              <div className="grid grid-cols-2 gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    onTransformationChange({
                      translation: { x: 0, y: 0, z: 0 },
                      rotation: { x: -30, y: 45, z: 0 },
                      scale: { x: 1, y: 1, z: 1 }
                    });
                  }}
                >
                  Isometric
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    onTransformationChange({
                      translation: { x: 0, y: 0, z: 0 },
                      rotation: { x: 0, y: 0, z: 0 },
                      scale: { x: 1, y: 1, z: 1 }
                    });
                  }}
                >
                  Front View
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    onTransformationChange({
                      translation: { x: 0, y: 0, z: 0 },
                      rotation: { x: -90, y: 0, z: 0 },
                      scale: { x: 1, y: 1, z: 1 }
                    });
                  }}
                >
                  Top View
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    onTransformationChange({
                      translation: { x: 0, y: 0, z: 0 },
                      rotation: { x: 0, y: 90, z: 0 },
                      scale: { x: 1, y: 1, z: 1 }
                    });
                  }}
                >
                  Side View
                </Button>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default TransformationPanel;
