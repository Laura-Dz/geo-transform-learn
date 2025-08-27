import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Calendar, Edit3, Save, X, Quote } from 'lucide-react';

interface UserIdentityPanelProps {
  profile: any;
  isEditing: boolean;
  editedProfile: any;
  isOwnProfile: boolean;
  onEditToggle: () => void;
  onSave: () => void;
  onCancel: () => void;
  onProfileChange: (updates: any) => void;
  formatJoinDate: (date: string) => string;
}

const UserIdentityPanel: React.FC<UserIdentityPanelProps> = ({
  profile,
  isEditing,
  editedProfile,
  isOwnProfile,
  onEditToggle,
  onSave,
  onCancel,
  onProfileChange,
  formatJoinDate
}) => {
  return (
    <Card className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20">
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-6">
            <Avatar className="h-20 w-20 ring-4 ring-white shadow-lg">
              <AvatarImage src={profile.user.avatar} />
              <AvatarFallback className="text-xl bg-gradient-to-br from-blue-500 to-purple-500 text-white">
                {profile.user.name.split(' ').map((n: string) => n[0]).join('')}
              </AvatarFallback>
            </Avatar>
            <div>
              <h1 className="text-3xl font-bold">{profile.user.name}</h1>
              <p className="text-gray-600 dark:text-gray-400 mb-2">{profile.user.email}</p>
              <div className="flex items-center space-x-2 text-sm text-gray-500">
                <Calendar className="h-4 w-4" />
                <span>Joined {formatJoinDate(profile.joinedDate)}</span>
              </div>
            </div>
          </div>
          {isOwnProfile && (
            <Button
              variant={isEditing ? "outline" : "default"}
              onClick={onEditToggle}
              className="shadow-lg"
            >
              {isEditing ? <X className="h-4 w-4 mr-2" /> : <Edit3 className="h-4 w-4 mr-2" />}
              {isEditing ? 'Cancel' : 'Personalize'}
            </Button>
          )}
        </div>
        
        {/* Bio and Quote */}
        <div className="mt-6 space-y-4">
          {isEditing ? (
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium">Bio</label>
                <Textarea
                  value={editedProfile.bio || ''}
                  onChange={(e) => onProfileChange({ bio: e.target.value })}
                  placeholder="Tell us about your mathematical journey..."
                  className="mt-1"
                />
              </div>
              <div>
                <label className="text-sm font-medium">Motivational Quote</label>
                <Input
                  value={editedProfile.motivationalQuote || ''}
                  onChange={(e) => onProfileChange({ motivationalQuote: e.target.value })}
                  placeholder="What inspires your learning?"
                  className="mt-1"
                />
              </div>
              <div className="flex space-x-2">
                <Button onClick={onSave} className="shadow-lg">
                  <Save className="h-4 w-4 mr-2" />
                  Save Changes
                </Button>
                <Button variant="outline" onClick={onCancel}>
                  Cancel
                </Button>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <div>
                <h3 className="font-medium text-gray-700 dark:text-gray-300 mb-2">About Me</h3>
                <p className="text-gray-600 dark:text-gray-400">
                  {profile.bio || 'No bio provided yet - click Personalize to add one!'}
                </p>
              </div>
              {profile.motivationalQuote && (
                <div className="bg-white/50 dark:bg-gray-800/50 p-4 rounded-lg border-l-4 border-blue-500">
                  <div className="flex items-start space-x-2">
                    <Quote className="h-5 w-5 text-blue-500 mt-0.5" />
                    <p className="italic text-gray-700 dark:text-gray-300">
                      {profile.motivationalQuote}
                    </p>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default UserIdentityPanel;
