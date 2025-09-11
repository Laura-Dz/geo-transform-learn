import React, { useState, useEffect, useCallback } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Loader2, Lightbulb, ArrowRight, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';

interface ConceptExplanationProps {
  currentFunction: string;
  transformationDescription: string;
  studentLevel?: string;
  interestTags?: string[];
  preferredTone?: string;
}

interface AIResponse {
  explanation: string;
  guidance: string;
  relatedConcept?: {
    title: string;
    route: string;
  };
}

const ConceptExplanation: React.FC<ConceptExplanationProps> = ({
  currentFunction,
  transformationDescription,
  studentLevel = 'intermediate',
  interestTags = [],
  preferredTone = 'encouraging'
}) => {
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState<AIResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

  const fetchExplanation = useCallback(async () => {
    if (!currentFunction?.trim()) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const payload = {
        function: currentFunction,
        transformation: transformationDescription,
        level: studentLevel,
        interests: interestTags,
        tone: preferredTone
      };

      const response = await fetch('http://localhost:8080/api/tutor/explain', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        throw new Error('Failed to get AI explanation');
      }

      const data: AIResponse = await response.json();
      setResponse(data);
    } catch (err) {
      setError('Unable to generate explanation. Please try again.');
      console.error('Error fetching AI explanation:', err);
    } finally {
      setLoading(false);
    }
  }, [currentFunction, transformationDescription, studentLevel, interestTags, preferredTone]);

  // Re-fetch when function or transformation changes
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      fetchExplanation();
    }, 500); // Debounce for 500ms

    return () => clearTimeout(timeoutId);
  }, [fetchExplanation]);

  return (
    <Card className="p-6 bg-gradient-to-br from-purple-900/20 via-blue-900/20 to-cyan-900/20 border-white/20 backdrop-blur-sm">
      <div className="flex items-center space-x-2 mb-6">
        <div className="p-2 bg-gradient-to-br from-yellow-400/20 to-orange-400/20 rounded-lg">
          <Sparkles className="h-5 w-5 text-yellow-400" />
        </div>
        <div>
          <h3 className="text-lg font-semibold text-white">AI Math Tutor</h3>
          <p className="text-sm text-gray-400">Understanding your mathematical journey</p>
        </div>
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center py-12">
          <div className="relative">
            <Loader2 className="h-8 w-8 text-cyan-400 animate-spin" />
            <div className="absolute inset-0 h-8 w-8 border-2 border-cyan-400/20 rounded-full animate-pulse"></div>
          </div>
          <p className="text-cyan-300 mt-4 text-sm font-medium animate-pulse">
            Thinking through your graph...
          </p>
          <p className="text-gray-400 text-xs mt-1">
            Analyzing function: {currentFunction}
          </p>
        </div>
      ) : error ? (
        <div className="text-center py-8">
          <Lightbulb className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <p className="text-red-400 mb-4">{error}</p>
          <Button
            variant="outline"
            onClick={fetchExplanation}
            className="border-cyan-500/50 text-cyan-300 hover:bg-cyan-500/10"
          >
            Try Again
          </Button>
        </div>
      ) : response ? (
        <div className="space-y-6">
          {/* Main Explanation */}
          <div className="bg-gradient-to-r from-blue-900/30 to-purple-900/30 rounded-lg p-5 border border-blue-500/20">
            <h4 className="text-white font-semibold mb-3 flex items-center">
              <Lightbulb className="h-4 w-4 text-yellow-400 mr-2" />
              Understanding Your Function
            </h4>
            <p className="text-gray-200 leading-relaxed text-sm">
              {response.explanation}
            </p>
          </div>

          {/* Guidance */}
          <div className="bg-gradient-to-r from-green-900/30 to-teal-900/30 rounded-lg p-5 border border-green-500/20">
            <h4 className="text-white font-semibold mb-3 flex items-center">
              <ArrowRight className="h-4 w-4 text-green-400 mr-2" />
              Next Steps & Guidance
            </h4>
            <p className="text-gray-200 leading-relaxed text-sm">
              {response.guidance}
            </p>
          </div>

          {/* Related Concept Link */}
          {response.relatedConcept && (
            <div className="pt-4 border-t border-white/10">
              <Link to={response.relatedConcept.route}>
                <Button 
                  className="w-full bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white font-medium transition-all duration-200 transform hover:scale-[1.02]"
                  size="lg"
                >
                  <Sparkles className="h-4 w-4 mr-2" />
                  Learn More: {response.relatedConcept.title}
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
              </Link>
            </div>
          )}
        </div>
      ) : (
        <div className="text-center py-8">
          <div className="relative mb-4">
            <Sparkles className="h-12 w-12 text-gray-400 mx-auto" />
            <div className="absolute inset-0 h-12 w-12 bg-gradient-to-r from-cyan-400/20 to-purple-400/20 rounded-full animate-ping"></div>
          </div>
          <p className="text-gray-400 mb-2">
            Ready to explore your function!
          </p>
          <p className="text-sm text-gray-500">
            Enter a mathematical function to get personalized explanations.
          </p>
        </div>
      )}
    </Card>
  );
};

export default ConceptExplanation;