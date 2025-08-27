import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Target, Plus, CheckCircle, Clock } from 'lucide-react';

const MOCK_LEARNING_GOALS = [
  {
    id: '1',
    title: 'Master 3D Rotations',
    description: 'Understand how rotation matrices work in 3D space',
    progress: 75,
    targetDate: '2024-09-15',
    status: 'in_progress',
    milestones: ['Basic rotation concepts', 'Euler angles', 'Quaternions']
  },
  {
    id: '2',
    title: 'Complete Advanced Challenges',
    description: 'Solve all expert-level transformation challenges',
    progress: 40,
    targetDate: '2024-10-01',
    status: 'in_progress',
    milestones: ['Creative solutions', 'Efficiency optimization', 'Real-world applications']
  },
  {
    id: '3',
    title: 'Parametric Function Mastery',
    description: 'Create complex parametric visualizations',
    progress: 100,
    targetDate: '2024-08-20',
    status: 'completed',
    milestones: ['Basic parametrics', 'Complex curves', 'Surface generation']
  }
];

interface LearningGoalsPanelProps {
  isEditing: boolean;
  isOwnProfile: boolean;
  formatDate: (dateString: string) => string;
  profileData: any;
}

const LearningGoalsPanel: React.FC<LearningGoalsPanelProps> = ({
  isEditing,
  isOwnProfile,
  formatDate
}) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300';
      case 'in_progress': return 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-300';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-300';
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center space-x-2">
              <Target className="h-5 w-5 text-green-500" />
              <span>Learning Goals</span>
            </CardTitle>
            <CardDescription>Track your mathematical learning objectives</CardDescription>
          </div>
          {isOwnProfile && (
            <Button size="sm" variant="outline">
              <Plus className="h-4 w-4 mr-2" />
              Add Goal
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {MOCK_LEARNING_GOALS.map((goal) => (
            <div key={goal.id} className="border rounded-lg p-4 space-y-4">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-2">
                    <h3 className="font-semibold">{goal.title}</h3>
                    <Badge className={getStatusColor(goal.status)}>
                      {goal.status === 'completed' ? (
                        <CheckCircle className="h-3 w-3 mr-1" />
                      ) : (
                        <Clock className="h-3 w-3 mr-1" />
                      )}
                      {goal.status.replace('_', ' ')}
                    </Badge>
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                    {goal.description}
                  </p>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Progress</span>
                      <span>{goal.progress}%</span>
                    </div>
                    <Progress value={goal.progress} className="h-2" />
                  </div>
                  
                  <div className="mt-3">
                    <p className="text-sm text-gray-500 mb-2">
                      Target: {formatDate(goal.targetDate)}
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {goal.milestones.map((milestone, index) => (
                        <Badge key={index} variant="outline" className="text-xs">
                          {milestone}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
        
        {isEditing && (
          <div className="mt-6 p-4 border-2 border-dashed border-gray-300 rounded-lg">
            <div className="text-center space-y-3">
              <Target className="h-8 w-8 text-gray-400 mx-auto" />
              <div>
                <h4 className="font-medium text-gray-700 dark:text-gray-300">Add New Goal</h4>
                <p className="text-sm text-gray-500">Set a new learning objective</p>
              </div>
              <div className="space-y-3 max-w-md mx-auto">
                <Input placeholder="Goal title" />
                <Input placeholder="Target date (YYYY-MM-DD)" />
                <Button className="w-full">
                  <Plus className="h-4 w-4 mr-2" />
                  Create Goal
                </Button>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default LearningGoalsPanel;
