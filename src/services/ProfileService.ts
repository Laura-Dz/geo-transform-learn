const API_BASE_URL = 'http://localhost:8080';

export interface ProfileData {
  user: {
    id: string;
    name: string;
    email: string;
    avatar: string | null;
    role: string;
  };
  bio: string | null;
  motivationalQuote: string | null;
  joinedDate: string;
  learningGoals: string[];
  achievements: string[];
  stats: {
    totalStudyTime: number;
    sessionsCompleted: number;
    averageSessionLength: number;
    conceptsLearned: number;
    challengesCompleted: number;
    quizzesCompleted: number;
    currentStreak: number;
    longestStreak: number;
    averageQuizScore: number;
  };
  recentActivity: Array<{
    type: string;
    title: string;
    score: number;
    timestamp: string;
  }>;
}

export interface ProfileUpdateData {
  bio?: string;
  motivationalQuote?: string;
  learningGoals?: string[];
  avatar?: string;
}

export interface ProfileStats {
  weeklyActivity: Array<{
    day: string;
    minutes: number;
  }>;
  activityBreakdown: Array<{
    name: string;
    value: number;
    color: string;
  }>;
}

class ProfileService {
  private getAuthHeaders(): HeadersInit {
    const token = localStorage.getItem('mathVizToken');
    return {
      'Content-Type': 'application/json',
      'Authorization': token ? `Bearer ${token}` : '',
    };
  }

  async getProfile(userId: string): Promise<ProfileData> {
    try {
      const response = await fetch(`${API_BASE_URL}/api/profile/${userId}`, {
        method: 'GET',
        headers: this.getAuthHeaders(),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to fetch profile');
      }

      return await response.json();
    } catch (error) {
      console.error('Error fetching profile:', error);
      throw error;
    }
  }

  async updateProfile(userId: string, updateData: ProfileUpdateData): Promise<{ message: string; user: any }> {
    try {
      const response = await fetch(`${API_BASE_URL}/api/profile/${userId}`, {
        method: 'PUT',
        headers: this.getAuthHeaders(),
        body: JSON.stringify(updateData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to update profile');
      }

      return await response.json();
    } catch (error) {
      console.error('Error updating profile:', error);
      throw error;
    }
  }

  async getProfileStats(userId: string): Promise<ProfileStats> {
    try {
      const response = await fetch(`${API_BASE_URL}/api/profile/${userId}/stats`, {
        method: 'GET',
        headers: this.getAuthHeaders(),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to fetch profile stats');
      }

      return await response.json();
    } catch (error) {
      console.error('Error fetching profile stats:', error);
      throw error;
    }
  }

  // Helper method to format join date
  formatJoinDate(dateString: string): string {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long'
    });
  }

  // Helper method to format time ago
  formatTimeAgo(timestamp: string): string {
    const now = new Date();
    const time = new Date(timestamp);
    const diffInHours = Math.floor((now.getTime() - time.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return 'Just now';
    if (diffInHours < 24) return `${diffInHours}h ago`;
    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays < 7) return `${diffInDays}d ago`;
    const diffInWeeks = Math.floor(diffInDays / 7);
    return `${diffInWeeks}w ago`;
  }

  // Helper method to format date
  formatDate(dateString: string): string {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  }

  // Helper method to get category color
  getCategoryColor(category: string): string {
    const colors = {
      Discovery: 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-300',
      Engagement: 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300',
      Interaction: 'bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-300',
      Creativity: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-300'
    };
    return colors[category as keyof typeof colors] || 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-300';
  }
}

export const profileService = new ProfileService();
export default ProfileService;
