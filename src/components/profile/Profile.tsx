import React, { useState, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { profileService, ProfileData } from '@/services/ProfileService';
import { useAuth } from '@/hooks/useAuth';
import UserIdentityPanel from './UserIdentityPanel';
import ProfileStats from './ProfileStats';
import LearningStyleInsights from './LearningStyleInsights';
import ActivityTimeline from './ActivityTimeline';
import BadgeShowcase from './BadgeShowcase';
import LearningGoalsPanel from './LearningGoalsPanel';

interface ProfileProps {
  userId?: string;
  isOwnProfile?: boolean;
}

const Profile: React.FC<ProfileProps> = ({ 
  userId, 
  isOwnProfile = true 
}) => {
  const { user } = useAuth();
  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editedProfile, setEditedProfile] = useState<Partial<ProfileData>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const currentUserId = userId || user?.id;

  useEffect(() => {
    if (currentUserId) {
      loadProfile();
    }
  }, [currentUserId]);

  const loadProfile = async () => {
    if (!currentUserId) return;
    
    try {
      setLoading(true);
      setError(null);
      const profileData = await profileService.getProfile(currentUserId);
      setProfile(profileData);
      setEditedProfile(profileData);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load profile');
    } finally {
      setLoading(false);
    }
  };

  const handleEditToggle = () => {
    if (isEditing) {
      setEditedProfile(profile); // Reset changes
    }
    setIsEditing(!isEditing);
  };

  const handleSave = async () => {
    if (!currentUserId || !profile) return;
    
    try {
      const updateData = {
        bio: editedProfile.bio,
        motivationalQuote: editedProfile.motivationalQuote,
        learningGoals: editedProfile.learningGoals,
        avatar: editedProfile.user?.avatar
      };
      
      await profileService.updateProfile(currentUserId, updateData);
      await loadProfile(); // Reload profile data
      setIsEditing(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save profile');
    }
  };

  const handleCancel = () => {
    setEditedProfile(profile || {});
    setIsEditing(false);
  };

  const handleProfileChange = (updates: any) => {
    setEditedProfile(prev => ({ ...prev, ...updates }));
  };

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto p-6">
        <div className="flex items-center justify-center h-64">
          <div className="text-lg">Loading profile...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-6xl mx-auto p-6">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <h3 className="text-red-800 font-medium">Error loading profile</h3>
          <p className="text-red-600 mt-1">{error}</p>
          <button 
            onClick={loadProfile}
            className="mt-3 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="max-w-6xl mx-auto p-6">
        <div className="text-center text-gray-500">No profile data available</div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      {/* User Identity Section */}
      <UserIdentityPanel
        profile={profile}
        isEditing={isEditing}
        editedProfile={editedProfile}
        isOwnProfile={isOwnProfile}
        onEditToggle={handleEditToggle}
        onSave={handleSave}
        onCancel={handleCancel}
        onProfileChange={handleProfileChange}
        formatJoinDate={profileService.formatJoinDate}
      />

      {/* Tabbed Content */}
      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="stats">Statistics</TabsTrigger>
          <TabsTrigger value="goals">Goals</TabsTrigger>
          <TabsTrigger value="badges">Badges</TabsTrigger>
          <TabsTrigger value="activity">Activity</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <LearningStyleInsights />
          <LearningGoalsPanel
            isEditing={isEditing}
            isOwnProfile={isOwnProfile}
            formatDate={profileService.formatDate}
            profileData={profile}
          />
        </TabsContent>

        <TabsContent value="stats">
          <ProfileStats profileData={profile} />
        </TabsContent>

        <TabsContent value="goals">
          <LearningGoalsPanel
            isEditing={isEditing}
            isOwnProfile={isOwnProfile}
            formatDate={profileService.formatDate}
            profileData={profile}
          />
        </TabsContent>

        <TabsContent value="badges">
          <BadgeShowcase
            formatTimeAgo={profileService.formatTimeAgo}
            getCategoryColor={profileService.getCategoryColor}
            profileData={profile}
          />
        </TabsContent>

        <TabsContent value="activity">
          <ActivityTimeline 
            formatTimeAgo={profileService.formatTimeAgo} 
            profileData={profile}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Profile;
