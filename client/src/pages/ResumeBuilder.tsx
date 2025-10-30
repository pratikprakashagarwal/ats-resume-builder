import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Button,
  Grid,
  Paper,
  CircularProgress,
  Alert,
  Snackbar,
} from '@mui/material';
import SaveIcon from '@mui/icons-material/Save';
import DownloadIcon from '@mui/icons-material/Download';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useParams, useNavigate } from 'react-router-dom';
import { PersonalInfoForm } from '../components/resume/PersonalInfoForm';
import { WorkExperienceForm } from '../components/resume/WorkExperienceForm';
import { EducationForm } from '../components/resume/EducationForm';
import { SkillsForm } from '../components/resume/SkillsForm';
import { SmartPaginatedPreview } from '../components/resume/SmartPaginatedPreview';
import { resumeService } from '../services/resume.service';
import { exportToJSON, exportToPDF } from '../utils/export.utils';
import type { Resume, PersonalInfo, WorkExperience, Education, Skill } from '../types/resume.types';

export const ResumeBuilder: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  // State for resume data
  const [resume, setResume] = useState<Resume>({
    title: 'My Resume',
    workExperience: [],
    education: [],
    skills: [],
  });

  // Loading states
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [exporting, setExporting] = useState(false);
  
  // Snackbar for user feedback
  const [snackbar, setSnackbar] = useState({ 
    open: false, 
    message: '', 
    severity: 'success' as 'success' | 'error' 
  });

  /**
   * Load resume data when component mounts
   */
  useEffect(() => {
    if (id) {
      loadResume(id);
    } else {
      setLoading(false);
    }
  }, [id]);

  /**
   * Fetches resume data from the API
   */
  const loadResume = async (resumeId: string) => {
    try {
      setLoading(true);
      const data = await resumeService.getResumeById(resumeId);
      setResume(data);
    } catch (error) {
      console.error('Failed to load resume:', error);
      showSnackbar('Failed to load resume', 'error');
    } finally {
      setLoading(false);
    }
  };

  /**
   * Displays a snackbar message to the user
   */
  const showSnackbar = (message: string, severity: 'success' | 'error' = 'success') => {
    setSnackbar({ open: true, message, severity });
  };

  /**
   * Saves ALL resume sections to the database
   * Includes: Personal Info, Work Experience, Education, Skills
   */
  const handleSave = async () => {
    if (!id) {
      showSnackbar('Cannot save: Resume ID is missing', 'error');
      return;
    }

    setSaving(true);
    try {
      // Save all sections using the new comprehensive save method
      await resumeService.saveCompleteResume(id, resume);
      
      // Reload resume to get updated IDs from server
      await loadResume(id);
      
      showSnackbar('Resume saved successfully!');
    } catch (error) {
      console.error('Failed to save resume:', error);
      showSnackbar('Failed to save resume. Please try again.', 'error');
    } finally {
      setSaving(false);
    }
  };

  /**
   * Exports the resume as JSON
   */
  const handleExportJSON = async () => {
    try {
      setExporting(true);
      exportToJSON(resume);
      showSnackbar('Resume exported as JSON');
    } catch (error) {
      showSnackbar('Failed to export JSON', 'error');
    } finally {
      setExporting(false);
    }
  };

  /**
   * Exports the resume as PDF
   * Captures all pages of the resume
   */
  const handleExportPDF = async () => {
    try {
      setExporting(true);
      await exportToPDF(resume, resume.title || 'resume');
      showSnackbar('Resume exported as PDF');
    } catch (error) {
      console.error('PDF export error:', error);
      showSnackbar('Failed to export PDF', 'error');
    } finally {
      setExporting(false);
    }
  };

  /**
   * Keyboard shortcut handler for Ctrl+S (save)
   */
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 's') {
        e.preventDefault();
        handleSave();
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [resume]);

  // Show loading spinner while fetching data
  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
        <CircularProgress />
      </Box>
    );
  }

 //PRatik
 // ... (keep all imports and state as before)

