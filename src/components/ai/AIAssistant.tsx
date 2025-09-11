import React, { useState, useRef, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { Bot, User, Send, ThumbsUp, ThumbsDown, Lightbulb } from 'lucide-react';
import { AIMessage, AI_CONVERSATION_STARTERS, AI_LEARNING_TIPS } from '@/types/ai';
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

  // --- MODIFIED FUNCTION ---
  const handleSendMessage = async () => {
    if (!inputValue.trim()) return;

    const userMessage: AIMessage = {
      id: `user-${Date.now()}`,
      type: 'user',
      content: inputValue,
      timestamp: new Date().toISOString(),
      context: currentContext
    };
    
    // **KEY CHANGE**: Capture the history *before* adding the new user message.
    const conversationHistory = [...messages];

    setMessages(prev => [...prev, userMessage]);
    const promptToSend = inputValue; // Capture the value before clearing
    setInputValue('');
    setIsTyping(true);

    try {
      // Make the API call to your backend
      const response = await fetch('http://localhost:8080/api/chat', { // Your backend route
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        // **KEY CHANGE**: Send the prompt AND the conversation history.
        // We map the history to a simpler format that the backend expects.
        body: JSON.stringify({ 
          prompt: promptToSend,
          history: conversationHistory.map(({ type, content }) => ({ type, content }))
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.response || `Request failed with status ${response.status}`);
      }
      
      const data = await response.json();

      // AFTER:
      const aiMessage: AIMessage = {
        id: `ai-${Date.now()}`,
        type: 'ai',
        content: data.response?.replace(/[*_`~]/g, '') || data.response, // Clean response without markdown
        timestamp: new Date().toISOString(),
        context: currentContext 
      };

      setMessages(prev => [...prev, aiMessage]);

    } catch (error: any) {
      console.error("Failed to get AI response:", error);
      
      const errorMessage: AIMessage = {
        id: `ai-error-${Date.now()}`,
        type: 'ai',
        content: `Error: ${error.message || 'Could not connect to the AI assistant.'}`,
        timestamp: new Date().toISOString(),
      };
      setMessages(prev => [...prev, errorMessage]);
      
      toast({
        title: "An Error Occurred",
        description: "Failed to get a response from the AI assistant.",
        variant: "destructive",
      });
    } finally {
      setIsTyping(false);
    }
  };

  const handleSuggestionClick = (suggestion: string) => {
    setInputValue(suggestion);
    // You could optionally trigger handleSendMessage() here directly
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
    <Card className="fixed right-4 bottom-4 w-96 h-[600px] bg-white dark:bg-gray-900 shadow-2xl border-2 border-blue-200 dark:border-blue-800 z-50 flex flex-col">
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
      <ScrollArea className="flex-1 p-4">
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
                    <p className="text-sm whitespace-pre-wrap">{message.content}</p>
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