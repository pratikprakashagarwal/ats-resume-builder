import axios from 'axios';
import type { Resume, PersonalInfo, WorkExperience, Education, Skill } from '../types/resume.types';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

/**
 * Converts YYYY-MM date format to YYYY-MM-01 for database compatibility
 * PostgreSQL date type requires full date, so we default to first day of month
 */
const convertMonthToDate = (monthString: string | null | undefined): string | null => {
  if (!monthString) return null;
  
  // If already in full date format (YYYY-MM-DD), return as is
  if (/^\d{4}-\d{2}-\d{2}$/.test(monthString)) {
    return monthString;
  }
  
  // If in month format (YYYY-MM), append -01
  if (/^\d{4}-\d{2}$/.test(monthString)) {
    return `${monthString}-01`;
  }
  
  return null;
};

/**
 * Cleans work experience data before sending to API
 * - Converts date format from YYYY-MM to YYYY-MM-01
 * - Sets endDate to null if current position
 */
const cleanWorkExperience = (exp: Partial<WorkExperience>): Partial<WorkExperience> => {
  return {
    ...exp,
    startDate: convertMonthToDate(exp.startDate as string),
    endDate: exp.current ? null : convertMonthToDate(exp.endDate as string),
  };
};

/**
 * Cleans education data before sending to API
 * - Converts date format from YYYY-MM to YYYY-MM-01
 * - Sets endDate to null if currently studying
 */
const cleanEducation = (edu: Partial<Education>): Partial<Education> => {
  return {
    ...edu,
    startDate: convertMonthToDate(edu.startDate as string),
    endDate: edu.current ? null : convertMonthToDate(edu.endDate as string),
  };
};

/**
 * ResumeService - Handles all API calls related to resumes
 */
class ResumeService {
  /**
   * Creates a new resume
   */
  async createResume(title: string): Promise<Resume> {
    const response = await axios.post(`${API_BASE_URL}/resumes`, { title });
    return response.data;
  }

  /**
   * Retrieves all resumes
   */
  async getAllResumes(): Promise<Resume[]> {
    const response = await axios.get(`${API_BASE_URL}/resumes`);
    return response.data;
  }

  /**
   * Retrieves a specific resume by ID
   */
  async getResumeById(id: string): Promise<Resume> {
    const response = await axios.get(`${API_BASE_URL}/resumes/${id}`);
    return response.data;
  }

  /**
   * Deletes a resume
   */
  async deleteResume(id: string): Promise<void> {
    await axios.delete(`${API_BASE_URL}/resumes/${id}`);
  }

  /**
   * Updates resume title
   */
  async updateResume(id: string, data: Partial<Resume>): Promise<Resume> {
    const response = await axios.put(`${API_BASE_URL}/resumes/${id}`, data);
    return response.data;
  }

  // ==================== Personal Info ====================

  /**
   * Updates personal information for a resume
   */
  async updatePersonalInfo(resumeId: string, data: Partial<PersonalInfo>): Promise<PersonalInfo> {
    const response = await axios.put(
      `${API_BASE_URL}/resumes/${resumeId}/personal-info`,
      data
    );
    return response.data;
  }

  // ==================== Work Experience ====================

  /**
   * Adds a new work experience entry
   */
  async addWorkExperience(resumeId: string, data: Partial<WorkExperience>): Promise<WorkExperience> {
    const cleanedData = cleanWorkExperience(data);
    console.log('Adding work experience with cleaned data:', cleanedData);
    
    const response = await axios.post(
      `${API_BASE_URL}/resumes/${resumeId}/work-experience`,
      cleanedData
    );
    console.log('Work experience added:', response.data);
    return response.data;
  }

  /**
   * Updates an existing work experience entry
   */
  async updateWorkExperience(id: string, data: Partial<WorkExperience>): Promise<WorkExperience> {
    const cleanedData = cleanWorkExperience(data);
    console.log('Updating work experience with cleaned data:', cleanedData);
    
    const response = await axios.put(
      `${API_BASE_URL}/resumes/work-experience/${id}`,
      cleanedData
    );
    console.log('Work experience updated:', response.data);
    return response.data;
  }

  /**
   * Deletes a work experience entry
   */
  async deleteWorkExperience(id: string): Promise<void> {
    console.log('Deleting work experience:', id);
    await axios.delete(`${API_BASE_URL}/resumes/work-experience/${id}`);
  }

  // ==================== Education ====================

  /**
   * Adds a new education entry
   */
  async addEducation(resumeId: string, data: Partial<Education>): Promise<Education> {
    const cleanedData = cleanEducation(data);
    console.log('Adding education with cleaned data:', cleanedData);
    
    const response = await axios.post(
      `${API_BASE_URL}/resumes/${resumeId}/education`,
      cleanedData
    );
    console.log('Education added:', response.data);
    return response.data;
  }

  /**
   * Updates an existing education entry
   */
  async updateEducation(id: string, data: Partial<Education>): Promise<Education> {
    const cleanedData = cleanEducation(data);
    console.log('Updating education with cleaned data:', cleanedData);
    
    const response = await axios.put(
      `${API_BASE_URL}/resumes/education/${id}`,
      cleanedData
    );
    console.log('Education updated:', response.data);
    return response.data;
  }

  /**
   * Deletes an education entry
   */
  async deleteEducation(id: string): Promise<void> {
    console.log('Deleting education:', id);
    await axios.delete(`${API_BASE_URL}/resumes/education/${id}`);
  }

