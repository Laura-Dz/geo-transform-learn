import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Brain, ArrowRight, Lightbulb, Target } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface AIResponse {
  explanation: string;
  learningDirection: string;
  nextSteps: string[];
  socraticQuestion: string;
  relatedConcept?: {
    title: string;
    route: string;
  };
}

interface AIResponsePaneProps {
  response: AIResponse | null;
  isLoading: boolean;
  error: string | null;
}

const AIResponsePane: React.FC<AIResponsePaneProps> = ({ response, isLoading, error }) => {
  const navigate = useNavigate();

  const stripMarkdown = (text: string): string => {
    return text
      .replace(/\*\*(.*?)\*\*/g, '$1')
      .replace(/\*(.*?)\*/g, '$1')
      .replace(/`(.*?)`/g, '$1')
      .replace(/#{1,6}\s/g, '')
      .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
      .replace(/\n\n/g, '\n')
      .trim();
  };

  if (isLoading) {
    return (
      <Card className="bg-black/30 border-white/20 h-fit">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <Brain className="h-5 w-5" />
            AI Tutor Analysis
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-center py-12">
            <div className="text-center space-y-4">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-400 mx-auto"></div>
              <p className="text-gray-300 text-lg">Thinking through your input...</p>
              <p className="text-gray-400 text-sm">Analyzing patterns and preparing personalized guidance</p>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="bg-black/30 border-white/20 h-fit">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <Brain className="h-5 w-5" />
            AI Tutor Analysis
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="text-center py-8">
            <p className="text-red-400 mb-4">Unable to analyze your input right now.</p>
            <p className="text-gray-400 text-sm">{error}</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!response) {
    return (
      <Card className="bg-black/30 border-white/20 h-fit">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <Brain className="h-5 w-5" />
            AI Tutor Analysis
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="text-center py-12">
            <div className="text-6xl mb-4">🎯</div>
            <p className="text-gray-300 text-lg mb-2">Ready to explore together!</p>
            <p className="text-gray-400">Share a question, concept, or upload a document to get started.</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-black/30 border-white/20 h-fit">
      <CardHeader>
        <CardTitle className="text-white flex items-center gap-2">
          <Brain className="h-5 w-5" />
          AI Tutor Analysis
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Explanation */}
        <div className="space-y-2">
          <div className="flex items-center gap-2 mb-3">
            <Lightbulb className="h-4 w-4 text-yellow-400" />
            <h3 className="text-sm font-semibold text-yellow-400 uppercase tracking-wide">Understanding</h3>
          </div>
          <p className="text-gray-200 leading-relaxed">{stripMarkdown(response.explanation)}</p>
        </div>

        {/* Learning Direction */}
        <div className="space-y-2">
          <div className="flex items-center gap-2 mb-3">
            <Target className="h-4 w-4 text-blue-400" />
            <h3 className="text-sm font-semibold text-blue-400 uppercase tracking-wide">Learning Direction</h3>
          </div>
          <p className="text-gray-200 leading-relaxed">{stripMarkdown(response.learningDirection)}</p>
        </div>

        {/* Next Steps */}
        {response.nextSteps && response.nextSteps.length > 0 && (
          <div className="space-y-2">
            <div className="flex items-center gap-2 mb-3">
              <ArrowRight className="h-4 w-4 text-green-400" />
              <h3 className="text-sm font-semibold text-green-400 uppercase tracking-wide">Next Steps</h3>
            </div>
            <ul className="space-y-2">
              {response.nextSteps.map((step, index) => (
                <li key={index} className="flex items-start gap-2 text-gray-200">
                  <span className="text-green-400 text-sm mt-1">•</span>
                  <span className="leading-relaxed">{stripMarkdown(step)}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Socratic Question */}
        {response.socraticQuestion && (
          <div className="bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-lg p-4 border border-purple-500/30">
            <h3 className="text-sm font-semibold text-purple-300 mb-2 uppercase tracking-wide">Think About This</h3>
            <p className="text-gray-200 italic leading-relaxed">{stripMarkdown(response.socraticQuestion)}</p>
          </div>
        )}

        {/* Related Concept */}
        {response.relatedConcept && (
          <div className="pt-4 border-t border-white/10">
            <Button
              onClick={() => navigate(response.relatedConcept!.route)}
              className="w-full bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-700 hover:to-blue-700 text-white font-medium py-3 rounded-lg transition-all duration-200"
            >
              <ArrowRight className="h-4 w-4 mr-2" />
              Learn More: {response.relatedConcept.title}
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default AIResponsePane;