import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  TrendingUp, 
  Target, 
  Clock, 
  Trophy, 
  BookOpen, 
  Brain,
  Calendar,
  Star,
  Award,
  Activity,
  BarChart3,
  PieChart,
  LineChart
} from 'lucide-react';
import { Progress as ProgressType, StudySession, UserAchievement, Category } from '@/types/database';

// Mock progress data
const MOCK_PROGRESS_DATA = {
  overallProgress: 68,
  conceptsCompleted: 12,
  totalConcepts: 25,
  quizzesCompleted: 8,
  totalQuizzes: 15,
  studyStreak: 7,
  totalStudyTime: 1250, // minutes
  weeklyGoal: 300, // minutes
  weeklyProgress: 180, // minutes
  categoryProgress: [
    { category: 'ALGEBRA' as Category, completed: 8, total: 10, percentage: 80 },
    { category: 'CALCULUS' as Category, completed: 3, total: 8, percentage: 37.5 },
    { category: 'GEOMETRY' as Category, completed: 1, total: 4, percentage: 25 },
    { category: 'TRIGONOMETRY' as Category, completed: 0, total: 3, percentage: 0 }
  ],
  recentAchievements: [
    { id: '1', name: 'Week Warrior', icon: '🔥', unlockedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString() },
    { id: '2', name: 'Quiz Master', icon: '🧠', unlockedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString() },
    { id: '3', name: 'Function Explorer', icon: '📊', unlockedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString() }
  ],
  weeklyActivity: [
    { day: 'Mon', minutes: 45 },
    { day: 'Tue', minutes: 30 },
    { day: 'Wed', minutes: 0 },
    { day: 'Thu', minutes: 60 },
    { day: 'Fri', minutes: 25 },
    { day: 'Sat', minutes: 20 },
    { day: 'Sun', minutes: 0 }
  ],
  monthlyStats: {
    conceptsLearned: 5,
    quizzesTaken: 12,
    averageScore: 85,
    timeSpent: 420 // minutes
  }
};

interface ProgressDashboardProps {
  userId?: string;
}

