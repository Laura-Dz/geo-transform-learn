import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { MessageCircle, X } from 'lucide-react';
import AIAssistant from '@/components/ai/AIAssistant';

interface FloatingAIProps {
  currentContext?: {
    function?: string;
    concept?: string;
    userLevel?: string;
  };
}

const FloatingAI: React.FC<FloatingAIProps> = ({ currentContext }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {/* Floating Toggle Button */}
      <Button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full bg-cyan-600 hover:bg-cyan-700 shadow-lg transition-all duration-200 hover:scale-110"
        size="icon"
      >
        {isOpen ? (
          <X className="h-6 w-6 text-white" />
        ) : (
          <MessageCircle className="h-6 w-6 text-white" />
        )}
      </Button>

      {/* AI Assistant Modal/Popup */}
      {isOpen && (
        <div className="fixed bottom-24 right-6 z-40 w-96 max-w-[calc(100vw-3rem)]">
          <div className="bg-white rounded-lg shadow-2xl border border-gray-200 overflow-hidden">
            <AIAssistant
              isOpen={isOpen}
              onClose={() => setIsOpen(false)}
              currentContext={currentContext || {
                function: '',
                concept: 'General Help',
                userLevel: 'intermediate'
              }}
            />
          </div>
        </div>
      )}
    </>
  );
};

export default FloatingAI;
