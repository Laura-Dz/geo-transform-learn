import React from 'react';
import { useParams } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import Profile from '@/components/profile/Profile';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

const ProfilePage: React.FC = () => {
  const { userId } = useParams<{ userId?: string }>();
  const { user, isLoading: authLoading } = useAuth();
  
  // If no userId is provided, show the current user's profile
  const isOwnProfile = !userId || user?.id === userId;
  const profileUserId = userId || user?.id;

  if (authLoading) {
    return (
      <div className="container mx-auto p-6 max-w-6xl">
        <Card>
          <CardHeader>
            <Skeleton className="h-8 w-48" />
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-4 w-1/2" />
              <Skeleton className="h-64 w-full mt-4" />
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto py-8 px-4">
        <Card className="border-0 shadow-sm">
          <CardHeader>
            <CardTitle className="text-2xl font-bold">
              {isOwnProfile ? 'Your Profile' : 'User Profile'}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Profile 
              userId={profileUserId} 
              isOwnProfile={isOwnProfile} 
            />
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ProfilePage;
