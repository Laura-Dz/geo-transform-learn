import React, { useState, useEffect, useCallback } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Loader2, Lightbulb, ArrowRight, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';
import { AIMessage } from '@/types/ai';

// --- REQUIRED IMPORTS FOR MARKDOWN AND LATEX ---
import ReactMarkdown from 'react-markdown';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import 'katex/dist/katex.min.css'; // Don't forget to import the KaTeX CSS

// --- TYPE DEFINITIONS ---
interface ConceptExplanationProps {
  currentFunction: string;
  transformationDescription: string;
  studentLevel?: string;
  interestTags?: string[];
  preferredTone?: string;
}

// This interface now matches the JSON object from the backend
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
  interestTags = ['3d-visualization', 'transformations'],
  preferredTone = 'encouraging'
}) => {
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState<AIResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [messages, setMessages] = useState<AIMessage[]>([]);

  const fetchExplanation = useCallback(async () => {
    if (!currentFunction?.trim()) return;

    const prompt = "Using the function, transformation, and other info provided, provide the function's properties (axis of symmetry, intercept, center of symmetry, etc). When a transformation is applied, the unfolding to changes to produce the new function should be presented too. The general objective is to explain this function to users in simple and user-friendly terms.";
    setLoading(true);
    setError(null);
    setResponse(null); // Clear previous response

    try {
      const payload = {
        question: prompt,
        function: currentFunction,
        transformation: transformationDescription,
        level: studentLevel,
        interests: interestTags,
        tone: preferredTone
      };

      const res = await fetch('http://localhost:8080/api/tutor', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          prompt: payload,
          history: messages.map(({ type, content }) => ({ type, content }))
        }),
      });

      if (!res.ok) {
        throw new Error(`API Error: ${res.statusText}`);
      }

      const data: AIResponse = await res.json();
      setResponse(data);

    } catch (err) {
      setError('Unable to generate explanation. Please try again.');
      console.error('Error fetching AI explanation:', err);
    } finally {
      setLoading(false);
    }
  }, [currentFunction, transformationDescription, studentLevel, interestTags, preferredTone, messages]);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      fetchExplanation();
    }, 500); // Debounce API calls

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

      {loading && (
        <div className="flex flex-col items-center justify-center py-12">
          <Loader2 className="h-8 w-8 text-cyan-400 animate-spin" />
          <p className="text-cyan-300 mt-4 text-sm font-medium">Thinking through your graph...</p>
        </div>
      )}

      {error && !loading && (
        <div className="text-center py-8">
          <p className="text-red-400 mb-4">{error}</p>
          <Button variant="outline" onClick={fetchExplanation}>Try Again</Button>
        </div>
      )}

      {!loading && !error && response && (
        <div className="space-y-6">
          {/* Main Explanation Card */}
          <div className="bg-black/20 rounded-lg p-5 border border-blue-500/30">
            <h4 className="text-white font-semibold mb-3 flex items-center">
              <Lightbulb className="h-4 w-4 text-yellow-400 mr-2" />
              Function Analysis
            </h4>
            <div className="prose prose-invert prose-sm max-w-none text-gray-200 leading-relaxed">
              <ReactMarkdown remarkPlugins={[remarkMath]} rehypePlugins={[rehypeKatex]}>
                {response.explanation}
              </ReactMarkdown>
            </div>
          </div>

          {/* Guidance Card */}
          <div className="bg-black/20 rounded-lg p-5 border border-green-500/30">
            <h4 className="text-white font-semibold mb-3 flex items-center">
              <ArrowRight className="h-4 w-4 text-green-400 mr-2" />
              Next Steps & Guidance
            </h4>
            <div className="prose prose-invert prose-sm max-w-none text-gray-200 leading-relaxed">
              <ReactMarkdown remarkPlugins={[remarkMath]} rehypePlugins={[rehypeKatex]}>
                {response.guidance}
              </ReactMarkdown>
            </div>
          </div>

          {/* Related Concept (Optional) */}
          {response.relatedConcept && (
            <div className="pt-4 border-t border-white/10">
              <Link to={response.relatedConcept.route}>
                <Button className="w-full bg-gradient-to-r from-cyan-500 to-blue-500">
                  Learn More: {response.relatedConcept.title}
                </Button>
              </Link>
            </div>
          )}
        </div>
      )}
    </Card>
  );
};

export default ConceptExplanation;