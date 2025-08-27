import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { TrendingUp, Clock, Target, Zap } from 'lucide-react';
import { ProfileData, profileService, ProfileStats as ProfileStatsType } from '@/services/ProfileService';

interface ProfileStatsProps {
  profileData: ProfileData;
}

const ProfileStats: React.FC<ProfileStatsProps> = ({ profileData }) => {
  const [statsData, setStatsData] = useState<ProfileStatsType | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadStats();
  }, [profileData.user.id]);

  const loadStats = async () => {
    try {
      setLoading(true);
      const stats = await profileService.getProfileStats(profileData.user.id);
      setStatsData(stats);
    } catch (error) {
      console.error('Error loading profile stats:', error);
      // Use fallback data if API fails
      setStatsData({
        weeklyActivity: [
          { day: 'Mon', minutes: 45 },
          { day: 'Tue', minutes: 32 },
          { day: 'Wed', minutes: 28 },
          { day: 'Thu', minutes: 51 },
          { day: 'Fri', minutes: 39 },
          { day: 'Sat', minutes: 22 },
          { day: 'Sun', minutes: 35 }
        ],
        activityBreakdown: [
          { name: 'Practice Mode', value: 60, color: '#3B82F6' },
          { name: 'Challenges', value: 25, color: '#10B981' },
          { name: 'Quizzes', value: 15, color: '#F59E0B' }
        ]
      });
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="text-center">Loading statistics...</div>
      </div>
    );
  }
  return (
    <div className="space-y-6">
      {/* Key Metrics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Clock className="h-5 w-5 text-blue-500" />
              <div>
                <p className="text-2xl font-bold">{profileData.stats.totalStudyTime}h</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">Total Study Time</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Target className="h-5 w-5 text-green-500" />
              <div>
                <p className="text-2xl font-bold">{profileData.stats.conceptsLearned}</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">Concepts Learned</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Zap className="h-5 w-5 text-yellow-500" />
              <div>
                <p className="text-2xl font-bold">{profileData.stats.currentStreak}</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">Day Streak</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <TrendingUp className="h-5 w-5 text-purple-500" />
              <div>
                <p className="text-2xl font-bold">{profileData.stats.averageSessionLength}m</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">Avg Session</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Weekly Activity</CardTitle>
            <CardDescription>Your study time this week</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={statsData?.weeklyActivity || []}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="day" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="minutes" fill="#3B82F6" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Learning Mode Breakdown</CardTitle>
            <CardDescription>How you spend your study time</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie
                  data={statsData?.activityBreakdown || []}
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  dataKey="value"
                >
                  {(statsData?.activityBreakdown || []).map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
            <div className="flex justify-center space-x-4 mt-4">
              {(statsData?.activityBreakdown || []).map((item, index) => (
                <div key={index} className="flex items-center space-x-2">
                  <div 
                    className="w-3 h-3 rounded-full" 
                    style={{ backgroundColor: item.color }}
                  />
                  <span className="text-sm">{item.name}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ProfileStats;
