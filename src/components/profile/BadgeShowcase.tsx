import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Trophy } from 'lucide-react';

const MOCK_BADGES = [
  {
    id: '1',
    name: 'Explorer',
    description: 'Discovered the 3D visualization world',
    icon: '🌟',
    story: 'Earned when you first opened the app and began your mathematical journey',
    earnedDate: new Date(Date.now() - 25 * 24 * 60 * 60 * 1000).toISOString(),
    category: 'Discovery'
  },
  {
    id: '2',
    name: 'Transformation Enthusiast',
    description: 'Loves experimenting with rotations',
    icon: '🔄',
    story: 'You spent over 30 minutes just playing with rotation controls - that curiosity is amazing!',
    earnedDate: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000).toISOString(),
    category: 'Engagement'
  },
  {
    id: '3',
    name: 'AI Collaborator',
    description: 'Frequently chats with the AI assistant',
    icon: '🤖',
    story: 'You asked the AI assistant over 50 questions - learning through conversation is powerful!',
    earnedDate: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString(),
    category: 'Interaction'
  },
  {
    id: '4',
    name: 'Pattern Seeker',
    description: 'Enjoys finding mathematical patterns',
    icon: '🔍',
    story: 'You consistently explore how different transformations affect various function types',
    earnedDate: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
    category: 'Discovery'
  },
  {
    id: '5',
    name: 'Creative Thinker',
    description: 'Approaches challenges uniquely',
    icon: '💡',
    story: 'Your creative solutions in the challenges module show innovative thinking',
    earnedDate: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    category: 'Creativity'
  }
];

interface BadgeShowcaseProps {
  formatTimeAgo: (timestamp: string) => string;
  getCategoryColor: (category: string) => string;
  profileData: any;
}

const BadgeShowcase: React.FC<BadgeShowcaseProps> = ({ formatTimeAgo, getCategoryColor }) => {
  const [selectedBadge, setSelectedBadge] = useState<any>(null);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Trophy className="h-5 w-5 text-yellow-500" />
          <span>Your Badge Collection</span>
        </CardTitle>
        <CardDescription>Celebrating your unique learning journey and achievements</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {MOCK_BADGES.map((badge) => (
            <Card 
              key={badge.id} 
              className="cursor-pointer hover:shadow-lg transition-shadow bg-gradient-to-br from-yellow-50 to-orange-50 dark:from-yellow-900/20 dark:to-orange-900/20"
              onClick={() => setSelectedBadge(badge)}
            >
              <CardContent className="p-4">
                <div className="text-center space-y-3">
                  <div className="text-4xl">{badge.icon}</div>
                  <div>
                    <h3 className="font-semibold">{badge.name}</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {badge.description}
                    </p>
                  </div>
                  <Badge className={getCategoryColor(badge.category)}>
                    {badge.category}
                  </Badge>
                  <p className="text-xs text-gray-500">
                    Earned {formatTimeAgo(badge.earnedDate)}
                  </p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
        
        {/* Badge Story Modal */}
        {selectedBadge && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" onClick={() => setSelectedBadge(null)}>
            <Card className="max-w-md mx-4" onClick={(e) => e.stopPropagation()}>
              <CardHeader>
                <CardTitle className="flex items-center space-x-3">
                  <span className="text-3xl">{selectedBadge.icon}</span>
                  <span>{selectedBadge.name}</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <p className="text-gray-600 dark:text-gray-400">
                    {selectedBadge.description}
                  </p>
                  <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                    <h4 className="font-medium text-blue-800 dark:text-blue-200 mb-2">Your Story</h4>
                    <p className="text-sm text-blue-700 dark:text-blue-300">
                      {selectedBadge.story}
                    </p>
                  </div>
                  <Button onClick={() => setSelectedBadge(null)} className="w-full">
                    Close
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default BadgeShowcase;
