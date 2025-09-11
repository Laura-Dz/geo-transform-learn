import React, { useState } from 'react';
import StudentInputZone from '@/components/tutor/StudentInputZone';
import AIResponsePane from '@/components/tutor/AIResponsePane';
import GraphInteractionPanel from '@/components/tutor/GraphInteractionPanel';
import { useAuth } from '@/hooks/useAuth';

interface AIAnalyzeResponse {
  explanation: string;
  learningDirection: string;
  nextSteps: string[];
  socraticQuestion: string;
  relatedConcept?: {
    title: string;
    route: string;
  };
}

const LearningHubPage = () => {
  const { user } = useAuth();
  const [aiResponse, setAiResponse] = useState<AIAnalyzeResponse | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentFunction, setCurrentFunction] = useState<string>('');

  const handleStudentSubmit = async (data: {
    file?: File;
    text: string;
    caption: string;
  }) => {
    setIsLoading(true);
    setError(null);

    try {
      const formData = new FormData();
      
      if (data.file) {
        formData.append('file', data.file);
      }
      
      const payload = {
        caption: data.caption,
        text: data.text,
        userId: user?.id || 'anonymous',
        context: {
          currentFunction: currentFunction,
          transformationDescription: data.caption,
          studentLevel: 'intermediate',
          interestTags: ['visualization', '3d-math'],
          preferredTone: 'encouraging'
        }
      };

      formData.append('data', JSON.stringify(payload));

      const response = await fetch('/api/tutor/analyze', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      setAiResponse(result);

      // Extract function from text if it looks like a mathematical expression
      const functionMatch = data.text.match(/f\([^)]+\)\s*=\s*([^,\n]+)|([x-z+\-*/^().\d\s]+)/);
      if (functionMatch) {
        const extractedFunction = functionMatch[1] || functionMatch[2];
        if (extractedFunction && extractedFunction.includes('x')) {
          setCurrentFunction(extractedFunction.trim());
        }
      }

    } catch (err) {
      console.error('Error analyzing input:', err);
      setError(err instanceof Error ? err.message : 'Failed to analyze your input. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">🎓 AI Learning Studio</h1>
          <p className="text-gray-300 text-lg">Your personal mathematics tutor and exploration companion</p>
        </div>

        {/* Main Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Student Input Zone */}
          <div className="lg:col-span-1">
            <StudentInputZone 
              onSubmit={handleStudentSubmit}
              isLoading={isLoading}
            />
          </div>

          {/* AI Response Pane */}
          <div className="lg:col-span-1">
            <AIResponsePane 
              response={aiResponse}
              isLoading={isLoading}
              error={error}
            />
          </div>

          {/* Graph Interaction Panel */}
          <div className="lg:col-span-1">
            <GraphInteractionPanel 
              functionExpression={currentFunction}
              onParameterChange={(params) => {
                // Handle parameter changes if needed for advanced interactions
                console.log('Parameters changed:', params);
              }}
            />
          </div>
        </div>

        {/* Footer */}
        <div className="text-center py-8 border-t border-white/10">
          <p className="text-gray-400 text-sm">
            Share your mathematical curiosity through questions, concepts, or documents. 
            Let's explore together! ✨
          </p>
        </div>
      </div>
    </div>
  );
};

export default LearningHubPage;
