import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { BookOpen, Target, Zap, Trophy, Brain } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import ConceptExplanation from '@/components/ConceptExplanation';

const LearningHubPage = () => {
  const navigate = useNavigate();
  const [currentFunction, setCurrentFunction] = useState('x^2 + y^2');
  const [transformationDescription, setTransformationDescription] = useState('Exploring basic quadratic surface');
  const [studentLevel] = useState('intermediate');
  const [interestTags] = useState(['visualization', '3d-math']);
  const [preferredTone] = useState('encouraging');

  return (
    <div className="space-y-8">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-white mb-4">🎯 Learning Hub</h1>
        <p className="text-gray-300 text-lg">Choose your learning path and master 3D transformations</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Quiz Zone */}
        <Card className="bg-black/30 border-white/20 hover:border-blue-500/50 transition-colors cursor-pointer group">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-3">
              <div className="p-2 bg-blue-600 rounded-lg group-hover:bg-blue-500 transition-colors">
                <Trophy className="h-6 w-6" />
              </div>
              Quiz Zone
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-gray-300">
              Test your understanding with interactive multiple-choice questions featuring live 3D visualizations.
            </p>
            
            <div className="space-y-2">
              <Badge variant="outline" className="border-blue-500 text-blue-300">
                Adaptive Difficulty
              </Badge>
              <Badge variant="outline" className="border-green-500 text-green-300">
                Timed Challenges
              </Badge>
              <Badge variant="outline" className="border-purple-500 text-purple-300">
                Real-time Feedback
              </Badge>
            </div>

            <div className="pt-4">
              <Button 
                onClick={() => navigate('/quiz')}
                className="w-full bg-blue-600 hover:bg-blue-700"
              >
                Start Quiz
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Challenges */}
        <Card className="bg-black/30 border-white/20 hover:border-orange-500/50 transition-colors cursor-pointer group">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-3">
              <div className="p-2 bg-orange-600 rounded-lg group-hover:bg-orange-500 transition-colors">
                <Target className="h-6 w-6" />
              </div>
              Challenges
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-gray-300">
              Apply transformations creatively to solve open-ended problems with multiple solution paths.
            </p>
            
            <div className="space-y-2">
              <Badge variant="outline" className="border-orange-500 text-orange-300">
                Open-ended Tasks
              </Badge>
              <Badge variant="outline" className="border-yellow-500 text-yellow-300">
                Creative Solutions
              </Badge>
              <Badge variant="outline" className="border-red-500 text-red-300">
                AI Hints
              </Badge>
            </div>

            <div className="pt-4">
              <Button 
                onClick={() => navigate('/challenges')}
                className="w-full bg-orange-600 hover:bg-orange-700"
              >
                Start Challenge
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Practice Mode */}
        <Card className="bg-black/30 border-white/20 hover:border-green-500/50 transition-colors cursor-pointer group">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-3">
              <div className="p-2 bg-green-600 rounded-lg group-hover:bg-green-500 transition-colors">
                <BookOpen className="h-6 w-6" />
              </div>
              Practice Mode
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-gray-300">
              Learn through guided real-world scenarios with step-by-step exploration and reflection.
            </p>
            
            <div className="space-y-2">
              <Badge variant="outline" className="border-green-500 text-green-300">
                Real-world Scenarios
              </Badge>
              <Badge variant="outline" className="border-blue-500 text-blue-300">
                Guided Learning
              </Badge>
              <Badge variant="outline" className="border-purple-500 text-purple-300">
                Reflection Prompts
              </Badge>
            </div>

            <div className="pt-4">
              <Button 
                onClick={() => navigate('/practice')}
                className="w-full bg-green-600 hover:bg-green-700"
              >
                Start Practice
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* AI-Powered Learning Assistant */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="bg-black/30 border-white/20">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <Brain className="h-5 w-5" />
              AI Learning Assistant
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm text-gray-400">Current Function:</label>
              <Input
                value={currentFunction}
                onChange={(e) => setCurrentFunction(e.target.value)}
                placeholder="Enter function (e.g., x^2 + y^2)"
                className="bg-black/50 border-white/30 text-white"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm text-gray-400">What are you exploring?</label>
              <Input
                value={transformationDescription}
                onChange={(e) => setTransformationDescription(e.target.value)}
                placeholder="Describe your mathematical exploration"
                className="bg-black/50 border-white/30 text-white"
              />
            </div>
          </CardContent>
        </Card>

        <div className="lg:col-span-2">
          <ConceptExplanation
            currentFunction={currentFunction}
            transformationDescription={transformationDescription}
            studentLevel={studentLevel}
            interestTags={interestTags}
            preferredTone={preferredTone}
          />
        </div>
      </div>

      {/* Quick Stats */}
      <Card className="bg-black/30 border-white/20">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <Zap className="h-5 w-5" />
            Your Progress
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-400">0</div>
              <div className="text-gray-400">Quizzes Completed</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-orange-400">0</div>
              <div className="text-gray-400">Challenges Solved</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-green-400">0</div>
              <div className="text-gray-400">Scenarios Practiced</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default LearningHubPage;
