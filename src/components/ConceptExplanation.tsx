
import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { BookOpen, Lightbulb, ArrowRight } from 'lucide-react';

interface ConceptExplanationProps {
  transformations: {
    translation: { x: number; y: number; z: number };
    rotation: { x: number; y: number; z: number };
    scale: { x: number; y: number; z: number };
  };
  detailed?: boolean;
  onConceptExplored: (concept: string) => void;
}

const concepts = {
  translation: {
    title: "Translation (Shifting)",
    description: "Moving a function up, down, left, or right without changing its shape.",
    explanation: "When we translate a function f(x,y), we're adding or subtracting constants to shift the entire graph. This doesn't change the function's fundamental shape, just its position in space.",
    mathematical: "f(x,y) → f(x-h, y-k) + v",
    examples: [
      "f(x,y) = x² + y² → f(x,y) = (x-2)² + (y+1)² + 3",
      "Shifts the paraboloid 2 units right, 1 unit forward, and 3 units up"
    ],
    realWorld: "Like moving a bowl on a table - the bowl's shape stays the same, but its position changes."
  },
  scaling: {
    title: "Scaling (Stretching/Compressing)",
    description: "Changing the size of a function by stretching or compressing it along different axes.",
    explanation: "Scaling multiplies the input or output values by constants, making the function wider, narrower, taller, or shorter.",
    mathematical: "f(x,y) → a·f(bx, cy)",
    examples: [
      "f(x,y) = x² + y² → f(x,y) = 2(x²/4 + y²/9)",
      "Stretches horizontally and vertically, then doubles the height"
    ],
    realWorld: "Like stretching or squishing a rubber sheet - the pattern remains but dimensions change."
  },
  reflection: {
    title: "Reflection (Flipping)",
    description: "Creating a mirror image of the function across an axis or plane.",
    explanation: "Reflection changes the sign of coordinates, creating a mirror image. This is like looking at the function in a mirror.",
    mathematical: "f(x,y) → f(-x,y), f(x,-y), or -f(x,y)",
    examples: [
      "f(x,y) = x² + y² → f(x,y) = (-x)² + y² = x² + y²",
      "f(x,y) = xy → f(x,y) = (-x)y = -xy"
    ],
    realWorld: "Like flipping a photograph - everything appears backwards but maintains its essential structure."
  }
};

const ConceptExplanation: React.FC<ConceptExplanationProps> = ({
  transformations,
  detailed = false,
  onConceptExplored
}) => {
  const [activeTransformations, setActiveTransformations] = useState<string[]>([]);
  const [selectedConcept, setSelectedConcept] = useState<string>('translation');

  useEffect(() => {
    const active = [];
    
    // Check for active transformations
    const { translation, rotation, scale } = transformations;
    
    if (translation.x !== 0 || translation.y !== 0 || translation.z !== 0) {
      active.push('translation');
    }
    
    if (rotation.x !== 0 || rotation.y !== 0 || rotation.z !== 0) {
      active.push('rotation');
    }
    
    if (scale.x !== 1 || scale.y !== 1 || scale.z !== 1) {
      active.push('scaling');
    }
    
    setActiveTransformations(active);
  }, [transformations]);

  const handleExploreMore = (conceptKey: string) => {
    onConceptExplored(conceptKey);
    setSelectedConcept(conceptKey);
  };

  if (detailed) {
    return (
      <div className="space-y-6">
        <Card className="p-6 bg-black/30 border-white/20">
          <h2 className="text-2xl font-bold text-white mb-6 flex items-center">
            <BookOpen className="h-6 w-6 mr-2 text-cyan-400" />
            Mathematical Transformations Guide
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            {Object.entries(concepts).map(([key, concept]) => (
              <Button
                key={key}
                variant={selectedConcept === key ? "default" : "outline"}
                onClick={() => setSelectedConcept(key)}
                className={`h-auto p-4 text-left ${
                  selectedConcept === key 
                    ? "bg-cyan-500 hover:bg-cyan-600" 
                    : "border-white/30 text-white hover:bg-white/10"
                }`}
              >
                <div>
                  <h3 className="font-semibold mb-1">{concept.title}</h3>
                  <p className="text-sm opacity-80">{concept.description}</p>
                </div>
              </Button>
            ))}
          </div>
          
          <div className="bg-slate-800/50 rounded-lg p-6 border border-white/10">
            <h3 className="text-xl font-semibold text-white mb-4">
              {concepts[selectedConcept as keyof typeof concepts].title}
            </h3>
            
            <div className="space-y-4">
              <div>
                <h4 className="text-sm font-semibold text-cyan-400 mb-2">Explanation</h4>
                <p className="text-gray-300">
                  {concepts[selectedConcept as keyof typeof concepts].explanation}
                </p>
              </div>
              
              <div>
                <h4 className="text-sm font-semibold text-cyan-400 mb-2">Mathematical Form</h4>
                <code className="bg-black/50 p-2 rounded text-cyan-300 block">
                  {concepts[selectedConcept as keyof typeof concepts].mathematical}
                </code>
              </div>
              
              <div>
                <h4 className="text-sm font-semibold text-cyan-400 mb-2">Examples</h4>
                <div className="space-y-2">
                  {concepts[selectedConcept as keyof typeof concepts].examples.map((example, index) => (
                    <div key={index} className="bg-black/30 p-3 rounded">
                      <code className="text-yellow-300 text-sm">{example}</code>
                    </div>
                  ))}
                </div>
              </div>
              
              <div>
                <h4 className="text-sm font-semibold text-cyan-400 mb-2">Real-World Analogy</h4>
                <p className="text-gray-300 italic">
                  {concepts[selectedConcept as keyof typeof concepts].realWorld}
                </p>
              </div>
            </div>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <Card className="p-6 bg-black/30 border-white/20">
      <div className="flex items-center space-x-2 mb-4">
        <Lightbulb className="h-5 w-5 text-yellow-400" />
        <h3 className="text-lg font-semibold text-white">Concept Explanation</h3>
      </div>

      {activeTransformations.length > 0 ? (
        <div className="space-y-4">
          <div className="flex flex-wrap gap-2 mb-4">
            {activeTransformations.map((transformation) => (
              <Badge 
                key={transformation} 
                variant="secondary" 
                className="bg-cyan-500/20 text-cyan-300 border-cyan-500/30"
              >
                {concepts[transformation as keyof typeof concepts].title}
              </Badge>
            ))}
          </div>

          {activeTransformations.map((transformation) => (
            <div key={transformation} className="bg-slate-800/50 rounded-lg p-4 border border-white/10">
              <h4 className="font-semibold text-white mb-2">
                {concepts[transformation as keyof typeof concepts].title}
              </h4>
              <p className="text-sm text-gray-300 mb-3">
                {concepts[transformation as keyof typeof concepts].description}
              </p>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleExploreMore(transformation)}
                className="border-cyan-500/50 text-cyan-300 hover:bg-cyan-500/10"
              >
                Learn More <ArrowRight className="h-3 w-3 ml-1" />
              </Button>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-8">
          <Lightbulb className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-400 mb-4">
            Apply transformations to see explanations here!
          </p>
          <p className="text-sm text-gray-500">
            Try adjusting the sliders or toggles to see how they affect the function.
          </p>
        </div>
      )}
    </Card>
  );
};

export default ConceptExplanation;
