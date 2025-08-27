// Challenge Service - API integration for challenge functionality
import { Challenge, ChallengeSubmission } from '@/types/database';

const API_BASE_URL = 'http://localhost:8080';

export class ChallengeService {
  private getAuthHeaders(): HeadersInit {
    const token = localStorage.getItem('authToken');
    return {
      'Content-Type': 'application/json',
      ...(token && { 'Authorization': `Bearer ${token}` })
    };
  }

  /**
   * Get all available challenges
   */
  async getChallenges(filters?: {
    difficulty?: string;
    category?: string;
    type?: string;
  }): Promise<Challenge[]> {
    try {
      const params = new URLSearchParams();
      if (filters?.difficulty) params.append('difficulty', filters.difficulty);
      if (filters?.category) params.append('category', filters.category);
      if (filters?.type) params.append('type', filters.type);

      const response = await fetch(`${API_BASE_URL}/api/challenges?${params}`, {
        headers: this.getAuthHeaders()
      });

      if (!response.ok) {
        throw new Error('Failed to fetch challenges');
      }

      return await response.json();
    } catch (error) {
      console.error('Error fetching challenges:', error);
      throw error;
    }
  }

  /**
   * Get specific challenge
   */
  async getChallenge(challengeId: string): Promise<Challenge> {
    try {
      const response = await fetch(`${API_BASE_URL}/api/challenges/${challengeId}`, {
        headers: this.getAuthHeaders()
      });

      if (!response.ok) {
        throw new Error('Failed to fetch challenge');
      }

      return await response.json();
    } catch (error) {
      console.error('Error fetching challenge:', error);
      throw error;
    }
  }

  /**
   * Submit challenge solution
   */
  async submitChallenge(challengeId: string, submissionData: {
    userId: string;
    steps: any[];
    finalFunction: string;
    finalTransformations: any;
    timeSpent: number;
    hintsUsed?: number;
  }): Promise<{
    submissionId: string;
    isCorrect: boolean;
    efficiency: number;
    creativity: number;
    points: number;
  }> {
    try {
      const response = await fetch(`${API_BASE_URL}/api/challenges/${challengeId}/submit`, {
        method: 'POST',
        headers: this.getAuthHeaders(),
        body: JSON.stringify(submissionData)
      });

      if (!response.ok) {
        throw new Error('Failed to submit challenge');
      }

      return await response.json();
    } catch (error) {
      console.error('Error submitting challenge:', error);
      throw error;
    }
  }

  /**
   * Get user's challenge submissions
   */
  async getUserChallengeSubmissions(userId: string, options?: {
    limit?: number;
    offset?: number;
  }): Promise<ChallengeSubmission[]> {
    try {
      const params = new URLSearchParams();
      if (options?.limit) params.append('limit', options.limit.toString());
      if (options?.offset) params.append('offset', options.offset.toString());

      const response = await fetch(`${API_BASE_URL}/api/challenges/user/${userId}/submissions?${params}`, {
        headers: this.getAuthHeaders()
      });

      if (!response.ok) {
        throw new Error('Failed to fetch user challenge submissions');
      }

      return await response.json();
    } catch (error) {
      console.error('Error fetching user challenge submissions:', error);
      throw error;
    }
  }
}

export const challengeService = new ChallengeService();