  // ==================== Skills ====================

  /**
   * Adds a new skill
   */
  async addSkill(resumeId: string, data: Partial<Skill>): Promise<Skill> {
    console.log('Adding skill:', data);
    const response = await axios.post(
      `${API_BASE_URL}/resumes/${resumeId}/skills`,
      data
    );
    console.log('Skill added:', response.data);
    return response.data;
  }

  /**
   * Updates an existing skill
   */
  async updateSkill(id: string, data: Partial<Skill>): Promise<Skill> {
    console.log('Updating skill:', id, data);
    const response = await axios.put(
      `${API_BASE_URL}/resumes/skills/${id}`,
      data
    );
    console.log('Skill updated:', response.data);
    return response.data;
  }

  /**
   * Deletes a skill
   */
  async deleteSkill(id: string): Promise<void> {
    console.log('Deleting skill:', id);
    await axios.delete(`${API_BASE_URL}/resumes/skills/${id}`);
  }

  // ==================== Complete Save ====================

  /**
   * Saves entire resume (all sections)
   * Syncs personal info, work experience, education, and skills
   */
  async saveCompleteResume(resumeId: string, resume: Resume): Promise<void> {
    console.log('Starting complete resume save for:', resumeId);
    console.log('Resume data:', resume);

    try {
      // 1. Save personal info
      console.log('Saving personal info...');
      if (resume.personalInfo) {
        await this.updatePersonalInfo(resumeId, resume.personalInfo);
        console.log('✓ Personal info saved');
      }

      // 2. Get current server state
      console.log('Fetching current server state...');
      const serverResume = await this.getResumeById(resumeId);
      console.log('Server resume:', serverResume);

      // 3. Save work experience
      console.log('Saving work experience...');
      if (resume.workExperience && resume.workExperience.length > 0) {
        console.log('Local work experience:', resume.workExperience);
        console.log('Server work experience:', serverResume.workExperience);

        // Delete removed items
        const localIds = resume.workExperience
          .map(e => e.id)
          .filter(id => id !== undefined && id !== null && id !== '');
        
        const toDelete = (serverResume.workExperience || []).filter(
          e => e.id && !localIds.includes(e.id)
        );

        console.log('Work items to delete:', toDelete);
        for (const exp of toDelete) {
          if (exp.id) {
            await this.deleteWorkExperience(exp.id);
          }
        }

        // Add or update items
        for (const exp of resume.workExperience) {
          try {
            if (exp.id) {
              // Update existing
              console.log('Updating existing work experience:', exp.id);
              await this.updateWorkExperience(exp.id, exp);
            } else {
              // Add new
              console.log('Adding new work experience');
              await this.addWorkExperience(resumeId, exp);
            }
          } catch (error) {
            console.error('Failed to save work experience item:', exp, error);
            throw error;
          }
        }
        console.log('✓ Work experience saved');
      } else {
        console.log('No work experience to save');
      }

      // 4. Save education
      console.log('Saving education...');
      if (resume.education && resume.education.length > 0) {
        console.log('Local education:', resume.education);
        console.log('Server education:', serverResume.education);

        // Delete removed items
        const localIds = resume.education
          .map(e => e.id)
          .filter(id => id !== undefined && id !== null && id !== '');
        
        const toDelete = (serverResume.education || []).filter(
          e => e.id && !localIds.includes(e.id)
        );

        console.log('Education items to delete:', toDelete);
        for (const edu of toDelete) {
          if (edu.id) {
            await this.deleteEducation(edu.id);
          }
        }

        // Add or update items
        for (const edu of resume.education) {
          try {
            if (edu.id) {
              // Update existing
              console.log('Updating existing education:', edu.id);
              await this.updateEducation(edu.id, edu);
            } else {
              // Add new
              console.log('Adding new education');
              await this.addEducation(resumeId, edu);
            }
          } catch (error) {
            console.error('Failed to save education item:', edu, error);
            throw error;
          }
        }
        console.log('✓ Education saved');
      } else {
        console.log('No education to save');
      }

      // 5. Save skills
      console.log('Saving skills...');
      if (resume.skills && resume.skills.length > 0) {
        console.log('Local skills:', resume.skills);
        console.log('Server skills:', serverResume.skills);

        // Delete removed items
        const localIds = resume.skills
          .map(s => s.id)
          .filter(id => id !== undefined && id !== null && id !== '');
        
        const toDelete = (serverResume.skills || []).filter(
          s => s.id && !localIds.includes(s.id)
        );

        console.log('Skills to delete:', toDelete);
        for (const skill of toDelete) {
          if (skill.id) {
            await this.deleteSkill(skill.id);
          }
        }

        // Add or update items
        for (const skill of resume.skills) {
          try {
            if (skill.id) {
              // Update existing
              console.log('Updating existing skill:', skill.id);
              await this.updateSkill(skill.id, skill);
            } else {
              // Add new
              console.log('Adding new skill');
              await this.addSkill(resumeId, skill);
            }
          } catch (error) {
            console.error('Failed to save skill item:', skill, error);
            throw error;
          }
        }
        console.log('✓ Skills saved');
      } else {
        console.log('No skills to save');
      }

      console.log('✓✓✓ Complete resume save successful!');
    } catch (error) {
      console.error('❌ Failed to save resume:', error);
      if (axios.isAxiosError(error)) {
        console.error('Response data:', error.response?.data);
        console.error('Response status:', error.response?.status);
      }
      throw error;
    }
  }
}

export const resumeService = new ResumeService();
