// Concept Service - API integration for concept functionality
import { Concept, Progress } from '@/types/database';

const API_BASE_URL = 'http://localhost:8080';

export class ConceptService {
  private getAuthHeaders(): HeadersInit {
    const token = localStorage.getItem('authToken');
    return {
      'Content-Type': 'application/json',
      ...(token && { 'Authorization': `Bearer ${token}` })
    };
  }

  /**
   * Get all available concepts
   */
  async getConcepts(filters?: {
    category?: string;
    difficulty?: string;
    tags?: string[];
  }): Promise<Concept[]> {
    try {
      const params = new URLSearchParams();
      if (filters?.category) params.append('category', filters.category);
      if (filters?.difficulty) params.append('difficulty', filters.difficulty);
      if (filters?.tags) params.append('tags', filters.tags.join(','));

      const response = await fetch(`${API_BASE_URL}/api/concepts?${params}`, {
        headers: this.getAuthHeaders()
      });

      if (!response.ok) {
        throw new Error('Failed to fetch concepts');
      }

      return await response.json();
    } catch (error) {
      console.error('Error fetching concepts:', error);
      throw error;
    }
  }

  /**
   * Get specific concept
   */
  async getConcept(conceptId: string): Promise<Concept> {
    try {
      const response = await fetch(`${API_BASE_URL}/api/concepts/${conceptId}`, {
        headers: this.getAuthHeaders()
      });

      if (!response.ok) {
        throw new Error('Failed to fetch concept');
      }

      return await response.json();
    } catch (error) {
      console.error('Error fetching concept:', error);
      throw error;
    }
  }

  /**
   * Get user's concept progress
   */
  async getUserConceptProgress(userId: string): Promise<Progress[]> {
    try {
      const response = await fetch(`${API_BASE_URL}/api/concepts/user/${userId}/progress`, {
        headers: this.getAuthHeaders()
      });

      if (!response.ok) {
        throw new Error('Failed to fetch user concept progress');
      }

      return await response.json();
    } catch (error) {
      console.error('Error fetching user concept progress:', error);
      throw error;
    }
  }

  /**
   * Update concept progress
   */
  async updateConceptProgress(conceptId: string, progressData: {
    userId: string;
    status: 'NOT_STARTED' | 'IN_PROGRESS' | 'COMPLETED' | 'MASTERED';
    score?: number;
    timeSpent: number;
  }): Promise<Progress> {
    try {
      const response = await fetch(`${API_BASE_URL}/api/concepts/${conceptId}/progress`, {
        method: 'POST',
        headers: this.getAuthHeaders(),
        body: JSON.stringify(progressData)
      });

      if (!response.ok) {
        throw new Error('Failed to update concept progress');
      }

      return await response.json();
    } catch (error) {
      console.error('Error updating concept progress:', error);
      throw error;
    }
  }
}

export const conceptService = new ConceptService();
