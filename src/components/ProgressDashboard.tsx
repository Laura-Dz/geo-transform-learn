
import React from 'react';
import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';
import { TrendingUp, Clock, Award, Target, BookOpen, Calculator } from 'lucide-react';

interface ProgressDashboardProps {
  user: {
    id: string;
    name: string;
    email: string;
  };
  sessionProgress: {
    transformationsApplied: number;
    timeSpent: number;
    conceptsExplored: string[];
  };
}

// Mock data for demonstration
const mockProgressData = [
  { session: 1, score: 65, timeSpent: 15 },
  { session: 2, score: 72, timeSpent: 18 },
  { session: 3, score: 78, timeSpent: 22 },
  { session: 4, score: 85, timeSpent: 25 },
  { session: 5, score: 90, timeSpent: 20 },
];

const mockSkillsData = [
  { skill: 'Translation', progress: 85 },
  { skill: 'Scaling', progress: 70 },
  { skill: 'Reflection', progress: 60 },
  { skill: '3D Visualization', progress: 75 },
];

const mockAchievements = [
  { title: 'First Steps', description: 'Completed your first transformation', earned: true, icon: '🎯' },
  { title: 'Quiz Master', description: 'Scored 80% or higher on a quiz', earned: true, icon: '🏆' },
  { title: 'Explorer', description: 'Explored all transformation types', earned: false, icon: '🗺️' },
  { title: 'Persistent Learner', description: 'Completed 5 learning sessions', earned: false, icon: '⭐' },
];

const ProgressDashboard: React.FC<ProgressDashboardProps> = ({
  user,
  sessionProgress
}) => {
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}m ${secs}s`;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card className="p-6 bg-gradient-to-r from-cyan-500/10 to-blue-500/10 border-cyan-500/20">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-white">Welcome back, {user.name}!</h2>
            <p className="text-gray-300">Track your mathematical journey and celebrate your achievements.</p>
          </div>
          <div className="text-right">
            <div className="text-3xl font-bold text-cyan-400">Level 3</div>
            <p className="text-sm text-gray-400">Mathematics Explorer</p>
          </div>
        </div>
      </Card>

      {/* Current Session Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="p-4 bg-black/30 border-white/20">
          <div className="flex items-center space-x-3">
            <Calculator className="h-8 w-8 text-cyan-400" />
            <div>
              <p className="text-sm text-gray-400">Transformations</p>
              <p className="text-2xl font-bold text-white">{sessionProgress.transformationsApplied}</p>
            </div>
          </div>
        </Card>

        <Card className="p-4 bg-black/30 border-white/20">
          <div className="flex items-center space-x-3">
            <Clock className="h-8 w-8 text-green-400" />
            <div>
              <p className="text-sm text-gray-400">Time Spent</p>
              <p className="text-2xl font-bold text-white">{formatTime(sessionProgress.timeSpent)}</p>
            </div>
          </div>
        </Card>

        <Card className="p-4 bg-black/30 border-white/20">
          <div className="flex items-center space-x-3">
            <BookOpen className="h-8 w-8 text-yellow-400" />
            <div>
              <p className="text-sm text-gray-400">Concepts Explored</p>
              <p className="text-2xl font-bold text-white">{sessionProgress.conceptsExplored.length}</p>
            </div>
          </div>
        </Card>

        <Card className="p-4 bg-black/30 border-white/20">
          <div className="flex items-center space-x-3">
            <Target className="h-8 w-8 text-purple-400" />
            <div>
              <p className="text-sm text-gray-400">Avg Quiz Score</p>
              <p className="text-2xl font-bold text-white">82%</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Progress Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Learning Progress Over Time */}
        <Card className="p-6 bg-black/30 border-white/20">
          <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
            <TrendingUp className="h-5 w-5 mr-2 text-cyan-400" />
            Learning Progress
          </h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={mockProgressData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis 
                  dataKey="session" 
                  stroke="#9CA3AF"
                  tick={{ fill: '#9CA3AF' }}
                />
                <YAxis 
                  stroke="#9CA3AF"
                  tick={{ fill: '#9CA3AF' }}
                />
                <Tooltip 
                  labelStyle={{ color: '#000' }}
                  contentStyle={{ 
                    backgroundColor: '#1F2937', 
                    border: '1px solid #374151',
                    borderRadius: '8px'
                  }}
                />
                <Line 
                  type="monotone" 
                  dataKey="score" 
                  stroke="#06B6D4" 
                  strokeWidth={3}
                  dot={{ fill: '#06B6D4', strokeWidth: 2, r: 6 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* Skills Progress */}
        <Card className="p-6 bg-black/30 border-white/20">
          <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
            <Award className="h-5 w-5 mr-2 text-yellow-400" />
            Skills Development
          </h3>
          <div className="space-y-4">
            {mockSkillsData.map((skill, index) => (
              <div key={index} className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-white font-medium">{skill.skill}</span>
                  <span className="text-cyan-400">{skill.progress}%</span>
                </div>
                <Progress value={skill.progress} className="h-2" />
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Achievements */}
      <Card className="p-6 bg-black/30 border-white/20">
        <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
          <Award className="h-5 w-5 mr-2 text-yellow-400" />
          Achievements
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {mockAchievements.map((achievement, index) => (
            <div 
              key={index}
              className={`p-4 rounded-lg border-2 transition-all ${
                achievement.earned 
                  ? 'bg-yellow-500/10 border-yellow-500/30 shadow-lg shadow-yellow-500/10' 
                  : 'bg-gray-800/30 border-gray-600/30'
              }`}
            >
              <div className="text-center">
                <div className={`text-3xl mb-2 ${achievement.earned ? 'grayscale-0' : 'grayscale'}`}>
                  {achievement.icon}
                </div>
                <h4 className={`font-semibold mb-1 ${
                  achievement.earned ? 'text-yellow-300' : 'text-gray-400'
                }`}>
                  {achievement.title}
                </h4>
                <p className={`text-xs ${
                  achievement.earned ? 'text-yellow-200' : 'text-gray-500'
                }`}>
                  {achievement.description}
                </p>
                {achievement.earned && (
                  <Badge className="mt-2 bg-yellow-500/20 text-yellow-300 border-yellow-500/30">
                    Earned!
                  </Badge>
                )}
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* Learning Goals */}
      <Card className="p-6 bg-black/30 border-white/20">
        <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
          <Target className="h-5 w-5 mr-2 text-purple-400" />
          Learning Goals
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-slate-800/50 rounded-lg p-4 border border-white/10">
            <h4 className="font-semibold text-white mb-2">Weekly Goal</h4>
            <p className="text-sm text-gray-300 mb-3">Complete 5 transformation exercises</p>
            <Progress value={60} className="h-2 mb-2" />
            <p className="text-xs text-gray-400">3 of 5 completed</p>
          </div>
          
          <div className="bg-slate-800/50 rounded-lg p-4 border border-white/10">
            <h4 className="font-semibold text-white mb-2">Quiz Mastery</h4>
            <p className="text-sm text-gray-300 mb-3">Achieve 85% average quiz score</p>
            <Progress value={82} className="h-2 mb-2" />
            <p className="text-xs text-gray-400">Current: 82%</p>
          </div>
          
          <div className="bg-slate-800/50 rounded-lg p-4 border border-white/10">
            <h4 className="font-semibold text-white mb-2">Study Time</h4>
            <p className="text-sm text-gray-300 mb-3">Study for 2 hours this week</p>
            <Progress value={75} className="h-2 mb-2" />
            <p className="text-xs text-gray-400">1.5 of 2 hours completed</p>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default ProgressDashboard;
