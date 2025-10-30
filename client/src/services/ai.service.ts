import { apiClient } from './api.service';
import type { AIEnhanceResponse } from '../types/resume.types';

export const aiService = {
  generateSummary: async (jobTitle: string, yearsOfExperience?: number): Promise<string> => {
    const response = await apiClient.post<AIEnhanceResponse>('/ai/generate-summary', {
      jobTitle,
      yearsOfExperience,
    });
    return response.data.summary || '';
  },

  enhanceBullet: async (bulletPoint: string, jobTitle: string): Promise<string> => {
    const response = await apiClient.post<AIEnhanceResponse>('/ai/enhance-bullet', {
      bulletPoint,
      jobTitle,
    });
    return response.data.enhanced || bulletPoint;
  },

  suggestSkills: async (jobDescription: string): Promise<string[]> => {
    const response = await apiClient.post<AIEnhanceResponse>('/ai/suggest-skills', {
      jobDescription,
    });
    return response.data.skills || [];
  },

  tailorResume: async (
    resumeContent: string,
    jobDescription: string
  ): Promise<{
    suggestions: string[];
    missingKeywords: string[];
    matchScore: number;
  }> => {
    const response = await apiClient.post<AIEnhanceResponse>('/ai/tailor-resume', {
      resumeContent,
      jobDescription,
    });
    return {
      suggestions: response.data.suggestions || [],
      missingKeywords: response.data.missingKeywords || [],
      matchScore: response.data.matchScore || 0,
    };
  },
};
