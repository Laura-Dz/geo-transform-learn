
import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import AuthModal from '@/components/AuthModal';
import MathVisualization from '@/components/MathVisualization';
import TransformationPanel from '@/components/TransformationPanel';
import ConceptExplanation from '@/components/ConceptExplanation';
import QuizModal from '@/components/QuizModal';
import ProgressDashboard from '@/components/ProgressDashboard';
import { Calculator, BookOpen, TrendingUp, User } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const Index = () => {
  const [user, setUser] = useState(null);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [showQuizModal, setShowQuizModal] = useState(false);
  const [activeTab, setActiveTab] = useState('visualize');
  const [currentFunction, setCurrentFunction] = useState('x^2 + y^2');
  const [transformations, setTransformations] = useState({
    translation: { x: 0, y: 0, z: 0 },
    scaling: { x: 1, y: 1, z: 1 },
    reflection: { x: false, y: false, z: false }
  });
  const [sessionProgress, setSessionProgress] = useState({
    transformationsApplied: 0,
    timeSpent: 0,
    conceptsExplored: []
  });
  const { toast } = useToast();

  useEffect(() => {
    // Check for existing authentication
    const token = localStorage.getItem('mathVizToken');
    if (token) {
      // Validate token and set user
      validateToken(token);
    }

    // Track session time
    const startTime = Date.now();
    const interval = setInterval(() => {
      setSessionProgress(prev => ({
        ...prev,
        timeSpent: Math.floor((Date.now() - startTime) / 1000)
      }));
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const validateToken = async (token: string) => {
    try {
      // This would typically make an API call to validate the token
      // For now, we'll simulate a valid user
      setUser({ id: '1', email: 'student@example.com', name: 'Student' });
    } catch (error) {
      localStorage.removeItem('mathVizToken');
    }
  };

  const handleLogin = (userData: any) => {
    setUser(userData);
    setShowAuthModal(false);
    toast({
      title: "Welcome back!",
      description: "Ready to explore 3D mathematics?",
    });
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('mathVizToken');
    toast({
      title: "Logged out",
      description: "See you next time!",
    });
  };

  const handleTransformationChange = (type: string, values: any) => {
    setTransformations(prev => ({
      ...prev,
      [type]: values
    }));
    setSessionProgress(prev => ({
      ...prev,
      transformationsApplied: prev.transformationsApplied + 1
    }));
  };

  const handleQuizComplete = (score: number) => {
    setShowQuizModal(false);
    toast({
      title: "Quiz Completed!",
      description: `You scored ${score}% - Great work!`,
    });
    
    // Save progress (would be API call in real app)
    console.log('Saving quiz score:', score);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900">
      {/* Header */}
      <header className="border-b border-white/10 bg-black/20 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Calculator className="h-8 w-8 text-cyan-400" />
            <h1 className="text-2xl font-bold text-white">MathViz 3D</h1>
          </div>
          
          <div className="flex items-center space-x-4">
            {user ? (
              <>
                <span className="text-white">Welcome, {user.name}!</span>
                <Button variant="outline" onClick={handleLogout}>
                  Logout
                </Button>
              </>
            ) : (
              <Button onClick={() => setShowAuthModal(true)} className="bg-cyan-500 hover:bg-cyan-600">
                <User className="h-4 w-4 mr-2" />
                Login / Register
              </Button>
            )}
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {user ? (
          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
            <TabsList className="grid w-full grid-cols-3 bg-black/30">
              <TabsTrigger value="visualize" className="data-[state=active]:bg-cyan-500">
                <Calculator className="h-4 w-4 mr-2" />
                Visualize
              </TabsTrigger>
              <TabsTrigger value="learn" className="data-[state=active]:bg-cyan-500">
                <BookOpen className="h-4 w-4 mr-2" />
                Learn
              </TabsTrigger>
              <TabsTrigger value="progress" className="data-[state=active]:bg-cyan-500">
                <TrendingUp className="h-4 w-4 mr-2" />
                Progress
              </TabsTrigger>
            </TabsList>

            <TabsContent value="visualize" className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Function Input */}
                <Card className="p-6 bg-black/30 border-white/20">
                  <h3 className="text-lg font-semibold text-white mb-4">Function Input</h3>
                  <Input
                    value={currentFunction}
                    onChange={(e) => setCurrentFunction(e.target.value)}
                    placeholder="Enter function (e.g., x^2 + y^2)"
                    className="bg-black/50 border-white/30 text-white"
                  />
                  <p className="text-sm text-gray-400 mt-2">
                    Current: f(x,y) = {currentFunction}
                  </p>
                </Card>

                {/* 3D Visualization */}
                <Card className="lg:col-span-2 bg-black/30 border-white/20">
                  <MathVisualization 
                    functionExpression={currentFunction}
                    transformations={transformations}
                  />
                </Card>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Transformation Controls */}
                <TransformationPanel
                  transformations={transformations}
                  onChange={handleTransformationChange}
                />

                {/* Concept Explanation */}
                <ConceptExplanation 
                  transformations={transformations}
                  onConceptExplored={(concept) => {
                    setSessionProgress(prev => ({
                      ...prev,
                      conceptsExplored: [...prev.conceptsExplored, concept]
                    }));
                  }}
                />
              </div>

              <div className="flex justify-center">
                <Button 
                  onClick={() => setShowQuizModal(true)}
                  className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
                >
                  Take Quiz
                </Button>
              </div>
            </TabsContent>

            <TabsContent value="learn">
              <ConceptExplanation 
                transformations={transformations}
                detailed={true}
                onConceptExplored={(concept) => {
                  setSessionProgress(prev => ({
                    ...prev,
                    conceptsExplored: [...prev.conceptsExplored, concept]
                  }));
                }}
              />
            </TabsContent>

            <TabsContent value="progress">
              <ProgressDashboard user={user} sessionProgress={sessionProgress} />
            </TabsContent>
          </Tabs>
        ) : (
          // Landing page for non-authenticated users
          <div className="text-center py-20">
            <div className="max-w-4xl mx-auto">
              <Calculator className="h-20 w-20 text-cyan-400 mx-auto mb-8" />
              <h1 className="text-5xl font-bold text-white mb-6">
                Explore Mathematics in 3D
              </h1>
              <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
                Visualize mathematical functions, apply transformations, and learn through interactive 3D experiences. 
                Perfect for students wanting to understand complex mathematical concepts visually.
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
                <Card className="p-6 bg-black/30 border-white/20">
                  <Calculator className="h-12 w-12 text-cyan-400 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-white mb-2">3D Visualization</h3>
                  <p className="text-gray-400">
                    Render mathematical functions in beautiful 3D space with interactive controls.
                  </p>
                </Card>
                
                <Card className="p-6 bg-black/30 border-white/20">
                  <BookOpen className="h-12 w-12 text-green-400 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-white mb-2">Interactive Learning</h3>
                  <p className="text-gray-400">
                    Apply transformations and see real-time changes with detailed explanations.
                  </p>
                </Card>
                
                <Card className="p-6 bg-black/30 border-white/20">
                  <TrendingUp className="h-12 w-12 text-yellow-400 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-white mb-2">Progress Tracking</h3>
                  <p className="text-gray-400">
                    Track your learning journey with quizzes and detailed analytics.
                  </p>
                </Card>
              </div>
              
              <Button 
                onClick={() => setShowAuthModal(true)}
                size="lg"
                className="bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-lg px-8 py-4"
              >
                Get Started - It's Free!
              </Button>
            </div>
          </div>
        )}
      </div>

      {/* Modals */}
      <AuthModal 
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        onLogin={handleLogin}
      />
      
      <QuizModal
        isOpen={showQuizModal}
        onClose={() => setShowQuizModal(false)}
        onComplete={handleQuizComplete}
        transformations={transformations}
      />
    </div>
  );
};

export default Index;