const ProgressDashboard: React.FC<ProgressDashboardProps> = ({ userId }) => {
  const [progressData] = useState(MOCK_PROGRESS_DATA);
  const [selectedTimeframe, setSelectedTimeframe] = useState<'week' | 'month' | 'year'>('week');

  const formatTime = (minutes: number): string => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    if (hours > 0) {
      return `${hours}h ${mins}m`;
    }
    return `${mins}m`;
  };

  const getCategoryColor = (category: Category): string => {
    switch (category) {
      case 'ALGEBRA': return 'bg-blue-500';
      case 'CALCULUS': return 'bg-green-500';
      case 'GEOMETRY': return 'bg-purple-500';
      case 'TRIGONOMETRY': return 'bg-orange-500';
      case 'STATISTICS': return 'bg-red-500';
      case 'LINEAR_ALGEBRA': return 'bg-pink-500';
      case 'DIFFERENTIAL_EQUATIONS': return 'bg-indigo-500';
      default: return 'bg-gray-500';
    }
  };

  const StatsCard = ({ icon, title, value, subtitle, color = "text-blue-500" }: {
    icon: React.ReactNode;
    title: string;
    value: string | number;
    subtitle?: string;
    color?: string;
  }) => (
    <Card>
      <CardContent className="p-4">
        <div className="flex items-center space-x-3">
          <div className={`${color}`}>
            {icon}
          </div>
          <div className="flex-1">
            <p className="text-2xl font-bold">{value}</p>
            <p className="text-sm font-medium text-gray-900 dark:text-gray-100">{title}</p>
            {subtitle && (
              <p className="text-xs text-gray-500 dark:text-gray-400">{subtitle}</p>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Progress Dashboard</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Track your learning journey and achievements
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Button
            variant={selectedTimeframe === 'week' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setSelectedTimeframe('week')}
          >
            Week
          </Button>
          <Button
            variant={selectedTimeframe === 'month' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setSelectedTimeframe('month')}
          >
            Month
          </Button>
          <Button
            variant={selectedTimeframe === 'year' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setSelectedTimeframe('year')}
          >
            Year
          </Button>
        </div>
      </div>

      {/* Overview Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard
          icon={<Target className="h-8 w-8" />}
          title="Overall Progress"
          value={`${progressData.overallProgress}%`}
          subtitle="Across all topics"
          color="text-blue-500"
        />
        <StatsCard
          icon={<BookOpen className="h-8 w-8" />}
          title="Concepts Learned"
          value={`${progressData.conceptsCompleted}/${progressData.totalConcepts}`}
          subtitle="Topics mastered"
          color="text-green-500"
        />
        <StatsCard
          icon={<Brain className="h-8 w-8" />}
          title="Quizzes Completed"
          value={`${progressData.quizzesCompleted}/${progressData.totalQuizzes}`}
          subtitle="Practice sessions"
          color="text-purple-500"
        />
        <StatsCard
          icon={<Clock className="h-8 w-8" />}
          title="Study Time"
          value={formatTime(progressData.totalStudyTime)}
          subtitle="Total learning time"
          color="text-orange-500"
        />
      </div>

      {/* Main Content */}
      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="categories">By Category</TabsTrigger>
          <TabsTrigger value="achievements">Achievements</TabsTrigger>
          <TabsTrigger value="activity">Activity</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Weekly Goal Progress */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Target className="h-5 w-5" />
                  <span>Weekly Goal</span>
                </CardTitle>
                <CardDescription>
                  Your progress towards this week's study goal
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Progress</span>
                    <span>{formatTime(progressData.weeklyProgress)} / {formatTime(progressData.weeklyGoal)}</span>
                  </div>
                  <Progress 
                    value={(progressData.weeklyProgress / progressData.weeklyGoal) * 100} 
                    className="h-3"
                  />
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  {progressData.weeklyGoal - progressData.weeklyProgress > 0 
                    ? `${formatTime(progressData.weeklyGoal - progressData.weeklyProgress)} remaining to reach your goal`
                    : "🎉 Goal achieved! Great work!"
                  }
                </div>
              </CardContent>
            </Card>

            {/* Study Streak */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Activity className="h-5 w-5" />
                  <span>Study Streak</span>
                </CardTitle>
                <CardDescription>
                  Keep the momentum going!
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-center">
                  <div className="text-4xl font-bold text-orange-500 mb-2">
                    🔥 {progressData.studyStreak}
                  </div>
                  <p className="text-lg font-semibold">Day{progressData.studyStreak !== 1 ? 's' : ''}</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {progressData.studyStreak >= 7 
                      ? "Amazing streak! You're on fire!" 
                      : "Keep going to build your streak!"
                    }
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Weekly Activity Chart */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <BarChart3 className="h-5 w-5" />
                <span>Weekly Activity</span>
              </CardTitle>
              <CardDescription>
                Your study time for each day this week
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {progressData.weeklyActivity.map((day, index) => (
                  <div key={day.day} className="flex items-center space-x-4">
                    <div className="w-12 text-sm font-medium">{day.day}</div>
                    <div className="flex-1">
                      <div className="flex items-center space-x-2">
                        <div className="flex-1 bg-gray-200 dark:bg-gray-700 rounded-full h-3">
                          <div
                            className="bg-blue-500 h-3 rounded-full transition-all duration-300"
                            style={{ 
                              width: `${Math.max((day.minutes / 60) * 100, day.minutes > 0 ? 10 : 0)}%` 
                            }}
                          />
                        </div>
                        <div className="w-12 text-sm text-gray-600 dark:text-gray-400">
                          {day.minutes}m
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Recent Achievements */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Trophy className="h-5 w-5" />
                <span>Recent Achievements</span>
              </CardTitle>
              <CardDescription>
                Your latest accomplishments
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {progressData.recentAchievements.map((achievement) => (
                  <div key={achievement.id} className="flex items-center space-x-3 p-3 bg-gradient-to-r from-yellow-50 to-orange-50 dark:from-yellow-900/20 dark:to-orange-900/20 rounded-lg">
                    <div className="text-2xl">{achievement.icon}</div>
                    <div className="flex-1">
                      <p className="font-semibold">{achievement.name}</p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        Unlocked {new Date(achievement.unlockedAt).toLocaleDateString()}
                      </p>
                    </div>
                    <Award className="h-5 w-5 text-yellow-500" />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="categories" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {progressData.categoryProgress.map((category) => (
              <Card key={category.category}>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <span className="capitalize">{category.category.toLowerCase().replace('_', ' ')}</span>
                    <Badge variant="outline">
                      {category.completed}/{category.total}
                    </Badge>
                  </CardTitle>
                  <CardDescription>
                    {category.percentage.toFixed(0)}% Complete
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Progress value={category.percentage} className="h-3" />
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600 dark:text-gray-400">
                      {category.completed} concepts completed
                    </span>
                    <span className="text-gray-600 dark:text-gray-400">
                      {category.total - category.completed} remaining
                    </span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="achievements" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {/* Mock achievements with different states */}
            {[
              { name: 'First Steps', description: 'Complete your first concept', icon: '🎯', unlocked: true, progress: 100 },
              { name: 'Quiz Master', description: 'Score 100% on 5 quizzes', icon: '🧠', unlocked: true, progress: 100 },
              { name: 'Week Warrior', description: 'Maintain a 7-day study streak', icon: '🔥', unlocked: true, progress: 100 },
              { name: 'Function Explorer', description: 'Visualize 20 different functions', icon: '📊', unlocked: false, progress: 65 },
              { name: 'Speed Demon', description: 'Complete a quiz in under 5 minutes', icon: '⚡', unlocked: false, progress: 0 },
              { name: 'Perfectionist', description: 'Get 100% on 10 consecutive quizzes', icon: '💎', unlocked: false, progress: 30 }
            ].map((achievement, index) => (
              <Card key={index} className={achievement.unlocked ? 'bg-gradient-to-br from-yellow-50 to-orange-50 dark:from-yellow-900/20 dark:to-orange-900/20' : 'opacity-60'}>
                <CardContent className="p-4">
                  <div className="flex items-start space-x-3">
                    <div className="text-3xl">{achievement.icon}</div>
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-1">
                        <h3 className="font-semibold">{achievement.name}</h3>
                        {achievement.unlocked && <Award className="h-4 w-4 text-yellow-500" />}
                      </div>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                        {achievement.description}
                      </p>
                      {!achievement.unlocked && (
                        <div className="space-y-1">
                          <div className="flex justify-between text-xs">
                            <span>Progress</span>
                            <span>{achievement.progress}%</span>
                          </div>
                          <Progress value={achievement.progress} className="h-2" />
                        </div>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="activity" className="space-y-6">
          {/* Monthly Summary */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Calendar className="h-5 w-5" />
                <span>This Month's Summary</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-500">{progressData.monthlyStats.conceptsLearned}</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">Concepts Learned</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-500">{progressData.monthlyStats.quizzesTaken}</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">Quizzes Taken</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-purple-500">{progressData.monthlyStats.averageScore}%</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">Average Score</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-orange-500">{formatTime(progressData.monthlyStats.timeSpent)}</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">Time Spent</div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Activity Heatmap Placeholder */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <LineChart className="h-5 w-5" />
                <span>Activity Heatmap</span>
              </CardTitle>
              <CardDescription>
                Your daily activity over the past few months
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-7 gap-1">
                {Array.from({ length: 91 }, (_, i) => {
                  const intensity = Math.random();
                  return (
                    <div
                      key={i}
                      className={`w-4 h-4 rounded-sm ${
                        intensity > 0.7 ? 'bg-green-500' :
                        intensity > 0.4 ? 'bg-green-300' :
                        intensity > 0.1 ? 'bg-green-100' :
                        'bg-gray-100 dark:bg-gray-800'
                      }`}
                      title={`Day ${i + 1}: ${Math.round(intensity * 60)} minutes`}
                    />
                  );
                })}
              </div>
              <div className="flex items-center justify-between mt-4 text-sm text-gray-600 dark:text-gray-400">
                <span>Less</span>
                <div className="flex space-x-1">
                  <div className="w-3 h-3 bg-gray-100 dark:bg-gray-800 rounded-sm" />
                  <div className="w-3 h-3 bg-green-100 rounded-sm" />
                  <div className="w-3 h-3 bg-green-300 rounded-sm" />
                  <div className="w-3 h-3 bg-green-500 rounded-sm" />
                </div>
                <span>More</span>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ProgressDashboard;
