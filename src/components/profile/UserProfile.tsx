import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  User, 
  Trophy, 
  Clock, 
  Target, 
  BookOpen, 
  Calendar, 
  Settings, 
  Edit3,
  Save,
  X,
  Star,
  TrendingUp,
  Award
} from 'lucide-react';
import { UserProfile as UserProfileType, Achievement, StudySession, SkillLevel } from '@/types/database';
import { useToast } from '@/hooks/use-toast';

// Mock user profile data
const MOCK_USER_PROFILE: UserProfileType = {
  id: '1',
  userId: '1',
  bio: 'Passionate about mathematics and 3D visualization. Currently studying calculus and linear algebra.',
  learningGoals: 'Master multivariable calculus and understand 3D transformations for engineering applications.',
  preferredTopics: ['Calculus', 'Linear Algebra', '3D Geometry'],
  skillLevel: 'INTERMEDIATE',
  totalStudyTime: 1250, // minutes
  streakDays: 7,
  lastActiveDate: new Date().toISOString(),
  settings: {
    notifications: true,
    darkMode: false,
    language: 'en'
  },
  createdAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(), // 30 days ago
  updatedAt: new Date().toISOString(),
  user: {
    id: '1',
    name: 'Laura',
    email: 'laura@example.com',
    role: 'ADMIN',
    avatar: '',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    password: ''
  }
};

// Mock achievements data
const MOCK_ACHIEVEMENTS: Achievement[] = [
  {
    id: '1',
    name: 'First Steps',
    description: 'Complete your first concept',
    icon: '🎯',
    category: 'LEARNING',
    criteria: { conceptsCompleted: 1 },
    points: 10,
    isActive: true,
    createdAt: new Date().toISOString()
  },
  {
    id: '2',
    name: 'Quiz Master',
    description: 'Score 100% on 5 quizzes',
    icon: '🧠',
    category: 'PRACTICE',
    criteria: { perfectQuizzes: 5 },
    points: 50,
    isActive: true,
    createdAt: new Date().toISOString()
  },
  {
    id: '3',
    name: 'Week Warrior',
    description: 'Maintain a 7-day study streak',
    icon: '🔥',
    category: 'STREAK',
    criteria: { streakDays: 7 },
    points: 25,
    isActive: true,
    createdAt: new Date().toISOString()
  },
  {
    id: '4',
    name: 'Function Explorer',
    description: 'Visualize 20 different functions',
    icon: '📊',
    category: 'LEARNING',
    criteria: { functionsVisualized: 20 },
    points: 30,
    isActive: true,
    createdAt: new Date().toISOString()
  }
];

// Mock study sessions data
const MOCK_STUDY_SESSIONS: StudySession[] = [
  {
    id: '1',
    userId: '1',
    startTime: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    endTime: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(),
    duration: 60,
    activitiesCount: 5,
    conceptsStudied: ['1', '2'],
    createdAt: new Date().toISOString(),
    user: MOCK_USER_PROFILE.user
  },
  {
    id: '2',
    userId: '1',
    startTime: new Date(Date.now() - 25 * 60 * 60 * 1000).toISOString(),
    endTime: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
    duration: 45,
    activitiesCount: 3,
    conceptsStudied: ['1'],
    createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
    user: MOCK_USER_PROFILE.user
  }
];

interface UserProfileProps {
  userId?: string;
  isOwnProfile?: boolean;
}

