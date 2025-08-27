// Quiz Service - API integration for quiz functionality
import { Quiz, QuizAttempt, QuizQuestion } from '@/types/database';

const API_BASE_URL = 'http://localhost:8080';

export class QuizService {
  private getAuthHeaders(): HeadersInit {
    const token = localStorage.getItem('authToken');
    return {
      'Content-Type': 'application/json',
      ...(token && { 'Authorization': `Bearer ${token}` })
    };
  }

  /**
   * Get all available quizzes
   */
  async getQuizzes(filters?: {
    difficulty?: string;
    category?: string;
    conceptId?: string;
  }): Promise<Quiz[]> {
    try {
      const params = new URLSearchParams();
      if (filters?.difficulty) params.append('difficulty', filters.difficulty);
      if (filters?.category) params.append('category', filters.category);
      if (filters?.conceptId) params.append('conceptId', filters.conceptId);

      const response = await fetch(`${API_BASE_URL}/api/quizzes?${params}`, {
        headers: this.getAuthHeaders()
      });

      if (!response.ok) {
        throw new Error('Failed to fetch quizzes');
      }

      return await response.json();
    } catch (error) {
      console.error('Error fetching quizzes:', error);
      throw error;
    }
  }

  /**
   * Get specific quiz with questions
   */
  async getQuiz(quizId: string): Promise<Quiz> {
    try {
      const response = await fetch(`${API_BASE_URL}/api/quizzes/${quizId}`, {
        headers: this.getAuthHeaders()
      });

      if (!response.ok) {
        throw new Error('Failed to fetch quiz');
      }

      return await response.json();
    } catch (error) {
      console.error('Error fetching quiz:', error);
      throw error;
    }
  }

  /**
   * Submit quiz attempt
   */
  async submitQuizAttempt(quizId: string, attemptData: {
    userId: string;
    answers: Array<{
      questionId: string;
      userAnswer: string;
      timeSpent?: number;
    }>;
    timeSpent?: number;
    hintsUsed?: number;
    isTimedMode?: boolean;
  }): Promise<{
    attemptId: string;
    score: number;
    accuracy: number;
    correctAnswers: number;
    totalQuestions: number;
    categoryBreakdown: Record<string, { correct: number; total: number }>;
  }> {
    try {
      const response = await fetch(`${API_BASE_URL}/api/quizzes/${quizId}/attempt`, {
        method: 'POST',
        headers: this.getAuthHeaders(),
        body: JSON.stringify(attemptData)
      });

      if (!response.ok) {
        throw new Error('Failed to submit quiz attempt');
      }

      return await response.json();
    } catch (error) {
      console.error('Error submitting quiz attempt:', error);
      throw error;
    }
  }

  /**
   * Get user's quiz attempts
   */
  async getUserQuizAttempts(userId: string, options?: {
    limit?: number;
    offset?: number;
  }): Promise<QuizAttempt[]> {
    try {
      const params = new URLSearchParams();
      if (options?.limit) params.append('limit', options.limit.toString());
      if (options?.offset) params.append('offset', options.offset.toString());

      const response = await fetch(`${API_BASE_URL}/api/quizzes/user/${userId}/attempts?${params}`, {
        headers: this.getAuthHeaders()
      });

      if (!response.ok) {
        throw new Error('Failed to fetch user quiz attempts');
      }

      return await response.json();
    } catch (error) {
      console.error('Error fetching user quiz attempts:', error);
      throw error;
    }
  }
}

export const quizService = new QuizService();
