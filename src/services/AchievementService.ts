// Achievement Service - API integration for achievement functionality
import { Achievement, UserAchievement } from '@/types/database';

const API_BASE_URL = 'http://localhost:8080';

export class AchievementService {
  private getAuthHeaders(): HeadersInit {
    const token = localStorage.getItem('authToken');
    return {
      'Content-Type': 'application/json',
      ...(token && { 'Authorization': `Bearer ${token}` })
    };
  }

  /**
   * Get all available achievements
   */
  async getAchievements(filters?: {
    category?: string;
    isActive?: boolean;
  }): Promise<Achievement[]> {
    try {
      const params = new URLSearchParams();
      if (filters?.category) params.append('category', filters.category);
      if (filters?.isActive !== undefined) params.append('isActive', filters.isActive.toString());

      const response = await fetch(`${API_BASE_URL}/api/achievements?${params}`, {
        headers: this.getAuthHeaders()
      });

      if (!response.ok) {
        throw new Error('Failed to fetch achievements');
      }

      return await response.json();
    } catch (error) {
      console.error('Error fetching achievements:', error);
      throw error;
    }
  }

  /**
   * Get user's achievements
   */
  async getUserAchievements(userId: string): Promise<UserAchievement[]> {
    try {
      const response = await fetch(`${API_BASE_URL}/api/achievements/user/${userId}`, {
        headers: this.getAuthHeaders()
      });

      if (!response.ok) {
        throw new Error('Failed to fetch user achievements');
      }

      return await response.json();
    } catch (error) {
      console.error('Error fetching user achievements:', error);
      throw error;
    }
  }

  /**
   * Check and unlock achievements for user
   */
  async checkAchievements(userId: string, context?: any): Promise<{ newlyUnlocked: Achievement[] }> {
    try {
      const response = await fetch(`${API_BASE_URL}/api/achievements/check/${userId}`, {
        method: 'POST',
        headers: this.getAuthHeaders(),
        body: JSON.stringify({ context })
      });

      if (!response.ok) {
        throw new Error('Failed to check achievements');
      }

      return await response.json();
    } catch (error) {
      console.error('Error checking achievements:', error);
      throw error;
    }
  }
}

export const achievementService = new AchievementService();
