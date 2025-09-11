import React, { useState, useRef, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { Bot, User, Send, ThumbsUp, ThumbsDown, Lightbulb } from 'lucide-react';
import { AIMessage, AI_CONVERSATION_STARTERS, AI_LEARNING_TIPS } from '@/types/ai';
import { useToast } from '@/hooks/use-toast';
import ReactMarkdown from 'react-markdown';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import rehypeRaw from 'rehype-raw';
import 'katex/dist/katex.min.css';

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
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  const scrollToBottom = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollTop = scrollContainerRef.current.scrollHeight;
    }
  };

  // Enhanced scrolling effect that works more reliably
  useEffect(() => {
    const timer = setTimeout(() => {
      scrollToBottom();
    }, 100); // Small delay to ensure DOM has updated
    
    return () => clearTimeout(timer);
  }, [messages, isTyping]);

  useEffect(() => {
    if (isOpen && messages.length === 0) {
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
    
    const conversationHistory = [...messages];

    setMessages(prev => [...prev, userMessage]);
    const promptToSend = inputValue;
    setInputValue('');
    setIsTyping(true);

    try {
      const response = await fetch('http://localhost:8080/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
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

      const aiMessage: AIMessage = {
        id: `ai-${Date.now()}`,
        type: 'ai',
        content: data.response || 'No response received.',
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
      {/* 
        ARCHITECTURAL CHANGE: Using explicit height calculations instead of flex-1
        This creates a more predictable layout where each section has a known height
      */}
      <div className="h-full flex flex-col">
        {/* Header - Fixed height */}
        <div className="h-16 flex items-center justify-between p-4 border-b bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-t-lg flex-shrink-0">
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

        {/* 
          Messages Container - This is the critical fix
          Using calc() to explicitly define the available height for messages
          Height = Total (600px) - Header (64px) - Learning Tip (~60px) - Input (~80px) - Borders/Padding (~16px)
        */}
        <div 
          ref={scrollContainerRef}
          className="overflow-y-auto overflow-x-hidden px-4 py-2 flex-shrink-0"
          style={{ 
            height: 'calc(600px - 64px - 60px - 80px - 16px)', // Explicit height calculation
            maxHeight: 'calc(600px - 64px - 60px - 80px - 16px)'
          }}
        >
          <div className="space-y-3">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex w-full ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                {/* 
                  Message Bubble - Enhanced with better constraints
                  Key insight: We need to prevent any possibility of horizontal overflow
                  that could affect the parent container's layout
                */}
                <div
                  className={`relative max-w-[280px] min-w-0 rounded-lg p-3 shadow-sm ${
                    message.type === 'user'
                      ? 'bg-blue-500 text-white'
                      : 'bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-100'
                  }`}
                  style={{ 
                    wordWrap: 'break-word',
                    overflowWrap: 'break-word',
                    hyphens: 'auto'
                  }}
                >
                  <div className="flex items-start space-x-2">
                    {message.type === 'ai' && (
                      <Bot className="h-4 w-4 mt-0.5 flex-shrink-0 opacity-70" />
                    )}
                    {message.type === 'user' && (
                      <User className="h-4 w-4 mt-0.5 flex-shrink-0 opacity-70" />
                    )}
                    <div className="flex-1 min-w-0">
                      {/* 
                        Markdown Content - Using a constrained container approach
                        The key insight here is that we need to constrain not just the bubble,
                        but also the internal content rendering
                      */}
                      <div 
                        className="text-sm leading-relaxed"
                        style={{ 
                          maxWidth: '240px', // Explicit max width for markdown content
                          wordBreak: 'break-word'
                        }}
                      >
                        <ReactMarkdown
                          remarkPlugins={[remarkMath]}
                          rehypePlugins={[rehypeRaw, rehypeKatex]}
                          components={{
                            // Custom renderers that respect our width constraints
                            p: ({ children }) => (
                              <p className="my-1 leading-relaxed" style={{ wordBreak: 'break-word' }}>
                                {children}
                              </p>
                            ),
                            ul: ({ children }) => (
                              <ul className="my-1 ml-4 list-disc" style={{ maxWidth: '100%' }}>
                                {children}
                              </ul>
                            ),
                            ol: ({ children }) => (
                              <ol className="my-1 ml-4 list-decimal" style={{ maxWidth: '100%' }}>
                                {children}
                              </ol>
                            ),
                            li: ({ children }) => (
                              <li className="my-0.5" style={{ wordBreak: 'break-word' }}>
                                {children}
                              </li>
                            ),
                            code: ({ children }) => (
                              <code 
                                className="bg-gray-200 dark:bg-gray-700 px-1 py-0.5 rounded text-xs"
                                style={{ wordBreak: 'break-all' }}
                              >
                                {children}
                              </code>
                            ),
                            pre: ({ children }) => (
                              <pre 
                                className="bg-gray-200 dark:bg-gray-700 p-2 rounded text-xs my-1 overflow-x-auto"
                                style={{ maxWidth: '240px' }}
                              >
                                {children}
                              </pre>
                            )
                          }}
                        >
                          {message.content}
                        </ReactMarkdown>
                      </div>
                      
                      {/* Feedback buttons for AI messages */}
                      {message.type === 'ai' && (
                        <div className="flex items-center space-x-1 mt-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleFeedback(message.id, true)}
                            className="h-6 w-6 p-0 hover:bg-green-100 dark:hover:bg-green-900/20 opacity-60 hover:opacity-100"
                          >
                            <ThumbsUp className="h-3 w-3" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleFeedback(message.id, false)}
                            className="h-6 w-6 p-0 hover:bg-red-100 dark:hover:bg-red-900/20 opacity-60 hover:opacity-100"
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
                <div className="bg-gray-100 dark:bg-gray-800 rounded-lg p-3 max-w-[280px] shadow-sm">
                  <div className="flex items-center space-x-2">
                    <Bot className="h-4 w-4 opacity-70" />
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
          
          {/* Scroll target */}
          <div ref={messagesEndRef} className="h-1" />
        </div>

        {/* Learning Tip - Fixed height */}
        <div className="h-auto min-h-[50px] px-4 py-2 bg-yellow-50 dark:bg-yellow-900/20 border-t border-yellow-200 dark:border-yellow-800 flex-shrink-0">
          <div className="flex items-start space-x-2">
            <Lightbulb className="h-4 w-4 text-yellow-600 dark:text-yellow-400 mt-0.5 flex-shrink-0" />
            <p className="text-xs text-yellow-800 dark:text-yellow-200 leading-relaxed">
              {AI_LEARNING_TIPS[Math.floor(Math.random() * AI_LEARNING_TIPS.length)]}
            </p>
          </div>
        </div>

        {/* Input Section - Fixed height */}
        <div className="h-20 p-4 border-t flex-shrink-0">
          <div className="flex space-x-2 h-full items-center">
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
              className="bg-blue-500 hover:bg-blue-600 h-10 w-10 p-0"
            >
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default AIAssistant;