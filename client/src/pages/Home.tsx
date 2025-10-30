import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Button,
  Container,
  Grid,
  Card,
  CardContent,
  CardActions,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  CircularProgress,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import DescriptionIcon from '@mui/icons-material/Description';
import { useNavigate } from 'react-router-dom';
import { resumeService } from '../services/resume.service';
import type { Resume } from '../types/resume.types';

export const Home: React.FC = () => {
  // State management
  const [resumes, setResumes] = useState<Resume[]>([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [newResumeTitle, setNewResumeTitle] = useState('');
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const navigate = useNavigate();

  /**
   * Load all resumes when component mounts
   */
  useEffect(() => {
    loadResumes();
  }, []);

  /**
   * Fetches all resumes from the API
   */
  const loadResumes = async () => {
    try {
      setLoading(true);
      const data = await resumeService.getAllResumes();
      setResumes(data);
    } catch (error) {
      console.error('Failed to load resumes:', error);
    } finally {
      setLoading(false);
    }
  };

  /**
   * Creates a new resume and navigates to the editor
   */
  const handleCreateResume = async () => {
    if (!newResumeTitle.trim()) return;

    try {
      setCreating(true);
      const newResume = await resumeService.createResume(newResumeTitle);
      setOpenDialog(false);
      setNewResumeTitle('');
      navigate(`/resume/${newResume.id}`);
    } catch (error) {
      console.error('Failed to create resume:', error);
    } finally {
      setCreating(false);
    }
  };

  /**
   * Deletes a resume after confirmation
   * @param id - The ID of the resume to delete
   */
  const handleDeleteResume = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this resume?')) return;

    try {
      await resumeService.deleteResume(id);
      loadResumes(); // Reload the list
    } catch (error) {
      console.error('Failed to delete resume:', error);
    }
  };

  /**
   * Formats a date string for display
   * @param dateString - ISO date string
   * @returns Formatted date string
   */
  const formatDate = (dateString?: string) => {
    if (!dateString) return '';
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  /**
   * Shows loading spinner while fetching data
   */
  if (loading) {
    return (
      <Container maxWidth="lg">
        <Box sx={{ 
          display: 'flex', 
          justifyContent: 'center', 
          alignItems: 'center',
          minHeight: '60vh'
        }}>
          <CircularProgress />
        </Box>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg">
      {/* Page Header */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" gutterBottom>
          My Resumes
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Create and manage your ATS-friendly resumes with AI-powered enhancements
        </Typography>
      </Box>

      {/* Create New Resume Button */}
      <Button
        variant="contained"
        size="large"
        startIcon={<AddIcon />}
        onClick={() => setOpenDialog(true)}
        sx={{ mb: 3 }}
      >
        Create New Resume
      </Button>

      {/* Resume List or Empty State */}
      {resumes.length === 0 ? (
        // ==================== EMPTY STATE ====================
        <Box
          sx={{
            textAlign: 'center',
            py: 8,
            px: 3,
            bgcolor: 'background.paper',
            borderRadius: 2,
            border: '2px dashed',
            borderColor: 'divider',
          }}
        >
          {/* Large icon */}
          <DescriptionIcon 
            sx={{ 
              fontSize: 80, 
              color: 'text.secondary',
              mb: 2,
              opacity: 0.5
            }} 
          />
          
          {/* Empty state heading */}
          <Typography variant="h5" color="text.secondary" gutterBottom>
            No resumes yet
          </Typography>
          
          {/* Empty state description */}
          <Typography variant="body1" color="text.secondary" sx={{ mb: 3, maxWidth: '500px', mx: 'auto' }}>
            Get started by creating your first ATS-friendly resume. 
            Our AI-powered tools will help you craft a professional resume that stands out.
          </Typography>
          
          {/* CTA button */}
          <Button
            variant="contained"
            size="large"
            startIcon={<AddIcon />}
            onClick={() => setOpenDialog(true)}
          >
            Create Your First Resume
          </Button>

          {/* Feature highlights */}
          <Box sx={{ mt: 4, display: 'flex', justifyContent: 'center', gap: 4, flexWrap: 'wrap' }}>
            <Box sx={{ textAlign: 'center', maxWidth: '150px' }}>
              <Typography variant="caption" display="block" color="primary" fontWeight="bold">
                ✨ AI-Powered
              </Typography>
              <Typography variant="caption" display="block" color="text.secondary">
                Smart content suggestions
              </Typography>
            </Box>
            <Box sx={{ textAlign: 'center', maxWidth: '150px' }}>
              <Typography variant="caption" display="block" color="primary" fontWeight="bold">
                📄 ATS-Friendly
              </Typography>
              <Typography variant="caption" display="block" color="text.secondary">
                Optimized for applicant tracking systems
              </Typography>
            </Box>
            <Box sx={{ textAlign: 'center', maxWidth: '150px' }}>
              <Typography variant="caption" display="block" color="primary" fontWeight="bold">
                💾 Export Options
              </Typography>
              <Typography variant="caption" display="block" color="text.secondary">
                PDF and JSON formats
              </Typography>
            </Box>
          </Box>
        </Box>
      ) : (
        // ==================== RESUME GRID ====================
        <Grid container spacing={3}>
          {resumes.map((resume) => (
            <Grid item xs={12} sm={6} md={4} key={resume.id}>
              <Card 
                elevation={2}
                sx={{
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  transition: 'transform 0.2s, box-shadow 0.2s',
                  '&:hover': {
                    transform: 'translateY(-4px)',
                    boxShadow: 4,
                  }
                }}
              >
                <CardContent sx={{ flexGrow: 1 }}>
                  <Typography variant="h6" gutterBottom noWrap>
                    {resume.title}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Last updated: {formatDate(resume.updatedAt)}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                    Created: {formatDate(resume.createdAt)}
                  </Typography>
                </CardContent>
                <CardActions sx={{ justifyContent: 'space-between', px: 2, pb: 2 }}>
                  <Button
                    size="small"
                    startIcon={<EditIcon />}
                    onClick={() => navigate(`/resume/${resume.id}`)}
                  >
                    Edit
                  </Button>
                  <IconButton
                    size="small"
                    color="error"
                    onClick={() => handleDeleteResume(resume.id!)}
                    aria-label="Delete resume"
                  >
                    <DeleteIcon />
                  </IconButton>
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}

      {/* Create Resume Dialog */}
      <Dialog 
        open={openDialog} 
        onClose={() => !creating && setOpenDialog(false)} 
        maxWidth="sm" 
        fullWidth
      >
        <DialogTitle>Create New Resume</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Resume Title"
            fullWidth
            value={newResumeTitle}
            onChange={(e) => setNewResumeTitle(e.target.value)}
            placeholder="e.g., Software Engineer Resume"
            onKeyPress={(e) => e.key === 'Enter' && !creating && handleCreateResume()}
            disabled={creating}
            helperText="Choose a descriptive title to easily identify this resume"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)} disabled={creating}>
            Cancel
          </Button>
          <Button
            onClick={handleCreateResume}
            variant="contained"
            disabled={!newResumeTitle.trim() || creating}
            startIcon={creating ? <CircularProgress size={16} /> : <AddIcon />}
          >
            {creating ? 'Creating...' : 'Create'}
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};
