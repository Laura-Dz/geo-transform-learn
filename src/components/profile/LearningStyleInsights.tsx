import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Brain, Lightbulb, Zap, RotateCw, Move, Scale } from 'lucide-react';

const LEARNING_STYLE_INSIGHTS = {
  preferredTransformations: [
    { type: 'Rotation', percentage: 45, description: 'You love exploring how objects spin in 3D space', icon: RotateCw },
    { type: 'Translation', percentage: 30, description: 'Moving objects around helps you understand positioning', icon: Move },
    { type: 'Scaling', percentage: 25, description: 'You enjoy seeing how size changes affect function behavior', icon: Scale }
  ],
  interactionPatterns: [
    { mode: 'Practice Mode', timeSpent: 60, description: 'You prefer hands-on, scenario-based learning' },
    { mode: 'Challenges', timeSpent: 25, description: 'You enjoy creative problem-solving' },
    { mode: 'Quiz Mode', timeSpent: 15, description: 'You use quizzes for quick knowledge checks' }
  ],
  suggestedModules: [
    'Advanced Rotation Techniques',
    'Real-world Physics Applications',
    'Creative Challenge Series'
  ]
};

const LearningStyleInsights: React.FC = () => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Brain className="h-5 w-5 text-purple-500" />
            <span>Your Learning Style</span>
          </CardTitle>
          <CardDescription>Insights based on your interaction patterns</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <h4 className="font-medium mb-3">Preferred Transformations</h4>
            <div className="space-y-3">
              {LEARNING_STYLE_INSIGHTS.preferredTransformations.map((item, index) => {
                const IconComponent = item.icon;
                return (
                  <div key={index} className="flex items-center space-x-3">
                    <IconComponent className="h-5 w-5 text-blue-500" />
                    <div className="flex-1">
                      <div className="flex justify-between text-sm mb-1">
                        <span className="font-medium">{item.type}</span>
                        <span className="text-gray-500">{item.percentage}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full" 
                          style={{width: `${item.percentage}%`}}
                        />
                      </div>
                      <p className="text-xs text-gray-600 mt-1">{item.description}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Lightbulb className="h-5 w-5 text-yellow-500" />
            <span>Suggested for You</span>
          </CardTitle>
          <CardDescription>Modules that align with your learning habits</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {LEARNING_STYLE_INSIGHTS.suggestedModules.map((module, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <div className="flex items-center space-x-3">
                  <Zap className="h-4 w-4 text-yellow-500" />
                  <span className="font-medium">{module}</span>
                </div>
                <Button size="sm" variant="outline">Explore</Button>
              </div>
            ))}
          </div>
          
          <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
            <h4 className="font-medium text-blue-800 dark:text-blue-200 mb-2">Your Learning Pattern</h4>
            <p className="text-sm text-blue-700 dark:text-blue-300">
              You spend most time in Practice Mode ({LEARNING_STYLE_INSIGHTS.interactionPatterns[0].timeSpent}% of sessions), 
              showing you prefer hands-on, scenario-based learning over theoretical approaches.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default LearningStyleInsights;