const UserProfile: React.FC<UserProfileProps> = ({ userId, isOwnProfile = true }) => {
  const [profile, setProfile] = useState<UserProfileType>(MOCK_USER_PROFILE);
  const [isEditing, setIsEditing] = useState(false);
  const [editedProfile, setEditedProfile] = useState<Partial<UserProfileType>>(profile);
  const { toast } = useToast();

  const handleSaveProfile = () => {
    setProfile(prev => ({ ...prev, ...editedProfile }));
    setIsEditing(false);
    toast({
      title: "Profile Updated",
      description: "Your profile has been successfully updated.",
    });
  };

  const handleCancelEdit = () => {
    setEditedProfile(profile);
    setIsEditing(false);
  };

  const formatStudyTime = (minutes: number): string => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}h ${mins}m`;
  };

  const getSkillLevelColor = (level: SkillLevel): string => {
    switch (level) {
      case 'BEGINNER': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'INTERMEDIATE': return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
      case 'ADVANCED': return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200';
      case 'EXPERT': return 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
    }
  };

  const unlockedAchievements = MOCK_ACHIEVEMENTS.filter(achievement => {
    // Mock logic for unlocked achievements
    if (achievement.name === 'First Steps') return true;
    if (achievement.name === 'Week Warrior') return profile.streakDays >= 7;
    return Math.random() > 0.5; // Random for demo
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Avatar className="h-16 w-16">
            <AvatarImage src={profile.user.avatar} />
            <AvatarFallback className="text-lg">
              {profile.user.name.split(' ').map(n => n[0]).join('')}
            </AvatarFallback>
          </Avatar>
          <div>
            <h1 className="text-3xl font-bold">{profile.user.name}</h1>
            <p className="text-gray-600 dark:text-gray-400">{profile.user.email}</p>
            <Badge className={getSkillLevelColor(profile.skillLevel)}>
              {profile.skillLevel}
            </Badge>
          </div>
        </div>
        {isOwnProfile && (
          <Button
            variant={isEditing ? "outline" : "default"}
            onClick={() => setIsEditing(!isEditing)}
          >
            {isEditing ? <X className="h-4 w-4 mr-2" /> : <Edit3 className="h-4 w-4 mr-2" />}
            {isEditing ? 'Cancel' : 'Edit Profile'}
          </Button>
        )}
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Clock className="h-8 w-8 text-blue-500" />
              <div>
                <p className="text-2xl font-bold">{formatStudyTime(profile.totalStudyTime)}</p>
                <p className="text-sm text-gray-600">Total Study Time</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Target className="h-8 w-8 text-green-500" />
              <div>
                <p className="text-2xl font-bold">{profile.streakDays}</p>
                <p className="text-sm text-gray-600">Day Streak</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Trophy className="h-8 w-8 text-yellow-500" />
              <div>
                <p className="text-2xl font-bold">{unlockedAchievements.length}</p>
                <p className="text-sm text-gray-600">Achievements</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <BookOpen className="h-8 w-8 text-purple-500" />
              <div>
                <p className="text-2xl font-bold">12</p>
                <p className="text-sm text-gray-600">Concepts Learned</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="achievements">Achievements</TabsTrigger>
          <TabsTrigger value="activity">Activity</TabsTrigger>
          {isOwnProfile && <TabsTrigger value="settings">Settings</TabsTrigger>}
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Profile Information */}
            <Card>
              <CardHeader>
                <CardTitle>Profile Information</CardTitle>
                <CardDescription>Your personal information and learning preferences</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {isEditing ? (
                  <div className="space-y-4">
                    <div>
                      <label className="text-sm font-medium">Bio</label>
                      <Textarea
                        value={editedProfile.bio || ''}
                        onChange={(e) => setEditedProfile(prev => ({ ...prev, bio: e.target.value }))}
                        placeholder="Tell us about yourself..."
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium">Learning Goals</label>
                      <Textarea
                        value={editedProfile.learningGoals || ''}
                        onChange={(e) => setEditedProfile(prev => ({ ...prev, learningGoals: e.target.value }))}
                        placeholder="What do you want to achieve?"
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium">Skill Level</label>
                      <Select
                        value={editedProfile.skillLevel || profile.skillLevel}
                        onValueChange={(value: SkillLevel) => setEditedProfile(prev => ({ ...prev, skillLevel: value }))}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="BEGINNER">Beginner</SelectItem>
                          <SelectItem value="INTERMEDIATE">Intermediate</SelectItem>
                          <SelectItem value="ADVANCED">Advanced</SelectItem>
                          <SelectItem value="EXPERT">Expert</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="flex space-x-2">
                      <Button onClick={handleSaveProfile}>
                        <Save className="h-4 w-4 mr-2" />
                        Save Changes
                      </Button>
                      <Button variant="outline" onClick={handleCancelEdit}>
                        Cancel
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-medium">Bio</h4>
                      <p className="text-gray-600 dark:text-gray-400">
                        {profile.bio || 'No bio provided'}
                      </p>
                    </div>
                    <div>
                      <h4 className="font-medium">Learning Goals</h4>
                      <p className="text-gray-600 dark:text-gray-400">
                        {profile.learningGoals || 'No goals set'}
                      </p>
                    </div>
                    <div>
                      <h4 className="font-medium">Preferred Topics</h4>
                      <div className="flex flex-wrap gap-2 mt-1">
                        {profile.preferredTopics.map((topic, index) => (
                          <Badge key={index} variant="outline">{topic}</Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Learning Progress */}
            <Card>
              <CardHeader>
                <CardTitle>Learning Progress</CardTitle>
                <CardDescription>Your progress across different topics</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>Algebra</span>
                      <span>85%</span>
                    </div>
                    <Progress value={85} className="h-2" />
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>Calculus</span>
                      <span>60%</span>
                    </div>
                    <Progress value={60} className="h-2" />
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>Geometry</span>
                      <span>40%</span>
                    </div>
                    <Progress value={40} className="h-2" />
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>Trigonometry</span>
                      <span>75%</span>
                    </div>
                    <Progress value={75} className="h-2" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Recent Activity */}
          <Card>
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
              <CardDescription>Your latest learning activities</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {MOCK_STUDY_SESSIONS.slice(0, 5).map((session, index) => (
                  <div key={session.id} className="flex items-center space-x-4 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                    <Calendar className="h-5 w-5 text-blue-500" />
                    <div className="flex-1">
                      <p className="font-medium">Study Session</p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {session.duration} minutes • {session.activitiesCount} activities
                      </p>
                    </div>
                    <div className="text-sm text-gray-500">
                      {new Date(session.startTime).toLocaleDateString()}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="achievements" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {MOCK_ACHIEVEMENTS.map((achievement) => {
              const isUnlocked = unlockedAchievements.some(a => a.id === achievement.id);
              
              return (
                <Card key={achievement.id} className={`${isUnlocked ? 'bg-gradient-to-br from-yellow-50 to-orange-50 dark:from-yellow-900/20 dark:to-orange-900/20' : 'opacity-60'}`}>
                  <CardContent className="p-4">
                    <div className="flex items-start space-x-3">
                      <div className="text-3xl">{achievement.icon}</div>
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-1">
                          <h3 className="font-semibold">{achievement.name}</h3>
                          {isUnlocked && <Award className="h-4 w-4 text-yellow-500" />}
                        </div>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                          {achievement.description}
                        </p>
                        <div className="flex items-center justify-between">
                          <Badge variant={isUnlocked ? "default" : "outline"}>
                            {achievement.category}
                          </Badge>
                          <div className="flex items-center space-x-1">
                            <Star className="h-4 w-4 text-yellow-500" />
                            <span className="text-sm">{achievement.points}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </TabsContent>

        <TabsContent value="activity" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Study Sessions</CardTitle>
              <CardDescription>Detailed view of your learning sessions</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {MOCK_STUDY_SESSIONS.map((session) => (
                  <div key={session.id} className="border rounded-lg p-4">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center space-x-2">
                        <Clock className="h-5 w-5 text-blue-500" />
                        <span className="font-medium">
                          {formatStudyTime(session.duration || 0)}
                        </span>
                      </div>
                      <span className="text-sm text-gray-500">
                        {new Date(session.startTime).toLocaleString()}
                      </span>
                    </div>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="text-gray-600">Activities:</span>
                        <span className="ml-2 font-medium">{session.activitiesCount}</span>
                      </div>
                      <div>
                        <span className="text-gray-600">Concepts:</span>
                        <span className="ml-2 font-medium">{session.conceptsStudied.length}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {isOwnProfile && (
          <TabsContent value="settings" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Account Settings</CardTitle>
                <CardDescription>Manage your account preferences</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium">Email</label>
                    <Input value={profile.user.email} disabled />
                  </div>
                  <div>
                    <label className="text-sm font-medium">Name</label>
                    <Input value={profile.user.name} />
                  </div>
                  <Button>Update Account</Button>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Preferences</CardTitle>
                <CardDescription>Customize your learning experience</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Email Notifications</p>
                      <p className="text-sm text-gray-600">Receive updates about your progress</p>
                    </div>
                    <Button variant="outline" size="sm">
                      {profile.settings?.notifications ? 'Enabled' : 'Disabled'}
                    </Button>
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Dark Mode</p>
                      <p className="text-sm text-gray-600">Toggle dark theme</p>
                    </div>
                    <Button variant="outline" size="sm">
                      {profile.settings?.darkMode ? 'On' : 'Off'}
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        )}
      </Tabs>
    </div>
  );
};

export default UserProfile;
