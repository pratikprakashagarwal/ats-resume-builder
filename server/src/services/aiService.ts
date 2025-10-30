import { openai, isAIEnabled } from '../config/openai.config';

/**
 * AIService - Handles all AI-powered resume enhancement features
 * Uses OpenAI's GPT models to generate and improve resume content
 * All methods implement error handling and fallback strategies
 */
export class AIService {
  /**
   * Generates a professional resume summary based on job title and experience
   * Uses GPT-3.5-turbo for cost-effective content generation
   * @param jobTitle - The job title for which to generate the summary
   * @param yearsOfExperience - Optional years of experience (default: not specified)
   * @returns Promise<string> - A 3-4 sentence professional summary
   * @throws Error if OpenAI API is not configured or request fails
   * @example
   * const summary = await aiService.generateSummary('Software Engineer', 5);
   * // Returns: "Experienced Software Engineer with 5 years of expertise..."
   */
  async generateSummary(jobTitle: string, yearsOfExperience?: number): Promise<string> {
    // Check if OpenAI API is configured
    if (!isAIEnabled()) {
      throw new Error('AI features are disabled. Please set OPENAI_API_KEY.');
    }

    // Construct the prompt for the AI
    const prompt = `Generate a professional resume summary for a ${jobTitle} position${
      yearsOfExperience ? ` with ${yearsOfExperience} years of experience` : ''
    }. 
    
    The summary should be:
    - 3-4 sentences long
    - ATS-friendly with relevant keywords
    - Highlight key skills and value proposition
    - Professional and impactful
    
    Return only the summary text, no additional formatting.`;

    try {
      const response = await openai.chat.completions.create({
        model: 'gpt-3.5-turbo', // Cost-effective model
        messages: [
          {
            role: 'system',
            content: 'You are an expert resume writer specializing in ATS-friendly, impactful professional summaries.',
          },
          { role: 'user', content: prompt },
        ],
        max_tokens: 200, // Limit token usage for cost control
        temperature: 0.7, // Balance creativity and consistency
      });

      return response.choices[0].message.content?.trim() || '';
    } catch (error: any) {
      // Log error for debugging
      console.error('OpenAI API Error:', error);
      
      // Provide user-friendly error message
      throw new Error(`AI service error: ${error.message}`);
    }
  }

  /**
   * Enhances a work experience bullet point with metrics and impact
   * Transforms basic descriptions into achievement-oriented statements
   * @param bulletPoint - The original bullet point text
   * @param jobTitle - The job title for context
   * @returns Promise<string> - Enhanced bullet point with metrics and action verbs
   * @throws Error if OpenAI API is not configured or request fails
   * @example
   * const enhanced = await aiService.enhanceBulletPoint(
   *   'Managed team projects',
   *   'Senior Software Engineer'
   * );
   * // Returns: "Led cross-functional team of 8 developers, delivering 12 projects..."
   */
  async enhanceBulletPoint(bulletPoint: string, jobTitle: string): Promise<string> {
    if (!isAIEnabled()) {
      throw new Error('AI features are disabled. Please set OPENAI_API_KEY.');
    }

    const prompt = `Enhance this work experience bullet point for a ${jobTitle} position:
    
    Original: "${bulletPoint}"
    
    Improve it by:
    - Adding quantifiable metrics where appropriate (e.g., percentages, numbers)
    - Using strong action verbs (led, achieved, implemented, drove, etc.)
    - Highlighting impact and business results
    - Making it ATS-friendly with keywords
    - Keeping it concise (1-2 lines maximum)
    
    Return only the enhanced bullet point.`;

    try {
      const response = await openai.chat.completions.create({
        model: 'gpt-3.5-turbo',
        messages: [
          {
            role: 'system',
            content: 'You are an expert resume writer. Enhance bullet points to be impactful and ATS-friendly.',
          },
          { role: 'user', content: prompt },
        ],
        max_tokens: 150,
        temperature: 0.7,
      });

      return response.choices[0].message.content?.trim() || bulletPoint;
    } catch (error: any) {
      console.error('OpenAI API Error:', error);
      throw new Error(`AI service error: ${error.message}`);
    }
  }

