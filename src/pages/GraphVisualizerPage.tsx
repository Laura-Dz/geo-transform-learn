
import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import MathVisualization from '@/components/MathVisualization';
import TransformationPanel from '@/components/features/TransformationPanel';
import ConceptExplanation from '@/components/ConceptExplanation';
import { StepByStepTransformation } from '@/components/features/StepByStepTransformation';
import AIAssistant from '@/components/ai/AIAssistant';
import ConceptLibrary from '@/components/concept/ConceptLibrary';
import QuizSystem from '@/components/quiz/QuizSystem';
import ProgressDashboard from '@/components/dashboard/ProgressDashboard';
import { FunctionParser } from '@/lib/functionParser';
import { TransformationParameters, VisualizationConfig } from '@/types/ui';

const GraphVisualizerPage = () => {
  const [currentFunction, setCurrentFunction] = useState('x^2 + y^2');
  const [transformations, setTransformations] = useState<TransformationParameters>({
    translation: { x: 0, y: 0, z: 0 },
    rotation: { x: 0, y: 0, z: 0 },
    scale: { x: 1, y: 1, z: 1 }
  });
  const [visualConfig, setVisualConfig] = useState<VisualizationConfig>({
    showGrid: true,
    showAxes: true,
    gridSize: 20,
    axisLength: 10,
    lightIntensity: 1.0,
    backgroundColor: '#1a1a1a',
    cameraPosition: { x: 5, y: 5, z: 10 }
  });
  const [activeTab, setActiveTab] = useState('visualizer');

  const functionInfo = useMemo(() => {
    return FunctionParser.parse(currentFunction);
  }, [currentFunction]);

  const handleTransformationChange = (newTransformations: TransformationParameters) => {
    setTransformations(newTransformations);
  };

  const handleVisualizationConfigChange = (newConfig: VisualizationConfig) => {
    setVisualConfig(newConfig);
  };

  const handleSaveFunction = (name: string, params: any) => {
    // Mock save functionality - in real app would save to database
    console.log('Saving function:', name, params);
  };

  const handleLoadFunction = (params: any) => {
    // Mock load functionality - in real app would load from database
    if (params.function) setCurrentFunction(params.function);
    if (params.transformations) setTransformations(params.transformations);
    if (params.visualConfig) setVisualConfig(params.visualConfig);
  };

  // Convert new transformation format to legacy format for MathVisualization
  const legacyTransformations = useMemo(() => ({
    translation: transformations.translation,
    rotation: transformations.rotation,
    scale: transformations.scale
  }), [transformations]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <div className="container mx-auto px-4 py-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-4xl font-bold text-white mb-2">3D Geometry Learning Platform</h1>
            <p className="text-gray-300">Explore, visualize, and master mathematical functions</p>
          </div>
        </div>

        {/* Main Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-5 bg-black/30 border-white/20">
            <TabsTrigger value="visualizer" className="text-white data-[state=active]:bg-blue-600">
              3D Visualizer
            </TabsTrigger>
            <TabsTrigger value="concepts" className="text-white data-[state=active]:bg-green-600">
              Concepts
            </TabsTrigger>
            <TabsTrigger value="quiz" className="text-white data-[state=active]:bg-purple-600">
              Practice
            </TabsTrigger>
            <TabsTrigger value="progress" className="text-white data-[state=active]:bg-orange-600">
              Progress
            </TabsTrigger>
            <TabsTrigger value="ai" className="text-white data-[state=active]:bg-cyan-600">
              AI Tutor
            </TabsTrigger>
          </TabsList>

          {/* 3D Visualizer Tab */}
          <TabsContent value="visualizer" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Function Input Panel */}
              <Card className="bg-black/30 border-white/20">
                <CardHeader>
                  <CardTitle className="text-white">Function Input</CardTitle>
                  <CardDescription className="text-gray-300">
                    Enter mathematical functions to visualize
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Input
                    value={currentFunction}
                    onChange={(e) => setCurrentFunction(e.target.value)}
                    placeholder="Enter function (e.g., x^2 + y^2, sin(x*y))"
                    className="bg-black/50 border-white/30 text-white placeholder:text-gray-400"
                  />
                  
                  {/* Function Info */}
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
                    </div>
                  </div>
                  
                  {/* Sample Functions */}
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
                </CardContent>
              </Card>

              {/* 3D Visualization */}
              <Card className="lg:col-span-2 bg-black/30 border-white/20">
                <CardContent className="p-0">
                  <MathVisualization 
                    functionExpression={currentFunction}
                    transformations={legacyTransformations}
                  />
                </CardContent>
              </Card>
            </div>

            {/* Transformation Panel (Floating) */}
            <TransformationPanel
              currentFunction={currentFunction}
              transformations={transformations}
              visualConfig={visualConfig}
              onTransformationChange={handleTransformationChange}
              onVisualizationConfigChange={handleVisualizationConfigChange}
              onSaveFunction={handleSaveFunction}
              onLoadFunction={handleLoadFunction}
            />
          </TabsContent>

          {/* Concept Library Tab */}
          <TabsContent value="concepts">
            <ConceptLibrary 
              onConceptSelect={(concept) => {
                console.log('Concept selected:', concept);
                // Could set function based on concept examples
              }}
            />
          </TabsContent>

          {/* Quiz Tab */}
          <TabsContent value="quiz">
            <QuizSystem />
          </TabsContent>

          {/* Progress Tab */}
          <TabsContent value="progress">
            <ProgressDashboard />
          </TabsContent>

          {/* AI Assistant Tab */}
          <TabsContent value="ai">
            <div className="max-w-4xl mx-auto">
              <AIAssistant 
                isOpen={true}
                onClose={() => {}}
                currentContext={{
                  function: currentFunction,
                  concept: 'Graph Visualization',
                  userLevel: 'intermediate'
                }}
              />
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default GraphVisualizerPage;
