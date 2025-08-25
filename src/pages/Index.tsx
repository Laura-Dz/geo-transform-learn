
import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import AuthModal from '@/components/AuthModal';
import { Calculator, BookOpen, TrendingUp, User, Target, Trophy, Gamepad2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface IndexProps {
  onShowAuthModal?: () => void;
}

const Index: React.FC<IndexProps> = ({ onShowAuthModal }) => {
  const [showAuthModal, setShowAuthModal] = useState(false);
  const { toast } = useToast();

  const handleLogin = (userData: any) => {
    // Close modal and let parent handle authentication
    setShowAuthModal(false);
    // This should be handled by the parent App component
    toast({
      title: "Authentication",
      description: "Please use the main login button in the header.",
    });
  };

  const features = [
    {
      icon: <Calculator className="h-12 w-12 text-cyan-400 mx-auto mb-4" />,
      title: "3D Graph Visualizer",
      description: "Render mathematical functions in beautiful 3D space with real-time transformations."
    },
    {
      icon: <Gamepad2 className="h-12 w-12 text-green-400 mx-auto mb-4" />,
      title: "Interactive Practice Mode",
      description: "Hands-on practice with immediate feedback and step-by-step guidance."
    },
    {
      icon: <BookOpen className="h-12 w-12 text-blue-400 mx-auto mb-4" />,
      title: "Concept Library",
      description: "Comprehensive lessons with visual examples and real-world applications."
    },
    {
      icon: <Target className="h-12 w-12 text-purple-400 mx-auto mb-4" />,
      title: "Real-World Challenges",
      description: "Apply mathematical transformations to solve practical problems."
    },
    {
      icon: <Trophy className="h-12 w-12 text-yellow-400 mx-auto mb-4" />,
      title: "Achievement System",
      description: "Earn badges and track your progress through gamified learning."
    },
    {
      icon: <TrendingUp className="h-12 w-12 text-red-400 mx-auto mb-4" />,
      title: "Progress Analytics",
      description: "Detailed insights into your learning journey and areas for improvement."
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900">
      {/* Header */}
      <header className="border-b border-white/10 bg-black/20 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Calculator className="h-8 w-8 text-cyan-400" />
            <h1 className="text-2xl font-bold text-white">3DZert</h1>
          </div>
          
          <Button 
            onClick={() => onShowAuthModal ? onShowAuthModal() : setShowAuthModal(true)} 
            className="bg-cyan-500 hover:bg-cyan-600"
          >
            <User className="h-4 w-4 mr-2" />
            Login / Register
          </Button>
        </div>
      </header>

      <div className="container mx-auto px-4 py-16">
        {/* Hero Section */}
        <div className="text-center py-20">
          <div className="max-w-4xl mx-auto">
            <Calculator className="h-20 w-20 text-cyan-400 mx-auto mb-8" />
            <h1 className="text-6xl font-bold text-white mb-6">
              Master Mathematics in 3D
            </h1>
            <p className="text-xl text-gray-300 mb-8 max-w-3xl mx-auto">
              Transform your understanding of mathematical functions through interactive 3D visualization, 
              step-by-step learning, and personalized practice sessions. Perfect for students, educators, 
              and anyone curious about the beauty of mathematics.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
              <Button 
                onClick={() => onShowAuthModal ? onShowAuthModal() : setShowAuthModal(true)}
                size="lg"
                className="bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-lg px-8 py-4"
              >
                Start Learning for Free
              </Button>
              <Button 
                variant="outline"
                size="lg"
                className="border-white/30 text-black hover:bg-white/10 text-lg px-8 py-4"
              >
                Watch Demo
              </Button>
            </div>
          </div>
        </div>

        {/* Features Grid */}
        <div className="mb-20">
          <h2 className="text-4xl font-bold text-white text-center mb-12">
            Comprehensive Learning Platform
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="p-6 bg-black/30 border-white/20 hover:bg-black/40 transition-colors">
                {feature.icon}
                <h3 className="text-lg font-semibold text-white mb-3 text-center">
                  {feature.title}
                </h3>
                <p className="text-gray-400 text-center">
                  {feature.description}
                </p>
              </Card>
            ))}
          </div>
        </div>

        {/* Educational Benefits */}
        <div className="mb-20">
          <h2 className="text-4xl font-bold text-white text-center mb-12">
            Why Choose 3DZert?
          </h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <div className="flex items-start space-x-4">
                <div className="w-8 h-8 bg-cyan-500 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                  <span className="text-white font-bold">1</span>
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-white mb-2">Visual Learning</h3>
                  <p className="text-gray-300">See mathematical concepts come to life with interactive 3D visualizations that make abstract ideas concrete.</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-4">
                <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                  <span className="text-white font-bold">2</span>
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-white mb-2">Personalized Practice</h3>
                  <p className="text-gray-300">Adaptive learning system that adjusts to your pace and provides targeted feedback.</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-4">
                <div className="w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                  <span className="text-white font-bold">3</span>
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-white mb-2">Progress Tracking</h3>
                  <p className="text-gray-300">Monitor your learning journey with detailed analytics and achievement badges.</p>
                </div>
              </div>
            </div>
            
            <div className="bg-gradient-to-br from-cyan-500/20 to-blue-500/20 p-8 rounded-2xl border border-cyan-400/30">
              <h3 className="text-2xl font-bold text-white mb-4">Ready to Transform Your Math Skills?</h3>
              <p className="text-gray-300 mb-6">
                Join thousands of students who have already discovered the power of visual learning.
              </p>
              <Button 
                onClick={() => onShowAuthModal ? onShowAuthModal() : setShowAuthModal(true)}
                className="w-full bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-lg py-3"
              >
                Get Started Today
              </Button>
            </div>
          </div>
        </div>
      </div>

      {!onShowAuthModal && (
        <AuthModal 
          isOpen={showAuthModal}
          onClose={() => setShowAuthModal(false)}
          onLogin={handleLogin}
        />
      )}
    </div>
  );
};


export default Index;