return (
  <Box sx={{ height: '100vh', display: 'flex', flexDirection: 'column', bgcolor: 'background.default' }}>
    {/* Header - Fixed at top */}
    <Paper elevation={1} sx={{ p: 2, zIndex: 10, bgcolor: 'background.paper', flexShrink: 0 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Button
            startIcon={<ArrowBackIcon />}
            onClick={() => navigate('/')}
            variant="outlined"
          >
            Back
          </Button>
          <Typography variant="h5">{resume.title}</Typography>
        </Box>

        <Box sx={{ display: 'flex', gap: 2 }}>
          <Button
            variant="outlined"
            startIcon={exporting ? <CircularProgress size={16} /> : <DownloadIcon />}
            onClick={handleExportJSON}
            disabled={exporting}
          >
            {exporting ? 'Exporting...' : 'Export JSON'}
          </Button>

          <Button
            variant="outlined"
            startIcon={exporting ? <CircularProgress size={16} /> : <DownloadIcon />}
            onClick={handleExportPDF}
            disabled={exporting}
          >
            {exporting ? 'Exporting...' : 'Export PDF'}
          </Button>

          <Button
            variant="contained"
            startIcon={saving ? <CircularProgress size={16} color="inherit" /> : <SaveIcon />}
            onClick={handleSave}
            disabled={saving || !id}
          >
            {saving ? 'Saving...' : 'Save All'}
          </Button>
        </Box>
      </Box>

      <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
        Tip: Press Ctrl+S (Cmd+S on Mac) to save quickly
      </Typography>
    </Paper>

    {/* Content Area - Takes remaining height */}
    <Box sx={{ flex: 1, overflow: 'hidden' }}>
      <Grid container sx={{ height: '100%' }}>
        {/* Left Column - Forms (Full Height, Scrollable) */}
        <Grid item xs={12} lg={5} sx={{ height: '100%' }}>
          <Box
            sx={{
              height: '100%',
              overflowY: 'auto',
              px: 3,
              py: 2,
              '&::-webkit-scrollbar': {
                width: '8px',
              },
              '&::-webkit-scrollbar-track': {
                background: 'transparent',
              },
              '&::-webkit-scrollbar-thumb': {
                background: '#888',
                borderRadius: '4px',
              },
              '&::-webkit-scrollbar-thumb:hover': {
                background: '#555',
              },
            }}
          >
            <PersonalInfoForm
              data={resume.personalInfo || { fullName: '', email: '' }}
              onChange={(data: PersonalInfo) =>
                setResume({ ...resume, personalInfo: data })
              }
            />

            <WorkExperienceForm
              data={resume.workExperience || []}
              onChange={(data: WorkExperience[]) =>
                setResume({ ...resume, workExperience: data })
              }
            />

            <EducationForm
              data={resume.education || []}
              onChange={(data: Education[]) =>
                setResume({ ...resume, education: data })
              }
            />

            <SkillsForm
              data={resume.skills || []}
              onChange={(data: Skill[]) =>
                setResume({ ...resume, skills: data })
              }
            />
          </Box>
        </Grid>

        {/* Right Column - Preview (Full Height, NO Scroll) */}
        <Grid item xs={12} lg={7} sx={{ height: '100%' }}>
          <Box
            sx={{
              height: '100%',
              overflowY: 'auto', // Allow scrolling for navigation buttons
              px: 3,
              py: 2,
              display: 'flex',
              flexDirection: 'column',
              '&::-webkit-scrollbar': {
                width: '8px',
              },
              '&::-webkit-scrollbar-track': {
                background: 'transparent',
              },
              '&::-webkit-scrollbar-thumb': {
                background: '#888',
                borderRadius: '4px',
              },
            }}
          >
            <Typography variant="h6" gutterBottom>
              Live Preview
            </Typography>

            <SmartPaginatedPreview resume={resume} />
          </Box>
        </Grid>
      </Grid>
    </Box>

    {/* Snackbar */}
    <Snackbar
      open={snackbar.open}
      autoHideDuration={3000}
      onClose={() => setSnackbar({ ...snackbar, open: false })}
      anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
    >
      <Alert
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        severity={snackbar.severity}
        sx={{ width: '100%' }}
        elevation={6}
        variant="filled"
      >
        {snackbar.message}
      </Alert>
    </Snackbar>
  </Box>
);

 //PRATIk
};
