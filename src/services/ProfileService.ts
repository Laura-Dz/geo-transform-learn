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
    const token = localStorage.getItem('authToken') || localStorage.getItem('mathVizToken');
    return {
      'Content-Type': 'application/json',
      ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
    };
  }

  async getProfile(userId: string): Promise<ProfileData> {
    try {
      console.log(`Fetching profile for user ${userId} from ${API_BASE_URL}/api/profile/${userId}`);
      const response = await fetch(`${API_BASE_URL}/api/profile/${userId}`, {
        method: 'GET',
        headers: this.getAuthHeaders(),
      });

      console.log('Response status:', response.status);
      
      if (!response.ok) {
        // First get the raw response text
        const responseText = await response.text();
        console.log('Raw server response:', responseText);
        
        let errorMessage = `HTTP error! status: ${response.status}`;
        
        // Try to parse as JSON
        try {
          const errorData = JSON.parse(responseText);
          console.error('Error response data (parsed):', errorData);
          errorMessage = errorData.message || errorData.error || errorMessage;
        } catch (e) {
          console.error('Could not parse error response as JSON, using raw text');
          errorMessage = responseText || errorMessage;
        }
        
        console.error('Final error message:', errorMessage);
        throw new Error(`Failed to fetch profile: ${errorMessage}`);
      }

      const data = await response.json();
      console.log('Profile data received:', data);
      
      if (!data.user || !data.joinedDate) {
        console.error('Missing required profile fields:', data);
        throw new Error('Invalid profile data received from server: missing required fields');
      }

      return data;
    } catch (error) {
      console.error('Error in getProfile:', error);
      throw error; // Re-throw to let the caller handle it
    }
  }

  async getProfileStats(userId: string): Promise<ProfileStats> {
    try {
      console.log(`Fetching stats for user ${userId} from ${API_BASE_URL}/api/profile/${userId}/stats`);
      const response = await fetch(`${API_BASE_URL}/api/profile/${userId}/stats`, {
        headers: this.getAuthHeaders(),
      });
      
      console.log('Stats response status:', response.status);
      
      if (!response.ok) {
        // First get the raw response text
        const responseText = await response.text();
        console.log('Raw stats server response:', responseText);
        
        let errorMessage = `HTTP error! status: ${response.status}`;
        
        // Try to parse as JSON
        try {
          const errorData = JSON.parse(responseText);
          console.error('Stats error response data (parsed):', errorData);
          errorMessage = errorData.message || errorData.error || errorMessage;
        } catch (e) {
          console.error('Could not parse stats error response as JSON, using raw text');
          errorMessage = responseText || errorMessage;
        }
        
        console.error('Final stats error message:', errorMessage);
        throw new Error(`Failed to fetch profile stats: ${errorMessage}`);
      }
      
      const data = await response.json();
      console.log('Stats data received:', data);
      
      if (!Array.isArray(data.weeklyActivity) || !Array.isArray(data.activityBreakdown)) {
        console.error('Invalid stats data structure received:', data);
        throw new Error('Invalid stats data received from server: missing required arrays');
      }
      
      return data;
    } catch (error) {
      console.error('Error in getProfileStats:', error);
      throw error; // Re-throw to let the caller handle it
    }
  }

  async updateProfile(userId: string, updateData: ProfileUpdateData): Promise<{ message: string; user: any }> {
    const response = await fetch(`${API_BASE_URL}/api/profile/${userId}`, {
      method: 'POST',
      headers: this.getAuthHeaders(),
      body: JSON.stringify(updateData),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || 'Failed to update profile');
    }

    return await response.json();
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
