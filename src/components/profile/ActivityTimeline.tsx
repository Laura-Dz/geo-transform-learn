import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Clock } from 'lucide-react';

const MOCK_ACTIVITY_TIMELINE = [
  {
    id: '1',
    type: 'module_access',
    title: 'Explored Practice Mode',
    description: 'Spent 25 minutes working through real-world scenarios',
    timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    icon: '📚',
    category: 'Learning'
  },
  {
    id: '2',
    type: 'ai_interaction',
    title: 'AI Assistant Conversation',
    description: 'Asked about the relationship between scaling and function behavior',
    timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
    icon: '💬',
    category: 'Interaction'
  },
  {
    id: '3',
    type: 'challenge_attempt',
    title: 'Tackled Rotation Challenge',
    description: 'Attempted the "Spinning Surfaces" challenge with creative approach',
    timestamp: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    icon: '🎯',
    category: 'Challenge'
  },
  {
    id: '4',
    type: 'badge_earned',
    title: 'Earned "Creative Thinker" Badge',
    description: 'Recognized for innovative problem-solving approach',
    timestamp: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    icon: '🏆',
    category: 'Achievement'
  },
  {
    id: '5',
    type: 'exploration',
    title: 'Function Discovery Session',
    description: 'Experimented with parametric equations for 40 minutes',
    timestamp: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
    icon: '🔬',
    category: 'Discovery'
  }
];

interface ActivityTimelineProps {
  formatTimeAgo: (timestamp: string) => string;
  profileData: any;
}

const ActivityTimeline: React.FC<ActivityTimelineProps> = ({ formatTimeAgo }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Clock className="h-5 w-5 text-blue-500" />
          <span>Your Learning Journey</span>
        </CardTitle>
        <CardDescription>A chronological log of your engagement and discoveries</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {MOCK_ACTIVITY_TIMELINE.map((activity) => (
            <div key={activity.id} className="flex items-start space-x-4 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
              <div className="text-2xl">{activity.icon}</div>
              <div className="flex-1">
                <div className="flex items-center justify-between mb-1">
                  <h4 className="font-medium">{activity.title}</h4>
                  <span className="text-sm text-gray-500">{formatTimeAgo(activity.timestamp)}</span>
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                  {activity.description}
                </p>
                <Badge variant="outline" className="text-xs">
                  {activity.category}
                </Badge>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default ActivityTimeline;