  /**
   * Suggests relevant skills based on a job description
   * Extracts both technical and soft skills mentioned in the job posting
   * @param jobDescription - The full job description text
   * @returns Promise<string[]> - Array of 8-12 relevant skills
   * @throws Error if OpenAI API is not configured or request fails
   * @example
   * const skills = await aiService.suggestSkills(jobDescription);
   * // Returns: ['React', 'Node.js', 'TypeScript', 'Team Leadership', ...]
   */
  async suggestSkills(jobDescription: string): Promise<string[]> {
    if (!isAIEnabled()) {
      throw new Error('AI features are disabled. Please set OPENAI_API_KEY.');
    }

    const prompt = `Analyze this job description and extract the most important skills required:
    
    ${jobDescription}
    
    Return 8-12 key skills that should be highlighted on a resume. Include both technical and soft skills.
    Format: Return as a comma-separated list only, no additional text.`;

    try {
      const response = await openai.chat.completions.create({
        model: 'gpt-3.5-turbo',
        messages: [
          {
            role: 'system',
            content: 'You are an ATS expert. Extract key skills from job descriptions accurately.',
          },
          { role: 'user', content: prompt },
        ],
        max_tokens: 200,
        temperature: 0.3, // Lower temperature for more consistent results
      });

      const skillsText = response.choices[0].message.content?.trim() || '';
      
      // Split comma-separated list and clean up
      return skillsText
        .split(',')
        .map((skill) => skill.trim())
        .filter(Boolean); // Remove empty strings
    } catch (error: any) {
      console.error('OpenAI API Error:', error);
      throw new Error(`AI service error: ${error.message}`);
    }
  }

  /**
   * Analyzes how well a resume matches a job description
   * Provides specific suggestions and identifies missing keywords
   * @param resumeContent - The full resume content as text
   * @param jobDescription - The target job description
   * @returns Promise<object> - Analysis with suggestions, missing keywords, and match score
   * @throws Error if OpenAI API is not configured or request fails
   * @example
   * const analysis = await aiService.tailorToJobDescription(resumeText, jobDesc);
   * // Returns: { suggestions: [...], missingKeywords: [...], matchScore: 75 }
   */
  async tailorToJobDescription(
    resumeContent: string,
    jobDescription: string
  ): Promise<{
    suggestions: string[];
    missingKeywords: string[];
    matchScore: number;
  }> {
    if (!isAIEnabled()) {
      throw new Error('AI features are disabled. Please set OPENAI_API_KEY.');
    }

    const prompt = `Compare this resume to the job description and provide tailoring suggestions:
    
    JOB DESCRIPTION:
    ${jobDescription}
    
    RESUME CONTENT:
    ${resumeContent}
    
    Analyze and return a JSON object with:
    1. "suggestions": Array of 5 specific, actionable suggestions to better match the job
    2. "missingKeywords": Array of important keywords missing from the resume
    3. "matchScore": Number from 0-100 indicating how well the resume fits the job
    
    Format as valid JSON only.`;

    try {
      const response = await openai.chat.completions.create({
        model: 'gpt-3.5-turbo',
        messages: [
          {
            role: 'system',
            content: 'You are an ATS expert analyzing resume-job fit. Always respond with valid JSON.',
          },
          { role: 'user', content: prompt },
        ],
        max_tokens: 500,
        temperature: 0.5,
        response_format: { type: 'json_object' }, // Enforce JSON response
      });

      // Parse the JSON response
      const result = JSON.parse(response.choices[0].message.content || '{}');
      
      return {
        suggestions: result.suggestions || [],
        missingKeywords: result.missingKeywords || [],
        matchScore: result.matchScore || 0,
      };
    } catch (error: any) {
      console.error('OpenAI API Error:', error);
      throw new Error(`AI service error: ${error.message}`);
    }
  }
}
