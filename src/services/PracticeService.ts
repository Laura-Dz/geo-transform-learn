// Practice Service - API integration for practice functionality
import { PracticeScenario, PracticeProgress } from '@/types/database';

const API_BASE_URL = 'http://localhost:8080';

export class PracticeService {
  private getAuthHeaders(): HeadersInit {
    const token = localStorage.getItem('authToken');
    return {
      'Content-Type': 'application/json',
      ...(token && { 'Authorization': `Bearer ${token}` })
    };
  }

  /**
   * Get all available practice scenarios
   */
  async getPracticeScenarios(filters?: {
    context?: string;
    difficulty?: string;
  }): Promise<PracticeScenario[]> {
    try {
      const params = new URLSearchParams();
      if (filters?.context) params.append('context', filters.context);
      if (filters?.difficulty) params.append('difficulty', filters.difficulty);

      const response = await fetch(`${API_BASE_URL}/api/practice?${params}`, {
        headers: this.getAuthHeaders()
      });

      if (!response.ok) {
        throw new Error('Failed to fetch practice scenarios');
      }

      return await response.json();
    } catch (error) {
      console.error('Error fetching practice scenarios:', error);
      throw error;
    }
  }

  /**
   * Get specific practice scenario
   */
  async getPracticeScenario(scenarioId: string): Promise<PracticeScenario> {
    try {
      const response = await fetch(`${API_BASE_URL}/api/practice/${scenarioId}`, {
        headers: this.getAuthHeaders()
      });

      if (!response.ok) {
        throw new Error('Failed to fetch practice scenario');
      }

      return await response.json();
    } catch (error) {
      console.error('Error fetching practice scenario:', error);
      throw error;
    }
  }

  /**
   * Get user's practice progress
   */
  async getUserPracticeProgress(userId: string): Promise<PracticeProgress[]> {
    try {
      const response = await fetch(`${API_BASE_URL}/api/practice/user/${userId}/progress`, {
        headers: this.getAuthHeaders()
      });

      if (!response.ok) {
        throw new Error('Failed to fetch user practice progress');
      }

      return await response.json();
    } catch (error) {
      console.error('Error fetching user practice progress:', error);
      throw error;
    }
  }

  /**
   * Update practice progress
   */
  async updatePracticeProgress(scenarioId: string, progressData: {
    userId: string;
    completedSteps: string[];
    reflectionAnswers: any;
    timeSpent: number;
    insights?: string[];
  }): Promise<PracticeProgress> {
    try {
      const response = await fetch(`${API_BASE_URL}/api/practice/${scenarioId}/progress`, {
        method: 'POST',
        headers: this.getAuthHeaders(),
        body: JSON.stringify(progressData)
      });

      if (!response.ok) {
        throw new Error('Failed to update practice progress');
      }

      return await response.json();
    } catch (error) {
      console.error('Error updating practice progress:', error);
      throw error;
    }
  }

  /**
   * Complete practice scenario
   */
  async completePracticeScenario(scenarioId: string, completionData: {
    userId: string;
    finalReflections: any;
    insights: string[];
    reflectionAnswers?: any;
  }): Promise<PracticeProgress> {
    try {
      const response = await fetch(`${API_BASE_URL}/api/practice/${scenarioId}/complete`, {
        method: 'POST',
        headers: this.getAuthHeaders(),
        body: JSON.stringify(completionData)
      });

      if (!response.ok) {
        throw new Error('Failed to complete practice scenario');
      }

      return await response.json();
    } catch (error) {
      console.error('Error completing practice scenario:', error);
      throw error;
    }
  }
}

export const practiceService = new PracticeService();
