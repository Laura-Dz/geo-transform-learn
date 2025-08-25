import React, { useState, useRef, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { Bot, User, Send, ThumbsUp, ThumbsDown, Lightbulb } from 'lucide-react';
import { AIMessage, getAIResponse, AI_CONVERSATION_STARTERS, AI_LEARNING_TIPS } from '@/types/ai';
import { useToast } from '@/hooks/use-toast';

interface AIAssistantProps {
  isOpen: boolean;
  onClose: () => void;
  currentContext?: {
    function?: string;
    concept?: string;
    userLevel?: string;
  };
}

const AIAssistant: React.FC<AIAssistantProps> = ({ isOpen, onClose, currentContext }) => {
  const [messages, setMessages] = useState<AIMessage[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (isOpen && messages.length === 0) {
      // Add welcome message when AI assistant opens
      const welcomeMessage: AIMessage = {
        id: `ai-${Date.now()}`,
        type: 'ai',
        content: AI_CONVERSATION_STARTERS[Math.floor(Math.random() * AI_CONVERSATION_STARTERS.length)],
        timestamp: new Date().toISOString(),
        context: currentContext
      };
      setMessages([welcomeMessage]);
    }
  }, [isOpen, currentContext]);

  const handleSendMessage = async () => {
    if (!inputValue.trim()) return;

    const userMessage: AIMessage = {
      id: `user-${Date.now()}`,
      type: 'user',
      content: inputValue,
      timestamp: new Date().toISOString(),
      context: currentContext
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsTyping(true);

    // Simulate AI thinking time
    setTimeout(() => {
      const aiResponse = getAIResponse(inputValue, {
        currentFunction: currentContext?.function,
        currentConcept: currentContext?.concept,
        userLevel: currentContext?.userLevel || 'BEGINNER',
        recentTopics: []
      });

      const aiMessage: AIMessage = {
        id: `ai-${Date.now()}`,
        type: 'ai',
        content: aiResponse.response,
        timestamp: new Date().toISOString(),
        context: {
          ...currentContext,
          suggestions: aiResponse.suggestions,
          examples: aiResponse.examples,
          relatedConcepts: aiResponse.relatedConcepts
        }
      };

      setMessages(prev => [...prev, aiMessage]);
      setIsTyping(false);
    }, 1000 + Math.random() * 1500); // Random delay between 1-2.5 seconds
  };

  const handleSuggestionClick = (suggestion: string) => {
    setInputValue(suggestion);
  };

  const handleFeedback = (messageId: string, isPositive: boolean) => {
    toast({
      title: "Feedback Received",
      description: `Thank you for your ${isPositive ? 'positive' : 'negative'} feedback!`,
    });
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  if (!isOpen) return null;

  return (
    <Card className="fixed right-4 bottom-4 w-96 h-[600px] bg-white dark:bg-gray-900 shadow-2xl border-2 border-blue-200 dark:border-blue-800 z-50">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-t-lg">
        <div className="flex items-center space-x-2">
          <Bot className="h-6 w-6" />
          <h3 className="font-semibold">AI Math Tutor</h3>
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={onClose}
          className="text-white hover:bg-white/20"
        >
          ×
        </Button>
      </div>

      {/* Messages */}
      <ScrollArea className="flex-1 p-4 h-[400px]">
        <div className="space-y-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[80%] rounded-lg p-3 ${
                  message.type === 'user'
                    ? 'bg-blue-500 text-white'
                    : 'bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-100'
                }`}
              >
                <div className="flex items-start space-x-2">
                  {message.type === 'ai' && <Bot className="h-4 w-4 mt-1 flex-shrink-0" />}
                  {message.type === 'user' && <User className="h-4 w-4 mt-1 flex-shrink-0" />}
                  <div className="flex-1">
                    <p className="text-sm">{message.content}</p>
                    
                    {/* AI Suggestions */}
                    {message.type === 'ai' && message.context?.suggestions && (
                      <div className="mt-3 space-y-2">
                        <p className="text-xs font-medium opacity-75">Try these:</p>
                        <div className="flex flex-wrap gap-1">
                          {message.context.suggestions.map((suggestion: string, index: number) => (
                            <Badge
                              key={index}
                              variant="outline"
                              className="cursor-pointer hover:bg-blue-50 dark:hover:bg-blue-900/20 text-xs"
                              onClick={() => handleSuggestionClick(suggestion)}
                            >
                              {suggestion}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* AI Examples */}
                    {message.type === 'ai' && message.context?.examples && (
                      <div className="mt-3 space-y-2">
                        <p className="text-xs font-medium opacity-75">Examples:</p>
                        <div className="space-y-1">
                          {message.context.examples.map((example: string, index: number) => (
                            <code
                              key={index}
                              className="block text-xs bg-gray-200 dark:bg-gray-700 px-2 py-1 rounded cursor-pointer hover:bg-gray-300 dark:hover:bg-gray-600"
                              onClick={() => handleSuggestionClick(`Explain ${example}`)}
                            >
                              {example}
                            </code>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Feedback buttons for AI messages */}
                    {message.type === 'ai' && (
                      <div className="flex items-center space-x-2 mt-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleFeedback(message.id, true)}
                          className="h-6 w-6 p-0 hover:bg-green-100 dark:hover:bg-green-900/20"
                        >
                          <ThumbsUp className="h-3 w-3" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleFeedback(message.id, false)}
                          className="h-6 w-6 p-0 hover:bg-red-100 dark:hover:bg-red-900/20"
                        >
                          <ThumbsDown className="h-3 w-3" />
                        </Button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}

          {/* Typing indicator */}
          {isTyping && (
            <div className="flex justify-start">
              <div className="bg-gray-100 dark:bg-gray-800 rounded-lg p-3 max-w-[80%]">
                <div className="flex items-center space-x-2">
                  <Bot className="h-4 w-4" />
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
        <div ref={messagesEndRef} />
      </ScrollArea>

      {/* Learning Tip */}
      <div className="px-4 py-2 bg-yellow-50 dark:bg-yellow-900/20 border-t border-yellow-200 dark:border-yellow-800">
        <div className="flex items-start space-x-2">
          <Lightbulb className="h-4 w-4 text-yellow-600 dark:text-yellow-400 mt-0.5 flex-shrink-0" />
          <p className="text-xs text-yellow-800 dark:text-yellow-200">
            {AI_LEARNING_TIPS[Math.floor(Math.random() * AI_LEARNING_TIPS.length)]}
          </p>
        </div>
      </div>

      {/* Input */}
      <div className="p-4 border-t">
        <div className="flex space-x-2">
          <Input
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Ask me anything about math..."
            className="flex-1"
            disabled={isTyping}
          />
          <Button
            onClick={handleSendMessage}
            disabled={!inputValue.trim() || isTyping}
            size="sm"
            className="bg-blue-500 hover:bg-blue-600"
          >
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </Card>
  );
};

export default AIAssistant;
